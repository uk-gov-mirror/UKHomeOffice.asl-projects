module.exports = {
  port: process.env.PORT || 8080,
  ssl: process.env.NODE_ENV === 'production'
};
