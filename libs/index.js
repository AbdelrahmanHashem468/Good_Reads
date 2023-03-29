
const asycnWrapper = (promise) => promise
  .then((data) => [undefined, data]).catch((error) => [error]);

module.exports = { 
    asycnWrapper 
};
