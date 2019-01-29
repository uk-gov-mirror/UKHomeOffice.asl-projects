import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { connectProject } from '../../helpers';
import classnames from 'classnames';

import map from 'lodash/map';
import reduce from 'lodash/reduce';
import flatten from 'lodash/flatten';

import Review from '../../components/review'
import NTS from '../../components/nts';

const OFFSET = 100;

class NTSSummary extends Component {
  componentDidMount() {
    window.onscroll = this.onscroll;
  }

  sectionRefs = this.props.sections.reduce((obj, { section }) => {
    return {
      ...obj,
      [section]: React.createRef()
    }
  }, {})

  state = {
    active: this.props.sections[0].section
  };

  thresholds = {};

  timeout = null;

  updateActiveSection = (e, section) => {
    e.preventDefault();
    this.setState({ active: section }, this.scrollToActive)
  }

  scrollToActive = () => {
    clearTimeout(this.timeout);
    // remove onscroll handler to prevent firing while auto-scrolling
    window.onscroll = null;
    window.scrollTo({
      top: this.sectionRefs[this.state.active].current.offsetTop + OFFSET,
      behavior: 'smooth'
    });
    // wait until animation finished then reattach scroll handler
    this.timeout = setTimeout(() => {
      window.onscroll = this.onscroll;
    }, 1000);
  }

  componentDidUpdate() {
    this.thresholds = reduce(this.sectionRefs, (obj, element, name) => {
      return { ...obj, [element.current.offsetTop + OFFSET]: name };
    }, {})
  }

  onscroll = () => {
    const thresholds = Object.keys(this.thresholds);
    const scrollTop = document.documentElement.scrollTop
    const section = thresholds.find((t, index) => {
      t = parseInt(t, 10);
      const lowerLimit = thresholds[index - 1] ? parseInt(thresholds[index - 1], 10) : 0;
      const upperLimit = thresholds[index + 1] ? parseInt(thresholds[index + 1], 10) : Infinity;
      return scrollTop >= lowerLimit && scrollTop < upperLimit;
    })
    this.setState({ active: this.thresholds[section] })
  }

  getFields = (section, whitelist) => {
    let fields;
    if (section.fields) {
      fields = section.fields;
    }
    if (section.steps){
      fields = flatten(section.steps.map(step => step.fields));
    }
    return fields.filter(field => !whitelist || whitelist.includes(field.name));
  }

  render() {
    return (
      <Fragment>
        <NTS review={true} hideTitle={true} />
        <div className="nts-review">
          <nav className="sidebar-nav">
            {
              this.props.sections.map(({ section, title }, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => this.updateActiveSection(e, section)}
                  className={classnames({ active: this.state.active === section })}
                >{title}</a>
              ))
            }
          </nav>
          <div className="content">
            {
              this.props.sections.map(({ section, title, fields }, index) => (
                <Fragment key={index}>
                  <h2 ref={this.sectionRefs[section]}>{title}</h2>
                  {
                    this.getFields(this.props.sectionsSettings[section], fields).map(field => (
                      <Review
                        {...field}
                        label={ field.review || field.label }
                        key={ field.name }
                        value={ this.props.project && this.props.project[field.name] }
                        onEdit={ () => console.log('edit') }
                      />
                    ))
                  }
                  <hr />
                </Fragment>
              ))
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = ({ application }) => ({
  sectionsSettings: map(application, s => s.subsections)
    .reduce((obj, subsections) => ({ ...obj, ...subsections }), {})
});

export default connect(mapStateToProps)(connectProject(NTSSummary));
