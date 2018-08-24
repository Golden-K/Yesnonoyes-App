require('dotenv').config();
const PORT = process.env.PORT || 3000;

// basic express app
import express, { json } from 'express';
const app = express();

import path from 'path';
import serveStatic from 'serve-static';
app.use(serveStatic(__dirname + "/dist"));

// middleware (cors and read json body)
import cors from 'cors';
// app.all('*', function(req, res, next) {
//   var origin = req.get('origin'); 
//   res.header('Access-Control-Allow-Origin', origin);
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(json());
// app.use(express.static(path.join(__dirname, 'public')));

// point to the index.html
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

// connect to the database
import { search, reviews, business } from './client.js';

// Retrieve restaurant data
app.post('/api', (req, res, next) => {
  const body = req.body;
  search({
    limit : 1,
    offset : body.offset,
    // open_now : true,
    sort_by: 'best_match',
    // sort_by: 'rating',
    term: 'restaurants',
    latitude : body.latitude,
    longitude : body.longitude,
    radius : body.radius,
    price : body.price,
    categories: body.categories
  })
    .then(result => {
      result.jsonBody.businesses[0]
        ? res.send(result.jsonBody.businesses[0])
        : res.send({ error : true });
    })
    .catch(next);
});

// Retrieve reviews
app.post('/api/review', (req, res, next) => {
  let body = req.body;
  reviews(body.id)
    .then(result => {
      res.send(result.jsonBody.reviews[0]);
    })
    .catch(next);
});

// Retrieve business info
app.post('/api/business', (req, res, next) => {
  let body = req.body;
  business(body.id)
    .then(result => {
      res.send(result.jsonBody);
    })
    .catch(next);
});

// app.get('/api/:id', (req, res, next) => {
//   console.log('the id is', req.params.id);
//   client.business({
//     id : req.params.id
//   })
//     .then(result => {
//       console.log('we got a result? in the server', result);
//     })
//     .catch(next);
// });

app.listen(PORT, () => console.log(`server running... on port ${PORT}`));