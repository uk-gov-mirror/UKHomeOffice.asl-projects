import React from 'react';
import { connectProject } from '../helpers';

const Link = ({ to, project, label }) => {
  if (!label) {
    label = `View ${to}`;
  }
  return <a href={`/project/${project.id}/${to}`}>{ label }</a>;
}

export default connectProject(Link);
