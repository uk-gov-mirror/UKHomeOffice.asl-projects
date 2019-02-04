import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Numbering } from 'docx';

import flatten from 'lodash/flatten';
import SPECIES from '../constants/species';
import isUndefined from 'lodash/isUndefined';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    values: project,
    sections: Object.values(state.application),
    optionsFromSettings: state.settings
  };
};

const renderTextEditor = (value, doc) => {

  const content = JSON.parse(value);
  const nodes = content.document.nodes;
  let text;
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
          const paragraph = new Paragraph();
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
          const paragraph = new Paragraph();
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
            const paragraph = new Paragraph();
            paragraph.style('body');
            paragraph.addRun(text);
            doc.addParagraph(paragraph);
          }
        });
        break;
      }
      case 'image': {
        let img = doc.createImage(node.data.src);
        img.scale(2);
        break;
      }
      default:
        break;
    }
  });
};

const renderField = (doc, field, values) => {

  const value = values[field.name];

  //console.log('field name : ' + field.name + ' : ' + JSON.stringify(value));
  doc.createParagraph(field.label).heading3();
  if (isUndefined(value)) {
    const paragraph = new Paragraph();
    paragraph.style('body');
    paragraph.addRun(new TextRun('No answer provided').italic());
    doc.addParagraph(paragraph);
  } else {

    switch (field.type) {
      case 'radio': {
        let option;
        if (field.options) option = field.options.find(o => o.value === value);
        const label = option ? option.label : value;
        doc.createParagraph(label).style('body');
        if (option && option.reveal) {
          //make sure reveals are arrays everywhere
          //and then do the below for each reveal
          const reveals = !Array.isArray(option.reveal)
            ? [option.reveal]
            : option.reveal;
          reveals.map(reveal => {
            const revealValue = values[reveal.name];
            if (revealValue) {
              doc.createParagraph(reveal.label).heading3();
              switch (reveal.type) {
                case 'radio':
                case 'checkbox':
                case 'species-selector':
                  if (reveal.options) {
                    doc.createParagraph(
                      reveal.options.find(r => r.value === revealValue)
                    ).style('body');
                  }
                  else {
                    // console.log(revealValue);
                    revealValue.map(v => {
                      let text = new TextRun(v).size(28);
                      const paragraph = new Paragraph();
                      paragraph.style('body').bullet();
                      paragraph.addRun(text);
                      doc.addParagraph(paragraph);
                    });
                  }
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
      }
      case 'species-selector': {
        value.map(specie => {
          let text = new TextRun(
            flatten(Object.values(SPECIES)).find(s => s.value === specie).label
          ).size(28);
          const paragraph = new Paragraph();
          paragraph.style('body').bullet();
          paragraph.addRun(text);
          doc.addParagraph(paragraph);
        });
        const otherSpecies = values['species-other'];
        if (otherSpecies)
          otherSpecies.map(s => {
            let text = new TextRun(s).size(28);
            const paragraph = new Paragraph();
            paragraph.style('body').bullet();
            paragraph.addRun(text);
            doc.addParagraph(paragraph);
          });
        break;
      }
      case 'location-selector':
      case 'objective-selector':
      case 'checkbox':
        value.map(item => {
          let text = new TextRun(item).size(28);
          const paragraph = new Paragraph();
          paragraph.style('body').bullet();
          paragraph.addRun(text);
          doc.addParagraph(paragraph);
        });
        break;
      case 'text':
      case 'textarea':
        if (typeof value === 'boolean') {
          value
            ? doc.createParagraph('Yes').style('body')
            : doc.createParagraph('No').style('body');
        } else doc.createParagraph(value).style('body');
        break;
      case 'duration': {
        let years = value.years > 1 ? 'Years' : 'Year';
        let months = value.years > 1 ? 'Months' : 'Month';
        doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`);
        break;
      }
      case 'texteditor':
        renderTextEditor(value, doc);
        break;
      default:
        break;
    }
  }
};

const renderFields = (subsection, values, doc) => {
  // console.log(JSON.stringify(subsection));
  const fields = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];
  fields.map(step => {

      if (step.name === 'polesList' ||
        step.name === 'establishments' ||
        step.name === 'objectives') {
        values[step.name].map(v => {
          step.fields.map(field => renderField(doc, field, v));
        });
      }
      else {
        step.fields.map(field => {
          renderField(doc, field, values);
        })
      }
  })
}

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

    // project.json -> title
    doc.createParagraph(this.props.values.title).heading1();
    const sections = this.props.sections.filter((s) => { return s.name !== 'nts'; });
    sections.map(section => {
      Object.values(section.subsections).map(subsection => {
          doc.createParagraph(subsection.title).heading2();
          if(subsection.name === 'protocols') {
            renderFields(subsection.setup, this.props.values, doc);
            this.props.values['protocols'].map(protocolValues => {
              // next line renders just the protocol title
              renderField(doc, subsection.fields[0], protocolValues);
              // as many protocol objects I have , this many times I need to render ALL the subsection.sections
              Object.values(subsection.sections).map((protocolSection) => {
                doc.createParagraph(protocolSection.title).heading2();
                if(protocolSection.name === 'protocolSteps') {
                  //I need to render steps as many times as protocols.steps there are
                  protocolValues.steps.map(stepValues => {
                    renderFields(protocolSection, stepValues, doc);
                  });
                }
                else if (protocolSection.name === 'protocolExperience') {
                  // I know I have more subsections
                  Object.values(protocolSection).filter((e) => { return e instanceof Object; }).map(s => {
                    renderFields(s, protocolValues, doc);
                  });
                }
                else {
                  renderFields(protocolSection, protocolValues, doc);
                }
              })
            });
          }
          else {
            renderFields(subsection, this.props.values, doc);
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
