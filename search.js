const elasticsearch = require('elasticsearch');
const jsontransform = require('node-json-transform');

const client = new elasticsearch.Client({
  hosts: [
    {
      host: '35.230.116.42'
    },
    {
      host: '35.230.13.33'
    },
    {
      host: '35.230.80.36'
    }
]});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

//The map defines how the output will be structured and which operations to run.
const mappingsearchProduct = function mappingsearchProduct(resp) {
  const map = {
    list: 'hits.hits',    //get the array of objects in hits
    item: {
      text: '_source.product', //map text to product
      id: '_source.sku',       //map id to sku
    },
  };
  //https://www.npmjs.com/package/node-json-transform
  const dataTransform = jsontransform.DataTransform(resp, map);
  const outputList = dataTransform.transform();
  return { items: outputList, total_count: resp.hits.total };
};

const searchProduct = function searchProduct(term) {

  const query = {
    index: 'products',
    type: 'document',
    body: {
      query: {
      match: {
        product: {
          query: term,
          minimum_should_match: 3, //matches documents that have at least three of the specified words in their title
          fuzziness: 1   //if the user makes a typo in writing the query, fuzzy matching will find closely spelled terms
        }
       }
     }
    },

   };
  return client.search(query).then(mappingsearchProduct);  //perform the search and map response for JSON transform
};

module.exports = { searchProduct };  //export for use in index.js
