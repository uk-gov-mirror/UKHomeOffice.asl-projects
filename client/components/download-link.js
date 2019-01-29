import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Indent, Numbering } from 'docx';

import flatten from 'lodash/flatten';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    values: project,
    sections: Object.values(state.application)
  };
};

class DownloadLink extends React.Component {
  generate = () => {
    const doc = new Document();

    doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(40)
      .bold()
      .font('Helvetica')
      .spacing({ before: 360, after: 360 });

    doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(32)
      .bold()
      .font('Helvetica')
      .spacing({ before: 360, after: 360 });

    doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(24)
      .bold()
      .font('Helvetica')
      .spacing({ before: 360, after: 360 });

    doc.Styles.createParagraphStyle('body', 'Body')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(28)
      .font('Helvetica')
      .spacing({ before: 360, after: 360 });

    doc.Styles.createParagraphStyle('aside', 'Aside')
      .basedOn('Body')
      .next('Body')
      .quickFormat()
      .size(28)
      .color('999999')
      .italics();

    doc.createParagraph(this.props.values.title).heading1();

    this.props.sections.map(section => {
      doc.createParagraph(section.title).heading1();

      // each section has got subsections
      Object.values(section.subsections).map(({ title, fields, steps }) => {
        doc.createParagraph(title).heading2();

        let sectionFields;
        if (fields) {
          sectionFields = fields;
        }
        if (steps) {
          sectionFields = flatten(steps.map(step => step.fields));
        }

        if (sectionFields) {
          sectionFields.map(field => {
            this.props.values[field.name] +
              doc.createParagraph(field.label).heading3();
            const value = this.props.values[field.name];

            if (!value) {
              var paragraph = new Paragraph();
              paragraph.style('body');
              paragraph.addRun(new TextRun('No answer provided').italic());
              doc.addParagraph(paragraph);
            } else {
              switch (field.type) {
                case 'radio':
                case 'checkbox':
                  var label = field.options
                    ? field.options.find(o => o.value === value).label
                    : value;
                  doc.createParagraph(label).style('body');
                  break;
                case 'species-selector':
                  doc.createParagraph(value.join(',')).style('body');
                  break;
                case 'text':
                  if (typeof value == typeof true) {
                    value
                      ? doc.createParagraph('Yes').style('body')
                      : doc.createParagraph('No').style('body');
                  } else doc.createParagraph(value).style('body');
                  break;
                case 'duration':
                  doc.createParagraph('Years ' + value.years);
                  doc.createParagraph('Months ' + value.months);
                  break;
                case 'texteditor':
                  var content = JSON.parse(value);
                  var nodes = content.document.nodes;
                  var text;
                  nodes.forEach(node => {
                    switch (node.type) {
                      case 'heading-one': {
                        doc
                          .createParagraph(node.nodes[0].leaves[0].text.trim())
                          .heading1();
                        break;
                      }
                      case 'heading-two': {
                        doc
                          .createParagraph(node.nodes[0].leaves[0].text.trim())
                          .heading2();
                        break;
                      }
                      case 'block-quote': {
                        doc
                          .createParagraph(node.nodes[0].leaves[0].text.trim())
                          .style('aside');
                        break;
                      }
                      case 'numbered-list': {
                        const numbering = new Numbering();
                        const abstract = numbering.createAbstractNumbering();
                        abstract.createLevel(0, 'decimal', '%2.', 'start');
                        const concrete = numbering.createConcreteNumbering(
                          abstract
                        );
                        node.nodes.map(n => {
                          // TODO: the item may have marks
                          text = new TextRun(
                            n.nodes[0].leaves[0].text.trim()
                          ).size(28);
                          var paragraph = new Paragraph();
                          paragraph.setNumbering(concrete, 0);
                          paragraph.style('body');
                          paragraph.addRun(text);
                          doc.addParagraph(paragraph);
                        });
                        break;
                      }
                      case 'bulleted-list': {
                        node.nodes.map(n => {
                          // TODO: the item may have marks
                          text = new TextRun(
                            n.nodes[0].leaves[0].text.trim()
                          ).size(28);
                          var paragraph = new Paragraph();
                          paragraph.style('body').bullet();
                          paragraph.addRun(text);
                          doc.addParagraph(paragraph);
                        });
                        break;
                      }
                      case 'paragraph': {
                        node.nodes[0].leaves.map(leaf => {
                          text = new TextRun(leaf.text.trim());
                          if (text) {
                            leaf.marks.forEach(mark => {
                              switch (mark.type) {
                                case 'bold':
                                  text.bold();
                                  break;
                                // case 'code':
                                // return text.code();
                                case 'italic':
                                  text.italic();
                                  break;
                                case 'underlined':
                                  text.underline();
                                  break;
                                default:
                                  return text;
                              }
                            });
                            var paragraph = new Paragraph();
                            paragraph.style('body');
                            paragraph.addRun(text);
                            doc.addParagraph(paragraph);
                          }
                        });
                        break;
                      }
                      case 'image':
                        var img = doc.createImage(node.data.src);
                        img.scale(2);
                        break;
                      default:
                        break;
                    }
                  });
                  break;
                default:
                  break;
              }
            }
          });
        }
      });
    });
    const packer = new Packer();
    packer.toBlob(doc).then(blob => {
      saveAs(blob, this.props.values.title);
    });
  };

  render() {
    if (!this.props.project) {
      return null;
    }
    return (
      <a
        className={classnames('download', this.props.className)}
        href='#'
        onClick={this.generate}
      >
        Download
      </a>
    );
  }
}

export default connect(mapStateToProps)(DownloadLink);
