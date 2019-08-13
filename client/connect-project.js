import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setProject } from './actions/projects';
import { setBasename } from './actions/application';
import ProjectRouter from './project-router';

export default function ConnectProject({ match: { params: { id } } }) {
  id = parseInt(id, 10);
  const dispatch = useDispatch();
  const project = useSelector(({ projects }) => projects.find(p => p.id === id));
  const basename = `/project/${id}`;

  if (project) {
    dispatch(setProject(project));
  }
  dispatch(setBasename(basename));

  return <ProjectRouter />
}
