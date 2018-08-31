require('dotenv').config();
// const PORT = process.env.PORT || 3000;
const PORT = '';
// const URL = `https://localhost:${PORT}/api`;
const URL = `https://pick-a-spot.herokuapp.com:${PORT}/api`;
// const MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
// console.log('the url is', URL);

// // Check if the response is OK
// function responseHandler(response) {
//   if(response.ok) return response.json();
//   return response.json().then(err => {
//     throw err.message;
//   });
// }

export {
  getLocationAPI,
  getYelpResult,
  getYelpReview,
  getYelpBusiness
};

function getLocationAPI() {
  return fetch('https://location.services.mozilla.com/v1/geolocate?key=test')
    .then(res => res.json())
    .catch(err => console.log('error retrieving location:', err));
}

function getYelpResult(categories, settings, offset, location) {
  if(offset === undefined) {
    offset = 0;
  }
  let radius = parseInt(settings.distance * 1609) - 222;
  categories += settings.glutenFree ? ',gluten_free' : '';
  categories += settings.vegan ? ',vegan' : '';
  categories += settings.vegetarian ? ',vegetarian' : '';
  radius = radius <= 1 ? radius = 500 : radius;
  let search = {
    categories: categories,
    latitude: location.lat,
    longitude: location.lon,
    location: settings.zipCode,
    radius: radius > 40000 ? 40000 : radius,
    price: settings.price.toString(),
    offset: offset
  };
  return fetch(`${URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Make into object then stringify; JSON error @ position 0 is because of non-JSON data being sent
    body: JSON.stringify(search)
  })
    .then(res => {
      if(res.error) {
        return null;
      }
      return res.json().then(data => {
        return data;
      });
    });
}

function getYelpReview(id) {
  id = { id: id };
  return fetch(`${URL}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id)
  })
    .then(res => {
      return res.json().then(data => data);
    });
}

function getYelpBusiness(id) {
  id = { id: id };
  return fetch(`${URL}/business`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id)
  })
    .then(res => {
      return res.json().then(data => data);
    });
}