import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Indent, Numbering } from 'docx';

import flatten from 'lodash/flatten';
import SPECIES from '../constants/species';
import isUndefined from 'lodash/isUndefined';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    values: project,
    sections: Object.values(state.application)
  };
};

const renderTextEditor = (value, doc) => {
  // console.log('----------------------renderTextEditor begin-----------------------------------------');
  // console.log(JSON.stringify(value));
  // console.log('----------------------renderTextEditor end-----------------------------------------');

  var content = JSON.parse(value);
  var nodes = content.document.nodes;
  var text;
  nodes.forEach(node => {
    switch (node.type) {
      case 'heading-one': {
        doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading1();
        break;
      }
      case 'heading-two': {
        doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading2();
        break;
      }
      case 'block-quote': {
        doc.createParagraph(node.nodes[0].leaves[0].text.trim()).style('aside');
        break;
      }
      case 'numbered-list': {
        const numbering = new Numbering();
        const abstract = numbering.createAbstractNumbering();
        abstract.createLevel(0, 'decimal', '%2.', 'start');
        const concrete = numbering.createConcreteNumbering(abstract);
        node.nodes.map(n => {
          // TODO: the item may have marks
          text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(28);
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
          text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(28);
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
};

const renderDocument = (doc, field, values) => {
  const value = values[field.name];

  if (isUndefined(value)) {
    var paragraph = new Paragraph();
    paragraph.style('body');
    paragraph.addRun(new TextRun('No answer provided').italic());
    doc.addParagraph(paragraph);
  } else {
    switch (field.type) {
      case 'radio':
        var option;
        if (field.options) option = field.options.find(o => o.value === value);
        var label = option ? option.label : value;
        doc.createParagraph(label).style('body');
        if (option && option.reveal) {
          //make sure reveals are arrays everywhere
          //and then do the below for each reveal
          var reveals = !Array.isArray(option.reveal)
            ? [option.reveal]
            : option.reveal;
          reveals.map(reveal => {
            const revealValue = values[reveal.name];
            if (revealValue) {
              doc.createParagraph(reveal.label).heading3();
              switch (reveal.type) {
                case 'radio':
                case 'species-selector':
                  doc
                    .createParagraph(
                      reveal.options.find(r => r.value === revealValue)
                    )
                    .style('body');
                  break;
                case 'texteditor':
                  renderTextEditor(revealValue, doc);
                  break;
                default:
                  break;
              }
            }
          });
        }
        break;
      case 'species-selector':
        var text;
        value.map(specie => {
          text = new TextRun(
            flatten(Object.values(SPECIES)).find(s => s.value === specie).label
          ).size(28);
          var paragraph = new Paragraph();
          paragraph.style('body').bullet();
          paragraph.addRun(text);
          doc.addParagraph(paragraph);
        });
        const otherSpecies = values['species-other'];
        if (otherSpecies)
          otherSpecies.map(s => {
            text = new TextRun(s).size(28);
            var paragraph = new Paragraph();
            paragraph.style('body').bullet();
            paragraph.addRun(text);
            doc.addParagraph(paragraph);
          });
        break;
      case 'location-selector':
      case 'objective-selector':
      case 'checkbox':
        var text;
        value.map(item => {
          text = new TextRun(item).size(28);
          var paragraph = new Paragraph();
          paragraph.style('body').bullet();
          paragraph.addRun(text);
          doc.addParagraph(paragraph);
        });
        break;
      case 'text':
      case 'textarea':
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
        renderTextEditor(value, doc);
        break;
      default:
        break;
    }
  }
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

      Object.values(section.subsections).map(
        ({ title, sections, fields, steps }) => {

          doc.createParagraph(title).heading2();

          // for protocols everything below needs to be repeated as many times as
          // the lenght of the protocols array in all values

          let count = 1;
          if (title === 'Protocols' && this.props.values.protocols) {
            count = this.props.values.protocols.length;
          }

          for (var i = 0; i < count; i++) {

            let values;
            if (title === 'Protocols' && this.props.values.protocols) {
              values = this.props.values.protocols[i];
            } else values = this.props.values;

            if (title === 'Protocols' && this.props.values.protocols) {
              doc.createParagraph(this.props.values.protocols[i].title).heading2();
            }
            // if there are section subsection sections - like in the protocols - repeat for each of them
            let secSubSecs;
            if (sections) {
              secSubSecs = Object.values(sections);
            } else {
              secSubSecs = [
                {
                  fields: fields,
                  steps: steps
                }
              ];
            }
            // Object.values(secSubSecs).map(({ sectionTitle:title, fields, steps }) => {
              Object.values(secSubSecs).map((subsection) => {

              let subsectionFields;
              if (subsection.fields) {
                subsectionFields = subsection.fields;
              }
              if (subsection.steps) {
                subsectionFields = flatten(subsection.steps.map(step => step.fields));
              }
              if (title === 'Protocols' && this.props.values.protocols) {
                doc.createParagraph(subsection.title).heading2();
              }

              if (subsectionFields) {
                subsectionFields.map(field => {
                  doc.createParagraph(field.label).heading3();
                  renderDocument(doc, field, values);
                });
              }
            });
          }
        }
      );
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
