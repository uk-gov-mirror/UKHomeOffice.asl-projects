import React, { Component, Fragment } from "react";
import classnames from 'classnames';
import { Editor } from "slate-react";
import { Value } from "slate";

import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/feather/bold";
import { italic } from "react-icons-kit/feather/italic";
import { code } from "react-icons-kit/feather/code";
import { list } from "react-icons-kit/feather/list";
import { underline } from "react-icons-kit/feather/underline";

import { ic_title } from "react-icons-kit/md/ic_title";
import { ic_format_quote } from "react-icons-kit/md/ic_format_quote";
import { BoldMark, ItalicMark, FormatToolbar } from "./index";

const getInitialValue = () => Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
});

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { value: getInitialValue() };
    if (props.value) {
      this.state = {
        value: Value.fromJSON(JSON.parse(props.value)),
        focus: false
      };
    }
    this.setFocus = this.setFocus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.renderMark = this.renderMark.bind(this)
  }

  onChange({ value }) {
    this.setState({ value });
    if (!this.props.readonly) this.props.onSave(JSON.stringify(value.toJSON()));
  }

  setFocus(focus) {
    this.setState({ focus })
  }

  renderMark(props) {
    switch (props.mark.type) {
      case "title":
        return <h1 {...props.attributes}>{props.children}</h1>;
      case "bold":
        return <BoldMark {...props} />;
      case "italic":
        return <ItalicMark {...props} />;
      case "code":
        return <code {...props.attributes}>{props.children}</code>;
      case "list":
        return (
          <ul {...props.attributes}>
            <li>{props.children}</li>
          </ul>
        );
      case "underline":
        return <u {...props.attributes}>{props.children}</u>;
      case "quote":
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      default: {
        return;
      }
    }
  }

  onMarkClick(e, type) {
    e.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  }

  renderMarkIcon(type, icon) {
    return (
      <button
        onPointerDown={e => this.onMarkClick(e, type)}
        className="tooltip-icon-button"
      >
        <Icon icon={icon} />
      </button>
    );
  }

  render() {
    if (this.props.readonly) {
      return (
        <Editor
          value={this.state.value}
          renderMark={this.renderMark.bind(this)}
        />
      );
    }
    return (
      <Fragment>
        {
          this.props.label && <h2 className="govuk-fieldset__heading govuk-heading-l">{this.props.label}</h2>
        }
        <div className={classnames('editor', { focus: this.state.focus })}>
          <FormatToolbar>
            {this.renderMarkIcon('title', ic_title)}
            {this.renderMarkIcon('bold', bold)}
            {this.renderMarkIcon('italic', italic)}
            {this.renderMarkIcon('code', code)}
            {this.renderMarkIcon('list', list)}
            {this.renderMarkIcon('underline', underline)}
            {this.renderMarkIcon('quote', ic_format_quote)}
          </FormatToolbar>
          <Editor
            onFocus={() => this.setFocus(true)}
            onBlur={() => this.setFocus(false)}
            value={this.state.value}
            name={this.props.name}
            key={this.props.name}
            focus={false}
            onChange={this.onChange}
            renderMark={this.renderMark}
          />
        </div>
      </Fragment>
    );
  }
}
