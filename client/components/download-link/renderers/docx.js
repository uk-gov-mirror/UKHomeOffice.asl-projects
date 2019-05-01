import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Numbering } from '@joefitter/docx';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import get from 'lodash/get';
import SPECIES from '../../../constants/species';

// 600px seems to be roughly 100% page width (inside the margins)
const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;

const addStyles = doc => {

  doc.Styles.createParagraphStyle('Question', 'Question')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .indent(800)
    .bold()
    .color('#3B3B3B')
    .font('Helvetica')
    .spacing({ before: 200, after: 50 });

  doc.Styles.createParagraphStyle('SectionTitle', 'Section Title')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(40)
    .bold()
    .color('#8F23B3')
    .font('Helvetica')
    .spacing({ before: 100, after: 400 });

  doc.Styles.createParagraphStyle('ProtocolSectionTitle', 'Protocol Section Title')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(34)
    .bold()
    .color('#005EA5')
    .font('Helvetica')
    .spacing({ before: 300, after: 300 });

  doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(36)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 400 });

  doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(32)
    .bold()
    .font('Helvetica')
    .spacing({ before: 400, after: 300 });

  doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(28)
    .bold()
    .font('Helvetica')
    .spacing({ before: 400, after: 200 });

  doc.Styles.createParagraphStyle('body', 'Body')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 200, after: 200 });

  doc.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 100, after: 100 });


  doc.Styles.createParagraphStyle('aside', 'Aside')
    .basedOn('Body')
    .next('Body')
    .quickFormat()
    .size(24)
    .color('999999')
    .italics();

  doc.Styles.createParagraphStyle('footerText', 'Footer Text')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .font('Helvetica')
    .size(20);

  return doc;
};

const addPageNumbers = (doc) => {
  doc.Footer.createParagraph()
    .addRun(new TextRun('Page ').pageNumber())
    .addRun(new TextRun(' of ').numberOfTotalPages())
    .style('footerText')
    .right();

  return doc;
};

const renderNode = (doc, node) => {

  let text;
  let paragraph;

  switch (node.type) {
    case 'heading-one':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading1();
      break;

    case 'heading-two':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).heading2();
      break;

    case 'block-quote':
      doc.createParagraph(node.nodes[0].leaves[0].text.trim()).style('aside');
      break;

    case 'numbered-list': {
      const numbering = new Numbering();
      const abstract = numbering.createAbstractNumbering();
      abstract.createLevel(0, 'decimal', '%2.', 'start');
      const concrete = numbering.createConcreteNumbering(abstract);

      node.nodes.forEach(n => {
        if (n.type !== 'list-item') {
          return renderNode(doc, n);
        }
        // TODO: the item may have marks
        text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(24);
        const paragraph = new Paragraph();
        paragraph.setNumbering(concrete, 0);
        paragraph.style('body');
        paragraph.addRun(text);
        doc.addParagraph(paragraph);
      });
      break;
    }

    case 'bulleted-list':
      node.nodes.forEach(n => {
        if (n.type !== 'list-item') {
          return renderNode(doc, n);
        }
        // TODO: the item may have marks
        text = new TextRun(n.nodes[0].leaves[0].text.trim()).size(24);
        const paragraph = new Paragraph();
        paragraph.style('body').bullet();
        paragraph.addRun(text);
        doc.addParagraph(paragraph);
      });
      break;

    case 'paragraph':
      paragraph = new Paragraph();
      node.nodes.forEach(childNode => {
        childNode.leaves.forEach(leaf => {
          text = new TextRun(leaf.text);
          if (text) {
            (leaf.marks || []).forEach(mark => {
              switch (mark.type) {
                case 'bold':
                  text.bold();
                  break;

                case 'italic':
                  text.italics();
                  break;

                case 'underlined':
                  text.underline();
                  break;
              }
            });
            paragraph.style('body');
            paragraph.addRun(text);
          }
        });
      });
      doc.addParagraph(paragraph);
      break;

    case 'image':
      doc.createImage(node.data.src, node.data.width, node.data.height);
      break;
  }
}

const renderTextEditor = (doc, value) => {
  const content = JSON.parse(value);
  const nodes = content.document.nodes;

  nodes.forEach(node => renderNode(doc, node));

  renderHorizontalRule(doc);
};

const renderRadio = (doc, field, values, value) => {
  let option;

  if (field.options) {
    option = field.options.find(o => o.value === value);
  }

  const label = option ? option.label : value;
  doc.createParagraph(label).style('body');

  renderHorizontalRule(doc);

  if (option && option.reveal) {
    [].concat(option.reveal).forEach(reveal => renderField(doc, reveal, values));
  }
};

const renderSpeciesSelector = (doc, values, value) => {
  const other = values['species-other'] || [];
  value = value || [];
  value = flatten([
    ...value.map(val => {
      if (val.indexOf('other') > -1) {
        return values[`species-${val}`];
      }
      return val;
    }),
    ...other
  ]);

  if (!value.length) {
    return renderNull(doc);
  }

  value.forEach(species => {
    const item = flatten(Object.values(SPECIES)).find(s => s.value === species)
    let text = new TextRun(item ? item.label : species).size(24);

    const paragraph = new Paragraph();
    paragraph.style('body').bullet();
    paragraph.addRun(text);
    doc.addParagraph(paragraph);
  });

  renderHorizontalRule(doc);
};

const renderSelector = (doc, value) => {
  value = Array.isArray(value) ? value : [value];

  value.forEach(item => {
    let text = new TextRun(item).size(24);
    const paragraph = new Paragraph();
    paragraph.style('body').bullet();
    paragraph.addRun(text);
    doc.addParagraph(paragraph);
  });

  renderHorizontalRule(doc);
};

const renderText = (doc, value) => {
  if (typeof value === 'boolean') {
    value
      ? doc.createParagraph('Yes').style('body')
      : doc.createParagraph('No').style('body');
  } else {
    doc.createParagraph(value).style('body');
  }

  renderHorizontalRule(doc);
};

const renderDeclaration = (/*doc, field, values, value*/) => {
  return;
};

const renderDuration = (doc, value) => {
  let years = value.years === 1 ? 'Year' : 'Years';
  let months = value.months === 1 ? 'Month' : 'Months';
  doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`).style('body');
};

const renderNull = doc => {
  const paragraph = new Paragraph();
  paragraph.style('body');
  paragraph.addRun(new TextRun('No answer provided').italics());
  doc.addParagraph(paragraph);
  renderHorizontalRule(doc);
  return;
}

const renderHorizontalRule = doc => {
  doc.createParagraph('___________________________________________________________________');
};

const renderAnimalQuantities = (doc, values) => {
  const species = [
    ...flatten((values.species || []).map(s => {
      if (s.indexOf('other') > -1) {
        return values[`species-${s}`];
      }
      return s;
    })),
    ...(values['species-other'] || [])
  ].map(s => {
    const opt = flatten(Object.values(SPECIES)).find(species => species.value === s);
    return {
      key: species && species.value,
      title: opt ? opt.label : s,
      value: values[`reduction-quantities-${s}`]
    }
  });

  if (!species.length) {
    return renderNull(doc);
  }

  const paragraph = new Paragraph();
  paragraph.style('body');

  species.map(s => {
    paragraph.addRun(new TextRun(`${s.title}: `).bold());
    s.value
      ? paragraph.addRun(new TextRun(s.value))
      : paragraph.addRun(new TextRun('No answer provided').italics())
  });

  doc.addParagraph(paragraph);
  renderHorizontalRule(doc);
  return;
};

const renderField = (doc, field, values) => {
  const value = values[field.name];

  if (!field.label && field.type === 'checkbox' && field.name.includes('declaration')) {
    return renderDeclaration(doc, field, values, value);
  }

  doc.createParagraph(field.label).style('Question');

  if (field.type === 'species-selector') {
    return renderSpeciesSelector(doc, values, value);
  }

  if (field.type === 'animal-quantities') {
    return renderAnimalQuantities(doc, values);
  }

  if (isUndefined(value) || isNull(value)) {
    return renderNull(doc);
  }

  switch (field.type) {
    case 'radio':
      renderRadio(doc, field, values, value);
      break;

    case 'location-selector':
    case 'objective-selector':
    case 'checkbox':
      renderSelector(doc, value);
      break;

    case 'text':
    case 'textarea':
      renderText(doc, value);
      break;

    case 'duration':
      renderDuration(doc, value);
      break;

    case 'texteditor':
      renderTextEditor(doc, value);
      break;
  }

};

const renderFields = (doc, subsection, values, fields) => {
  if (fields) {
    return fields.forEach(field => renderField(doc, field, values));
  }

  const steps = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];

  steps.forEach(step => {
    if (step.name === 'polesList' || step.name === 'establishments' || step.name === 'objectives') {
      (values[step.name] || []).forEach(v => {
        step.fields.forEach(field => renderField(doc, field, v));
      });
    } else {
      step.fields.forEach(field => renderField(doc, field, values));
    }
  });
}

const renderProtocol = (doc, name, section, values) => {
  doc.createParagraph(section.title).style('ProtocolSectionTitle');

  switch (name) {
    case 'steps':
      return (values.steps || []).forEach(stepValues => {
        renderFields(doc, section, stepValues);
      });
    case 'animals':
      return (values.speciesDetails || []).forEach(speciesValues => {
        doc.createParagraph(speciesValues.name).heading2();
        renderFields(doc, section, speciesValues, section.fields.filter(f => f.name !== 'species'));
      });
    default:
      return renderFields(doc, section, values);
  }
};

const renderProtocolsSection = (doc, subsection, values) => {
  const protocols = values['protocols'] || [];
  protocols.forEach((protocolValues, index) => {
    const title = doc.createParagraph(`Protocol ${index + 1}`).style('ProtocolSectionTitle');
    if (index > 0) {
      title.pageBreakBefore();
    }
    renderField(doc, subsection.fields[0], protocolValues);

    map(subsection.sections, (section, name) => renderProtocol(doc, name, section, protocolValues))
  });
};

let isFirstSection = true;

const renderSubsection = (doc, subsection, values) => {
  const sectionTitle = new Paragraph(subsection.title).style('SectionTitle');

  if (!isFirstSection) {
    sectionTitle.pageBreakBefore();
  } else {
    isFirstSection = false;
  }

  doc.addParagraph(sectionTitle);

  if(subsection.name === 'protocols') {
    renderProtocolsSection(doc, subsection, values);
  } else {
    renderFields(doc, subsection, values);
  }
};

const renderSection = (doc, section, values) => {
  Object.values(section.subsections).forEach(
    subsection => renderSubsection(doc, subsection, values)
  );
};

const renderNtsSection = (doc, section, values, sections) => {
  const sectionTitle = new Paragraph(section.title).style('SectionTitle');
  sectionTitle.pageBreakBefore();
  doc.addParagraph(sectionTitle);
  const subsections = sections.map(s => s.subsections).reduce((obj, values) => {
    return {
      ...obj,
      ...values
    }
  }, {});
  get(section, 'subsections[nts-review].sections', []).forEach(s => {
    let fields;
    const subsection = subsections[s.section];
    if (s.fields) {
      fields = subsection.fields.filter(field => s.fields.includes(field.name));
    }
    doc.createParagraph(s.title).style('SectionTitle');
    renderFields(doc, subsection, values, fields);
  });
}

const renderDocument = (doc, sections, values) => {
  const now = new Date();

  doc.createParagraph(values.title).style('SectionTitle');
  doc.createParagraph(`Document exported on ${now}`).style('body').pageBreak();

  sections.forEach(section => {
    if (section.name === 'nts') {
      return renderNtsSection(doc, section, values, sections);
    }
    renderSection(doc, section, values);
  });

  return doc;
};

const pack = (doc, filename) => {
  const packer = new Packer();

  packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};

const traverse = (obj, fn) => {
  if (typeof obj !== 'object') {
    return Promise.resolve(obj);
  }

  const promises = Object.keys(obj).map(key => {
    const val = obj[key];

    // if we find an array, iterate it
    if (Array.isArray(val)) {
      return Promise.all(val.map(item => traverse(item, fn)));
    }

    return Promise.resolve()
      .then(() => fn(val))
      .then(transformed => obj[key] = transformed);
  });

  return Promise.all(promises).then(() => obj);
};

const scaleAndPreserveAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

const addImageDimensions = values => {
  return traverse(values, (value) => {
    if (typeof value !== 'string') {
      return Promise.resolve(value);
    }

    try {
      const content = JSON.parse(value);

      if (!content.document || !content.document.nodes) {
        return Promise.resolve(value);
      }

      const nodePromises = content.document.nodes.map(node => {
        if (node.type !== 'image') {
          return Promise.resolve(node);
        }

        return new Promise(resolve => {
          const image = new Image();
          image.src = node.data.src;

          image.onload = () => {
            const dimensions = scaleAndPreserveAspectRatio(
              image.naturalWidth,
              image.naturalHeight,
              MAX_IMAGE_WIDTH,
              MAX_IMAGE_HEIGHT
            );
            node.data.width = dimensions.width;
            node.data.height = dimensions.height;
            resolve(node);
          };
        });
      });

      return Promise.all(nodePromises)
        .then(nodes => {
          content.document.nodes = nodes;
          return JSON.stringify(content);
        });
    } catch (e) {
      // not json, do nothing
      return Promise.resolve(value);
    }
  });
};

export default {
  render: ({sections, values}) => {
    return Promise.resolve()
      .then(() => addImageDimensions(values))
      .then(() => new Document())
      .then(doc => addStyles(doc))
      .then(doc => renderDocument(doc, sections, values))
      .then(doc => addPageNumbers(doc))
      .then(doc => pack(doc, values.title));
  }
};
