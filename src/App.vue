<template>
  <div id="app">
    <span id="loading" v-if="view.curr === 'loading'">
      <h1>Loading<br>
      <!-- <span class="fa fa-spin fa-spinner" /> -->
      <span id="spinner">
        <svg class="lds-spinner" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(30 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(60 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(90 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(120 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(150 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(180 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(210 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(240 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(270 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(300 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(330 50 50)">
          <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#00adb5">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
          </rect>
        </g></svg>
      </span>
      </h1>
    </span>

    <Card
      :toggleView="toggleView"
      :searchResult="searchResult"
      :searchReview="searchReview"
      :handleSwipe="handleSwipe"
      v-if="view.curr === 'card'"
    />

    <Questions
      :toggleView="toggleView"
      :getSearchResult="getSearchResult"
      :handleSwipe="handleSwipe"
      :assignGlobal="assignGlobal"
      v-if="view.curr === 'questions'"
    />

    <NoResult
      :randomSearch="randomSearch"
      :toggleView="toggleView"
      v-if="view.curr === 'noresult'"
    />

    <Liked
      :toggleView="toggleView"
      :getBusiness="getBusiness"
      v-if="view.curr === 'liked'"
    />

    <Settings
      :toggleView="toggleView"
      :settings="settings"
      :resetSettings="resetSettings"
      :checkSettings="checkSettings"
      :getBusiness="getBusiness"
      v-if="view.curr === 'settings'"
    />

    <span id="default" v-if="view.curr === ''">
      <span id="title">
        <span id="like" class="fa fa-list-ul" @click="toggleView('liked')" />
        <h3> </h3>
        <span class="fa fa-gear" @click="toggleView('settings')" />
      </span>
      <img id="food-image" src="./food.png">
      <span id="filter" />
      <span id="get-started" @click="startAsking()">
        <h1>Click here to get started!</h1>
      </span>
    </span>
  </div>
</template>
<script>
import Card from './components/Card.vue';
import Liked from './components/Liked.vue';
import Questions from './components/Questions.vue';
import NoResult from './components/NoResult.vue';
import Settings from './components/Settings.vue';
import {
  getLocationAPI,
  getYelpResult,
  getYelpReview,
  getYelpBusiness
} from './services/api.js';
import { GLOBAL_CATEGORIES } from './assets/CATEGORIES.js';
export default {
  name: 'app',

  data() {
    return {
      location: {
        lat: 0,
        lon: 0
      },
      view: { curr : '' },
      searchResult: {},
      searchReview: {},
      message: 'Pick a damn spot to eat already!',
      settings: {}
    };
  },

  components: {
    Card,
    Questions,
    Liked,
    NoResult,
    Settings
  },

  mounted() {
    this.checkSettings();
  },

  methods: {
    assignGlobal() {
      return JSON.parse(JSON.stringify(GLOBAL_CATEGORIES));
    },

    handleSwipe(id, dir) {
      // Swipe animation
      let direction;
      if(dir === 'l') {
        direction = '-1000px';
      }
      else if(dir === 'r') {
        direction = '1000px';
      }
      let card = document.getElementById(id);
      card.style.left = direction;
      card.style.opacity = '0';
      card.style.transitionDuration = '.25s';
      setTimeout(() => {
        card.style.left = '50%';
        card.style.opacity = '1';
        card.style.transitionDuration = '0s';
      }, 250);
    },

    toggleView(view) {
      if(view === 'back') {
        if(this.view.prev === 'loading') {
          this.view.prev === this.view.curr;
          this.view.curr = '';
          return;
        }
        this.view.curr = this.view.prev;
        this.view.prev = '';
      }
      else {
        this.view.prev = this.view.curr;
        this.view.curr = view;
      }
    },

    getLocation() {
      if(this.location.lat) {
        this.toggleView('questions');
        return;
      }

      getLocationAPI()
        .then(res => {
          this.location.lat = res.location.lat;
          this.location.lon = res.location.lng;
        })
        .catch(err => console.log('error setting the location:', err));
    },

    parseResults(data) {
      // Check if we already have 'photos'
      if(!data.photos) {
        getYelpBusiness(data.id)
          .then(res => {
            data.photos = parsePhotos(res.photos);
          });
      }
      else {
        data.photos = parsePhotos(data.photos);
      }
      data.image_url = data.image_url.replace('o.jpg', 'l.jpg');

      // Replace the (o)riginal (1000 x 1000) with the (l)arge (600 x 400)
      function parsePhotos(photos) {
        for(let i = 0; i < photos.length; i++) {
          photos[i] = photos[i].replace('o.jpg', 'l.jpg');
        }
        return photos;
      }
      // Yelp's star rating
      data.rating *= 2;

      // Needed to help display the correct amount of favicons
      data.price = data.price.split('');

      // Check if it's been Likedd
      data.isLiked = this.checkLiked(data.id);
      data.isDisliked = this.checkDisliked(data.id);

      return data;
    },

    checkLiked(id) {
      let liked = localStorage.getItem('liked');
      if(liked === null || liked === [] || liked === undefined) {
        return false;
      }
      else {
        return !JSON.parse(liked).every(e => e[0] !== id);
      }
    },

    checkDisliked(id) {
      let disliked = localStorage.getItem('disliked');
      if(disliked === null || disliked === [] || disliked === undefined) {
        return false;
      }
      else {
        return !JSON.parse(disliked).every(e => e[0] !== id);
      }
    },

    checkSettings() {
      let localSettings = localStorage.getItem('settings');
      if(!localSettings) {
        this.resetSettings();
        return;
      }
      else {
        this.settings = JSON.parse(localSettings);
        return;
      }
    },

    resetSettings() {
      this.settings = {
        price: 2,
        distance: 5,
        vegan: false,
        vegetarian: false,
        gluttonFree: false,
        zipCode: ''
      };
    },

    getBusiness(id) {
      getYelpBusiness(id)
        .then(result => {
          if(result.error) {
            return;
          } else {
            this.searchResult = this.parseResults(result);
            getYelpReview(result.id)
              .then(res => {
                this.searchReview = res;
                this.toggleView('card');
              });
          }
        });
    },

    randomSearch() {
      this.toggleView('loading');
      let random = GLOBAL_CATEGORIES[Math.floor() * GLOBAL_CATEGORIES.length];
      this.getSearchResult(random.alias, Math.floor(Math.random() * 10));
    },

    startAsking() {
      if(!this.location.lat) {
        this.getLocation();
      }
      this.toggleView('questions');
    },

    getSearchResult(categories, offset) {
      // eslint-disable-next-line
      // let liked = { hasLikes : false };
      // if(localStorage.getItem('liked')) {
      //   liked = JSON.parse(localStorage.getItem('liked'));
      // }

      getYelpResult(categories, this.settings, offset, this.location)
        .then(result => {
          if(result.error) {
            this.toggleView('noresult');
            return;
          }
          else if(this.checkLiked(result.id) || this.checkDisliked(result.id)) {
            offset++;
            this.getSearchResult(categories, offset);
          }
          else {
            this.searchResult = this.parseResults(result);
            getYelpReview(result.id)
              .then(res => {
                this.searchReview = res;
                this.toggleView('card');
              });
          }
        });
    }
  }
};
</script>

<style scoped>
#app {
  position: absolute;
  background-color: #222831;
  color: #eeeeee;
  text-align: center;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  overflow: hidden;
}
#loading h1 {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#container {
  height: 100%;
  width: 100%;
}
#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  background-color: #393e46;
  text-shadow: none;
  margin: auto;
  height: 50px;
}
#default a {
  text-decoration-style: none;
  font-size: 2rem;
}
#food-image {
  height: 100%;
  width: auto;
}
#get-started {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 3px black;
}
#filter {
  position: absolute;
  display: inline-block;
  height: 100%;
  width: 100%;
  top: 50px;
  left: 0;
  background-color: rgba(0, 0, 0, .69);
}
ul {
  list-style: none;
}
.fa {
  font-size: 2rem;
  color: #eeeeee !important;
}
</style>