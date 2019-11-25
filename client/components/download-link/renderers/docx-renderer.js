import { Document, Paragraph, TextRun, Numbering, Indent, Table } from 'docx';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import SPECIES from '../../../constants/species';
import { getLegacySpeciesLabel, mapSpecies, stripInvalidXmlChars } from '../../../helpers';
import { filterSpeciesByActive } from '../../../pages/sections/protocols/animals';

export default (application, sections, values, updateImageDimensions) => {
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
      .spacing({ before: 500, after: 300 });

    doc.Styles.createParagraphStyle('ProtocolSectionTitle', 'Protocol Section Title')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(34)
      .bold()
      .color('#005EA5')
      .font('Helvetica')
      .spacing({ before: 500, after: 300 });

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
      const columnsInRow = cells
        .slice(0, -1)
        .map(cell => parseInt(get(cell, 'data.colSpan', 1), 10) || 1)
        .reduce((sum, num) => sum + num, 1);

      colcount = Math.max(colcount, columnsInRow + rowspans.length);

      // reduce rowspans by one for next row.
      rowspans = [
        ...rowspans,
        ...cells.map(cell => {
          const rs = parseInt(get(cell, 'data.rowSpan', 1), 10);
          // All falsy values _except_ 0 should be 1
          // rowspan === 0 => fill the rest of the table
          return rs || (rs === 0 ? rows.length - rowIndex : 1);
        })
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
        const rs = parseInt(get(cell, 'data.rowSpan', 1), 10);
        const cs = parseInt(get(cell, 'data.colSpan', 1), 10);
        rowspanStore[colIndex] = rs || (rs === 0 ? rows.length - rowIndex : 1);
        const colspan = cs || (cs === 0 ? colcount - colIndex : 1);

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

  const populateTable = (matrix, table) => {
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          renderNode(table.getCell(rowIndex, colIndex), cell);
        }
      });
    });
  }

  const mergeCells = (matrix, table) => {
    populateTable(matrix, table);
    // merge rows
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const rowSpan = parseInt(get(cell, 'data.rowSpan'), 10);
        if (rowSpan) {
          table.getColumn(colIndex).mergeCells(rowIndex, rowIndex + rowSpan - 1);
        }
      });
    });
    // merge cols
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const colSpan = parseInt(get(cell, 'data.colSpan'), 10);
        if (colSpan) {
          table.getRow(rowIndex).mergeCells(colIndex, colIndex + colSpan - 1);
        }
      });
    });
  };

  const initTable = matrix => {
    const rowcount = matrix.length;
    const colcount = matrix[0].length;

    return new Table({
      rows: rowcount,
      columns: colcount,
      // setting to a large number enforces equal-width columns
      columnWidths: Array(colcount).fill('10000')
    });
  };

  const renderTable = (doc, node) => {
    const matrix = tableToMatrix(node);
    let table = initTable(matrix);

    try {
      mergeCells(matrix, table);
    } catch (err) {
      console.log('Failed to merge cells', err);
      table = initTable(matrix);
      populateTable(matrix, table);
    }

    doc.addTable(table);
  };

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
            text = new TextRun(stripInvalidXmlChars(leaf.text));
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

      default:
        // if there is no matching type then it's probably a denormalised text node with no wrapping paragraph
        // attempt to render with the node wrapped in a paragraph
        if (node.text) {
          renderNode(doc, { object: 'block', type: 'paragraph', nodes: [ node ] }, depth, paragraph)
        }

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

  const renderLegacySpecies = (doc, values, value, noSeparator) => {
    const label = getLegacySpeciesLabel(values);
    return renderText(doc, label, noSeparator);
  }

  const renderSpeciesSelector = (doc, values, value, noSeparator) => {
    const species = mapSpecies(values)

    if (!species.length) {
      return renderNull(doc);
    }

    species.forEach(value => {
      let text = new TextRun(value).size(24);

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
    const children = values[field.options.find(opt => opt.reveal).reveal.name] || [];
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
      doc.createParagraph(stripInvalidXmlChars(value)).style('body');
    }

    if (!noSeparator) {
      renderHorizontalRule(doc);
    }
  };

  const renderDeclaration = (/*doc, field, values, value*/) => {
    return;
  };

  const renderDuration = (doc, value) => {
    let months = 0;
    let years = 5;
    if (value) {
      months = value.months || months;
      years = value.years || years;
    }
    const yearsLabel = years === 1 ? 'Year' : 'Years';
    const monthsLabel = months === 1 ? 'Month' : 'Months';
    doc.createParagraph(`${years} ${yearsLabel} ${months} ${monthsLabel}`).style('body');
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

    switch (field.type) {
      case 'species-selector':
        return renderSpeciesSelector(doc, values, value, noSeparator);
      case 'legacy-species-selector':
        return renderLegacySpecies(doc, values, value, noSeparator);
      case 'animal-quantities':
        return renderAnimalQuantities(doc, values, noSeparator);
      case 'duration':
        return renderDuration(doc, value, noSeparator);
      case 'licenceNumber': {
        const licenceNumber = application.licenceNumber ? application.licenceNumber : '';
        return renderText(doc, `${licenceNumber} `, noSeparator);
      }
    }

    if (isUndefined(value) || isNull(value)) {
      return renderNull(doc, noSeparator);
    }

    switch (field.type) {
      case 'radio':
        return renderRadio(doc, field, values, value, noSeparator);

      case 'location-selector':
      case 'objective-selector':
      case 'checkbox':
        return renderSelector(doc, field, value, values, project, noSeparator);

      case 'permissible-purpose':
        return renderPermissiblePurpose(doc, field, value, values);

      case 'text':
      case 'textarea':
      case 'declaration':
        return renderText(doc, value, noSeparator);

      case 'holder':
        return renderText(doc, `${value.firstName} ${value.lastName}`, noSeparator);

      case 'texteditor':
        return renderTextEditor(doc, value, noSeparator);
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
          (step.fields || []).forEach(field => renderField(doc, field, v, project));
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
        return filterSpeciesByActive(values, project).forEach(speciesValues => {
          doc.createParagraph(speciesValues.name).heading2();
          renderFields(doc, section, speciesValues, section.fields.filter(f => f.name !== 'species'));
        });
      case 'legacy-animals':
        return (values.species || []).forEach((speciesValues, index) => {
          doc.createParagraph(`Animal type ${index + 1}`).heading2();
          renderFields(doc, section, speciesValues, section.fields);
        });
      default:
        return renderFields(doc, section, values, null, project);
    }
  };

  const renderProtocolsSection = (doc, subsection, values) => {
    const protocols = values['protocols'] || [];
    protocols.filter(protocol => !protocol.deleted).forEach((protocolValues, index) => {
      doc.createParagraph(`Protocol ${index + 1}`).style('ProtocolSectionTitle');
      renderField(doc, subsection.fields[0], protocolValues);

      Object.keys(subsection.sections)
        .filter(k => !subsection.sections[k].show || subsection.sections[k].show(values))
        .map(k => renderProtocol(doc, k, subsection.sections[k], protocolValues, values))
    });
  };

  const renderSubsection = (doc, subsection, values) => {
    const sectionTitle = new Paragraph(subsection.title).style('SectionTitle');

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
    values = values || {};
    const now = new Date();

    // inject the project licence holder into introductory details
    const field = {
      label: 'Licence holder',
      name: 'holder',
      type: 'holder'
    };
    sections[0].subsections['introduction'].fields.splice(1, 0, field);
    values['holder'] = application.licenceHolder;

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
    if (!obj || typeof obj !== 'object') {
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

          return updateImageDimensions(node);
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
