require('dotenv').config();
const PORT = process.env.PORT || 3000;
// console.log('process.env.PORT', process.env.PORT);

// basic express app
const express = require('express');
const app = express();

// middleware (cors and read json body)
const cors = require('cors');
const path = require('path');
// const morgan = require('morgan');
// app.use(morgan('dev'));
app.use(cors());
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
app.use(express.json());
app.use(express.static(path.join(__dirname, '/dist')));

// point to the index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// connect to the database
const client = require('./client.js');

// Retrieve restaurant data
app.post('/api', (req, res, next) => {
  const body = req.body;
  let trigger = false;
  if(body.location.length === 5) {
    trigger = true;
    client.search({
      limit : 1,
      offset : body.offset,
      // open_now : true,
      sort_by: 'best_match',
      // sort_by: 'rating',
      term: 'restaurants, ' + body.categories,
      location: body.location,
      radius : body.radius,
      price : body.price
    })
      .then(result => {
        result.jsonBody.businesses[0]
          ? res.send(result.jsonBody.businesses[0])
          : res.send({ error : true, result: result.jsonBody, trigger: trigger });
      })
      .catch(next);
  } else {
    client.search({
      limit : 1,
      offset : body.offset,
      // open_now : true,
      sort_by: 'best_match',
      // sort_by: 'rating',
      term: 'restaurants, ' + body.categories,
      latitude : body.latitude,
      longitude : body.longitude,
      radius : body.radius,
      price : body.price
    })
      .then(result => {
        result.jsonBody.businesses[0]
          // ? res.send(result.jsonBody.businesses[0])
          ? res.send({ first: result.jsonBody.businesses[0], second: body })
          : res.send({ error : true });
      })
      .catch(next);
  }
});

// Retrieve reviews
app.post('/api/review', (req, res, next) => {
  let body = req.body;
  client.reviews(body.id)
    .then(result => {
      res.send(result.jsonBody.reviews[0]);
    })
    .catch(next);
});

// Retrieve business info
app.post('/api/business', (req, res, next) => {
  let body = req.body;
  client.business(body.id)
    .then(result => {
      res.send(result.jsonBody);
    })
    .catch(next);
});

app.listen(PORT, () => console.log(`server running... on port ${PORT}`));