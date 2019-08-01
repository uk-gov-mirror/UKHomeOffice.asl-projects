import dateFormatter from 'date-fns/format';

const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

module.exports = {
  formatDate
};
