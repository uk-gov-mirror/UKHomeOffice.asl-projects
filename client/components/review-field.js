import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import TextEditor from './editor';
import speciesOptions from '../constants/species';

import flatten from 'lodash/flatten';
import values from 'lodash/values';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import formatDate from 'date-fns/format';

import { DATE_FORMAT } from '../constants';

class ReviewField extends React.Component {

  render() {
    let value = this.props.value;
    let options;
    if (['checkbox', 'radio', 'select', 'permissible-purpose'].includes(this.props.type)) {
      options = this.props.optionsFromSettings
        ? this.props.settings[this.props.optionsFromSettings]
        : this.props.options;
    }

    if ((this.props.type === 'radio' || this.props.type === 'select') && !isUndefined(value)) {
      value = options.find(option => !isUndefined(option.value) ? option.value === value : option === value)
    }

    if (this.props.type === 'duration') {
      return (
        <dl className="inline">
          <dt>Years</dt>
          <dd>{(value || {}).years || 5}</dd>
          <dt>Months</dt>
          <dd>{(value || {}).months || 0}</dd>
        </dl>
      )
    }

    if (value && this.props.type === 'date') {
      return formatDate(value, DATE_FORMAT.long);
    }

    if (this.props.type === 'species-selector') {
      const project = this.props.project;
      const other = project[`${this.props.name}-other`] || [];
      value = value || [];
      value = flatten([
        ...value.map(val => {
          if (val.indexOf('other') > -1) {
            return project[`${this.props.name}-${val}`];
          }
          return val;
        }),
        ...other
      ]);
    }
    if (this.props.type === 'permissible-purpose') {
      const childrenName = options.find(o => o.reveal).reveal.name;
      const hasChildren = o => o.reveal && this.props.project[o.reveal.name] && this.props.project[o.reveal.name].length;
      if (
        (value && value.length) ||
        (this.props.project[childrenName] && this.props.project[childrenName].length)
      ) {
        return (
          <ul>
            {
              options
                .filter(o => value.includes(o.value) || hasChildren(o))
                .map((o, i) => (
                  <Fragment key={i}>
                    <li>{o.label}</li>
                    {
                      hasChildren(o) && (
                        <ul>
                          {
                            this.props.project[o.reveal.name].map((val, index) => {
                              return <li key={index}>{o.reveal.options.find(opt => opt.value === val).label}</li>
                            })
                          }
                        </ul>
                      )
                    }
                  </Fragment>
                ))
            }
          </ul>
        )
      }
      return <em>None selected</em>
    }
    if (this.props.type === 'checkbox' ||
      this.props.type === 'species-selector' ||
      this.props.type === 'location-selector' ||
      this.props.type === 'objective-selector'
    ) {
      value = value || [];
      if (!value.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }

      if (this.props.type === 'species-selector') {
        options = flatten(values(speciesOptions))
      }

      const getValue = value => {
        const v = (options || []).find(option => option.value === value)
        return v
          ? v.label
          : value
      }

      return (
        <ul>
          {
            value.filter(v => options && this.props.type !== 'species-selector' ? options.find(o => o.value === v) : true).map(value => (
              <li key={value}>{getValue(value)}</li>
            ))
          }
        </ul>
      );
    }
    if (this.props.type === 'declaration') {
      return <p>
        {
          this.props.value
            ? 'Yes'
            : 'No'
        }
      </p>
    }

    if (this.props.type === 'animal-quantities') {
      const species = [
        ...flatten((this.props.project.species || []).map(s => {
          if (s.indexOf('other') > -1) {
            return this.props.project[`species-${s}`];
          }
          return s;
        })),
        ...(this.props.project['species-other'] || [])
      ].map(s => {
        const opt = flatten(values(speciesOptions)).find(species => species.value === s);
        return {
          key: s && s.value,
          title: opt ? opt.label : s,
          value: this.props.project[`${this.props.name}-${s}`]
        }
      });

      if (!species.length) {
        return <p>
          <em>No answer provided.</em>
        </p>
      }
      return <dl className="inline">
        {
          species.map(s => (
            <Fragment key={s.key}>
              <dt>{s.title}:</dt>
              <dd>{s.value ? s.value : <em>No answer provided.</em>}</dd>
            </Fragment>
          ))
        }
      </dl>
    }
    if (this.props.type === 'texteditor' && this.props.value) {
      return <TextEditor {...this.props} readOnly={true} />;
    }
    if (!isUndefined(value) && !isNull(value) && value !== '') {
      return <p>{value.review || value.label || value}</p>;
    }
    return (
      <p>
        <em>No answer provided.</em>
      </p>
    );
  }

}


const mapStateToProps = ({ project, settings }) => {
  return {
    project,
    settings
  };
}

export default connect(mapStateToProps)(ReviewField);
