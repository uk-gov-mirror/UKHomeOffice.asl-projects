/* eslint no-console: 0 */
const App = require('./lib/app');
const settings = require('./config');

const server = App(settings).listen(settings.port, err => {
  if (err) {
    return console.error(err);
  }
  console.log(`Listening on port ${server.address().port}`);
});
