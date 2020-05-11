import init from '../';
import project from '../data/project';

init({
  project,
  savedProject: project,
  comments: [],
  changes: {
    latest: [],
    granted: []
  },
  application: {
    establishment: {
      name: 'University of Croydon'
    },
    user: 'Test User',
    basename: '/',
    projectUrl: '/',
    project: {
      licenceHolder: {
        firstName: 'Test',
        lastName: 'User'
      },
      establishment: {
        name: 'University of Croydon'
      }
    },
    schemaVersion: 1,
    establishments: [ { id: 1, name: 'University of Croydon' } ]
  }
});
