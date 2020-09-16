module.exports = {
  '*.js': ['prettier --write', 'eslint --fix', 'eslint'],
  '*.json': ['prettier --write'],
  '*.css': ['stylelint --fix'],
};
