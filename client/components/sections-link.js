import React from 'react';
import { Link } from 'react-router-dom';
import { connectProject } from '../helpers';

const SectionsLink = ({ project: { id } }) => (
  <Link className="sections-link" to={`/project/${id}`}>List of sections</Link>
)

export default connectProject(SectionsLink);
