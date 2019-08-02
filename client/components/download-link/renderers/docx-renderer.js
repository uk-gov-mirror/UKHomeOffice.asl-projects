import { Document, Paragraph, TextRun, Numbering, Indent, Table } from 'docx';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import SPECIES from '../../../constants/species';

// 600px seems to be roughly 100% page width (inside the margins)
const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;

export default (application, sections, values) => {

  const numbering = new Numbering();
  const abstract = numbering.createAbstractNumbering();

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

  const tableToMatrix = table => {
    const rows = table.nodes;
    let rowspans = [];
    let colcount = 0;

    // calculate the actual dimensions of the table
    rows.forEach((row, rowIndex) => {
      const cells = row.nodes;

      colcount = Math.max(
        colcount,
        cells.slice(0, -1).map(cell => get(cell, 'data.colSpan', 1) || 1).reduce((sum, num) => sum + num, 1) + rowspans.length
      );

      // reduce rowspans by one for next row.
      rowspans = [
        ...rowspans,
        ...cells.map(cell => get(cell, 'data.rowSpan', 1) || rows.length - rowIndex)
      ]
        .map(s => s - 1)
        .filter(Boolean);
    });

    const matrix = Array(rows.length).fill().map(() => Array(colcount).fill(undefined));

    let rowspanStore = {};
    rows.forEach((row, rowIndex) => {
      let spanOffset = 0;
      row.nodes.forEach((cell, colIndex) => {
        colIndex += spanOffset;
        // increase index and offset if previous row rowspan is active for col
        while (get(rowspanStore, colIndex, 0)) {
          spanOffset += 1;
          colIndex += 1;
        }

        // store rowspan to be taken into account in the next row
        rowspanStore[colIndex] = get(cell, 'data.rowSpan', 1) || rows.length - rowIndex;
        const colspan = get(cell, 'data.colSpan', 1) || colcount - colIndex;

        // increase offset for next cell
        spanOffset += (colspan - 1);

        // store in correct position
        matrix[rowIndex][colIndex] = cell;
      });

      // reduce rowspans by one for next row.
      rowspanStore = pickBy(mapValues(rowspanStore, s => s - 1), Boolean);
    });

    return matrix;
  }

  const renderTable = (doc, node) => {
    const matrix = tableToMatrix(node);
    const rowcount = matrix.length;
    const colcount = matrix[0].length;

    const table = new Table({
      rows: rowcount,
      columns: colcount,
      // setting to a large % enforces equal-width columns
      columnWidths: Array(matrix[0].length).fill('500%')
    });

    // first pass - add content to cells
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          renderNode(table.getCell(rowIndex, colIndex), cell);
        }
      });
    });

    // second pass - merge rows
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const rowSpan = get(cell, 'data.rowSpan');
        if (rowSpan) {
          table.getColumn(colIndex).mergeCells(rowIndex, rowIndex + rowSpan - 1);
        }
      });
    });

    // third pass - merge cols
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const colSpan = get(cell, 'data.colSpan');
        if (colSpan) {
          table.getRow(rowIndex).mergeCells(colIndex, colIndex + colSpan - 1);
        }
      });
    });

    doc.addTable(table);
  }

  const renderNode = (doc, node, depth = 0, paragraph) => {
    let text;

    const getContent = input => {
      return get(input, 'nodes[0].leaves[0].text', get(input, 'nodes[0].text')).trim();
    }

    const renderListItem = (doc, item, numbering) => {
      if (item.type !== 'list-item') {
        return renderNode(doc, item);
      }

      paragraph = paragraph = new Paragraph();
      paragraph.style('body');

      numbering
        ? paragraph.setNumbering(numbering, depth)
        : paragraph.bullet();

      item.nodes.forEach(n => renderNode(doc, n, depth + 1, paragraph));
    }

    switch (node.type) {
      case 'heading-one':
        doc.createParagraph(getContent(node)).heading1();
        break;

      case 'heading-two':
        doc.createParagraph(getContent(node)).heading2();
        break;

      case 'block-quote':
        doc.createParagraph(getContent(node)).style('aside');
        break;

      case 'table-cell':
        node.nodes.forEach(part => renderNode(doc, part))
        break;

      case 'table':
        renderTable(doc, node);
        break;

      case 'numbered-list': {
        abstract.createLevel(depth, 'decimal', '%2.', 'start').addParagraphProperty(new Indent(720 * (depth + 1), 0));
        const concrete = numbering.createConcreteNumbering(abstract);
        node.nodes.forEach(item => renderListItem(doc, item, concrete));
        break;
      }

      case 'bulleted-list':
        node.nodes.forEach(item => renderListItem(doc, item));
        break;

      case 'paragraph':
      case 'block':
        paragraph = paragraph || new Paragraph();
        node.nodes.forEach(childNode => {
          const leaves = childNode.leaves || [childNode];
          leaves.forEach(leaf => {
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

                  case 'subscript':
                    text.subScript();
                    break;

                  case 'superscript':
                    text.superScript();
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

  const renderTextEditor = (doc, value, noSeparator) => {
    let content;

    try {
      content = JSON.parse(value);
    } catch(e) {
      return renderText(doc, value, noSeparator);
    }
    const nodes = content.document.nodes;

    nodes.forEach(node => renderNode(doc, node));

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderRadio = (doc, field, values, value, noSeparator) => {
    let option;

    if (field.options) {
      option = field.options.find(o => o.value === value);
    }

    const label = option ? option.label : value;
    doc.createParagraph(label).style('body');

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }

    if (option && option.reveal) {
      [].concat(option.reveal).forEach(reveal => renderField(doc, reveal, values, null, true));
    }
  };

  const renderSpeciesSelector = (doc, values, value, noSeparator) => {
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


    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderPermissiblePurpose = (doc, field, value, values) => {
    value = value = Array.isArray(value) ? value : [value];
    const children = values[field.options.find(opt => opt.reveal).reveal.name];
    if (!value.length && !children.length) {
      return renderNull(doc)
    }

    field.options.filter(opt => value.includes(opt.value) || (opt.reveal && children.length)).forEach(opt => {
      const text = new TextRun(opt.label).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
      if (opt && opt.reveal) {
        [].concat(opt.reveal).forEach(reveal => {
          renderField(doc, reveal, values, null, true)
        });
      }
    });

    renderHorizontalRule(doc);
  }

  const renderSelector = (doc, field, value, values, project, noSeparator) => {
    value = Array.isArray(value) ? value : [value];

    if (field.type === 'objective-selector') {
      const options = (project.objectives || []).map(o => o.title);
      value = value.filter(v => options.includes(v));
    }

    if (field.type === 'location-selector') {
      const options = [
        ...(application.establishment ? [application.establishment.name] : []),
        ...(project.establishments || []).map(e => e['establishment-name']),
        ...(project.polesList || []).map(p => p.title)
      ];
      value = value.filter(v => options.includes(v));
    }

    if (!value.length) {
      return renderNull(doc);
    }

    if (field.options) {
      value = value.filter(v => field.options.map(o => o.value).includes(v))
    }

    value.forEach(item => {
      const opt = (field.options || []).find(o => o.value === item);
      if (opt) {
        item = opt.label;
      }
      let text = new TextRun(item).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body').bullet();
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
      if (opt && opt.reveal) {
        [].concat(opt.reveal).forEach(reveal => {
          renderField(doc, reveal, values, null, true)
        });
      }
    });

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderText = (doc, value, noSeparator) => {
    if (typeof value === 'boolean') {
      value
        ? doc.createParagraph('Yes').style('body')
        : doc.createParagraph('No').style('body');
    } else {
      doc.createParagraph(value).style('body');
    }

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderDeclaration = (/*doc, field, values, value*/) => {
    return;
  };

  const renderDuration = (doc, value) => {
    let years = value.years === 1 ? 'Year' : 'Years';
    let months = value.months === 1 ? 'Month' : 'Months';
    doc.createParagraph(`${value.years} ${years} ${value.months} ${months}`).style('body');
  };

  const renderNull = (doc, noSeparator) => {
    const paragraph = new Paragraph();
    paragraph.style('body');
    paragraph.addRun(new TextRun('No answer provided').italics());
    doc.addParagraph(paragraph);
    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
    return;
  }

  const renderHorizontalRule = doc => {
    doc.createParagraph('___________________________________________________________________');
  };

  const renderAnimalQuantities = (doc, values, noSeparator) => {
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
        key: s && s.value,
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
    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
    return;
  };

  const renderField = (doc, field, values, project, noSeparator) => {
    project = project || values;
    const value = values[field.name];

    if (!field.label && field.type === 'checkbox' && field.name.includes('declaration')) {
      return renderDeclaration(doc, field, values, value);
    }

    doc.createParagraph(field.review || field.label).style('Question')

    if (field.hint) {
      doc.createParagraph(field.hint).style('aside')
    }

    if (field.type === 'species-selector') {
      return renderSpeciesSelector(doc, values, value, noSeparator);
    }

    if (field.type === 'animal-quantities') {
      return renderAnimalQuantities(doc, values, noSeparator);
    }

    if (isUndefined(value) || isNull(value)) {
      return renderNull(doc, noSeparator);
    }

    switch (field.type) {
      case 'radio':
        renderRadio(doc, field, values, value, noSeparator);
        break;

      case 'location-selector':
      case 'objective-selector':
      case 'checkbox':
        renderSelector(doc, field, value, values, project, noSeparator);
        break;

      case 'permissible-purpose':
        renderPermissiblePurpose(doc, field, value, values);
        break;

      case 'text':
      case 'textarea':
      case 'declaration':
        renderText(doc, value, noSeparator);
        break;

      case 'duration':
        renderDuration(doc, value, noSeparator);
        break;

      case 'texteditor':
        renderTextEditor(doc, value, noSeparator);
        break;
    }

  };

  const renderFields = (doc, subsection, values, fields, project) => {
    if (fields) {
      return fields.forEach(field => renderField(doc, field, values, project));
    }

    const steps = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];

    steps.filter(step => !step.show || step.show(values)).forEach(step => {
      if (step.repeats) {
        (values[step.repeats] || []).forEach((v, index) => {
          if (step.singular) {
            doc.createParagraph(`${step.singular} ${index + 1}`).heading2();
          }
          (step.fields || []).filter(f => f.repeats).forEach(field => renderField(doc, field, v, project));
        });
        (step.fields || []).filter(f => !f.repeats).forEach(field => renderField(doc, field, values, project));
      } else {
        (step.fields || []).forEach(field => renderField(doc, field, values, project));
      }
    });
  }

  const renderProtocol = (doc, name, section, values, project) => {
    doc.createParagraph(section.title).style('ProtocolSectionTitle');

    switch (name) {
      case 'steps':
        return (values.steps || []).forEach((stepValues, index) => {
          doc.createParagraph(`Step ${index + 1} (${stepValues.optional ? 'optional' : 'mandatory'})`).heading2();
          renderFields(doc, section, stepValues);
        });
      case 'animals':
        return (values.speciesDetails || []).forEach(speciesValues => {
          doc.createParagraph(speciesValues.name).heading2();
          renderFields(doc, section, speciesValues, section.fields.filter(f => f.name !== 'species'));
        });
      default:
        return renderFields(doc, section, values, null, project);
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

      Object.keys(subsection.sections)
        .filter(k => !subsection.sections[k].show || subsection.sections[k].show(values))
        .map(k => renderProtocol(doc, k, subsection.sections[k], protocolValues, values))
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

    if(subsection.name === 'protocol' || subsection.name === 'protocols') {
      renderProtocolsSection(doc, subsection, values);
    } else {
      renderFields(doc, subsection, values);
    }
  };

  const renderSection = (doc, section, values) => {
    Object.values(section.subsections).filter(s => !s.show || s.show(values)).forEach(
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

    sections.filter(s => !s.show || s.show(values)).forEach(section => {
      if (section.name === 'nts') {
        return renderNtsSection(doc, section, values, sections);
      }
      renderSection(doc, section, values);
    });

    return doc;
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

  return Promise.resolve()
    .then(() => addImageDimensions(values))
    .then(() => new Document())
    .then(doc => addStyles(doc))
    .then(doc => renderDocument(doc, sections, values))
    .then(doc => addPageNumbers(doc))
}
