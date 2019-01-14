import React from "react";
import { connectProject } from '../helpers';
import TextEditor from "./editor/text-editor";

class Review extends React.Component {
  replay() {
    let value = this.props.value;
    if (this.props.type === 'species-selector') {
      if (this.props.project[`${this.props.name}-other`]) {
        value = [
          ...value,
          this.props.project[`${this.props.name}-other`]
        ]
      }
    }
    if (this.props.type === "checkbox" || this.props.type === 'species-selector') {
      value = value || [];
      if (!value.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }
      return (
        <ul>
          {value.map(value => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      );
    }
    if (this.props.type === "texteditor") {
      return <TextEditor {...this.props} readonly/>;
    }
    if (this.props.value) {
      return <p>{this.props.value}</p>;
    }
    return (
      <p>
        <em>No answer provided</em>
      </p>
    );
  }

  render() {
    return (
      <div className="review">
        <h3>{this.props.label}</h3>
        {this.replay()}
        <p>
          <a onClick={e => this.props.onEdit(e)} href={`#${this.props.name}`}>
            Edit
          </a>
        </p>
        <hr />
      </div>
    );
  }
}

export default connectProject(Review);
