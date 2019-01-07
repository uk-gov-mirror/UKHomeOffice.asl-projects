import React, { Component, Fragment } from "react";
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

const initialValue = Value.fromJSON({
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
    this.state = { value: initialValue };
    if (props.value)
      this.state = { value: Value.fromJSON(JSON.parse(props.value)) };
  }

  onChange({ value }) {
    this.setState({ value });
    if (!this.props.readonly) this.props.onSave(JSON.stringify(value.toJSON()));
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
        <Fragment>
          <br />
          <Editor
            value={this.state.value}
            renderMark={this.renderMark.bind(this)}
          />
        </Fragment>
      );
    }
    return (
      <div className="editor">
        <Fragment>
          <FormatToolbar>
            {this.renderMarkIcon("title", ic_title)}
            {this.renderMarkIcon("bold", bold)}
            {this.renderMarkIcon("italic", italic)}
            {this.renderMarkIcon("code", code)}
            {this.renderMarkIcon("list", list)}
            {this.renderMarkIcon("underline", underline)}
            {this.renderMarkIcon("quote", ic_format_quote)}
          </FormatToolbar>
          <Editor
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            renderMark={this.renderMark.bind(this)}
          />
        </Fragment>
      </div>
    );
  }
}
