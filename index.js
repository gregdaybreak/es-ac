const app = require('express')();
const http = require('http').Server(app);
const search = require('./search');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/suggest', (req, res) => {
  search.searchProduct(req.query.q)
    .then((resp) => {
      res.json(resp);  //returns a JSON response
    })
    .catch((err) => {
      console.log(err);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
