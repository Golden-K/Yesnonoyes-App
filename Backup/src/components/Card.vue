<template>
  <span id="card-main">
    <transition name="fade">
      <PhotoZoom
        v-if="zoom"
        :zoomPhotos="zoomPhotos"
        :toggleZoom="toggleZoom"
        :handlePhoto="handlePhoto"
        :currentPhotoNum="currentPhotoNum"
      />
    </transition>
    <span id="title">
      <span id="back" class="fa fa-reply" @click="toggleView('back')" />
      <span />
      <span>
        <span id="dislike" class="fa fa-ban text-danger" :style="searchResult.isDisliked ? 'color: #dd0000' : 'color: #111'" @click="handleDislike()" />
        <span id="like" :class="searchResult.isLiked ? 'fa fa-heart' : 'fa fa-heart-o'" @click="handleLike()" />
      </span>
    </span>

    <div id="business-content">
      <h3>{{ searchResult.name }}</h3>
      <span id="img-main-container">
        <span
          v-if="currentPhotoNum > 0 && !zoom"
          @click="handlePhoto(-1, 'img-main')"
          class="fa fa-arrow-left photo-arrow"
        />
        <span
          v-else
          class="fa fa-arrow-left arrow-disable"
        />
        <img
          id="img-main"
          v-if="searchResult.photos && !zoom"
          :src="searchResult.photos[currentPhotoNum]"
          @click="toggleZoom(searchResult.photos[currentPhotoNum])"
        />
        <img
          id="img-main"
          v-else-if="!searchResult.photos && !zoom"
          :src="searchResult.image_url"
          @click="toggleZoom(searchResult.image_url)"
        >
        <span
          v-if="searchResult.photos && currentPhotoNum < searchResult.photos.length - 1 && !zoom"
          @click="handlePhoto(1, 'img-main')"
          class="fa fa-arrow-right photo-arrow"
        />
        <span
          v-else
          class="fa fa-arrow-right arrow-disable"
        />
      </span>
      <span id="info-container">
        <span id="rating">
          <ul>
            <li v-for="(dollar, i) in searchResult.price" :key="i">
              <span class="fa fa-dollar" />
            </li>
          </ul>
          <!-- Yelp's star rating -->
          <img id="stars" :src="getImagePath(searchResult.rating + '.png')">

          <!-- Font Awesome star rating -->
          <!-- <ul>
            <li v-for="(star, i) in searchResult.rating" :key="i">
              <span :class="star ? 'fa fa-star' : 'fa fa-star-half'" />
            </li>
          </ul> -->
          <span id="review-count">{{ searchResult.review_count }} Reviews</span>
        </span>

        <span id="address-links-container">
          <span id="address-container">
            <span>{{ searchResult.location.display_address[0] }}</span>
            <span>{{ searchResult.location.display_address[1] }}</span>
            <span>{{ searchResult.display_phone }}</span>
          </span>
          <span id="links-container">
            <span><a :href="'tel:' + searchResult.display_phone" class="fa fa-phone"></a></span>
            <span><a :href="'http://maps.google.com/?q=' + searchResult.location.address1 + searchResult.location.city" target="_blank" class="fa fa-map"></a></span>
            <span><a :href="searchResult.url" target="_blank" class="fa fa-yelp"></a></span>
          </span>
        </span>
        <span id="review-container">
          <!-- <h1>Recent Review</h1> -->
          <span id="user-container">
            <img id="user-img" :src="searchReview.user.image_url ? searchReview.user.image_url.replace('o.jpg', 'm.jpg') : 'user.png'">
            <span id="user-sub-container">
              <h3>{{ searchReview.user.name }}</h3>
              <p><b>Rating:</b> {{ searchReview.rating }}</p>
              <p>{{ new Date(searchReview.time_created + "Z").toUTCString().substr(0, 16) }}</p>
            </span>
          </span>
          <p>{{ searchReview.text }} <a :href="searchReview.url" target="_blank">Read more</a></p>
        </span>
      </span>
    </div>
  </span>
</template>

<script>
import { detectSwipe } from '../services/swipe';
import PhotoZoom from './PhotoZoom';
export default {
  name: 'Card',
  props: {
    searchResult: Object,
    searchReview: Object,
    toggleView: {
      type: Function,
      required: true
    },
    handleSwipe: {
      type: Function,
      reuired: true
    }
  },

  data() {
    return {
      currentPhotoNum: 0,
      zoom: false,
      zoomPhotos: ''
    };
  },
  components: {
    PhotoZoom
  },

  methods: {
    // Yelp's star rating
    getImagePath(imageName) {
      return imageName ? require(`../assets/stars/${imageName}`) : '';
    },

    toggleZoom() {
      this.zoom = !this.zoom;
      this.zoomPhotos = this.searchResult.photos.map(a => a.replace('l.jpg', 'o.jpg'));
      // console.log('zoomz', this.zoomPhotos);
    },

    handlePhoto(num, id) {
      // Right swipe
      if(num > 0 && this.currentPhotoNum < 2) {
        this.handleSwipe(id, 'r');
        setTimeout(() => {
          this.currentPhotoNum += num;
        }, 200);
      }
      else if(num < 0 && this.currentPhotoNum > 0) {
        this.handleSwipe(id, 'l');
        setTimeout(() => {
          this.currentPhotoNum += num;
        }, 200);
      }
    },

    handleLike() {
      let liked = JSON.parse(localStorage.getItem('liked'));
      // Unlike
      if(this.searchResult.isLiked && this.searchResult.isLiked !== []) {
        this.searchResult.isLiked = false;
        liked = liked.filter(e => e[0] !== this.searchResult.id);
        // Reset 'liked' to null
        if(liked.length === 0) {
          localStorage.removeItem('liked');
        }
        else {
          localStorage.setItem('liked', JSON.stringify(liked));
        }
      }
      // Like
      else {
        let disliked = JSON.parse(localStorage.getItem('disliked'));
        // Undislike
        if(this.searchResult.isDisliked && this.searchResult.isDisliked !== []) {
          this.searchResult.isDisliked = false;
          disliked = disliked.filter(e => e[0] !== this.searchResult.id);
          // Reset 'disliked' to null
          if(disliked.length === 0) {
            localStorage.removeItem('disliked');
          }
          else {
            localStorage.setItem('disliked', JSON.stringify(disliked));
          }
        }
        this.searchResult.isLiked = true;
        // First like
        if(liked === null) {
          localStorage.setItem('liked', JSON.stringify([[this.searchResult.id, this.searchResult.name]]));
        }
        // Other likes
        else {
          liked.push([this.searchResult.id, this.searchResult.name]);
          localStorage.setItem('liked', JSON.stringify(liked));
        }
      }
    },

    handleDislike() {
      let disliked = JSON.parse(localStorage.getItem('disliked'));
      // Undislike
      if(this.searchResult.isDisliked && this.searchResult.isDisliked !== []) {
        this.searchResult.isDisliked = false;
        disliked = disliked.filter(e => e[0] !== this.searchResult.id);
        // Reset 'disliked' to null
        if(disliked.length === 0) {
          localStorage.removeItem('disliked');
        }
        else {
          localStorage.setItem('disliked', JSON.stringify(disliked));
        }
      }
      // Disike
      else {
        if(this.searchResult.isLiked && this.searchResult.isLiked !== []) {
          let liked = JSON.parse(localStorage.getItem('liked'));
          this.searchResult.isLiked = false;
          liked = liked.filter(e => e[0] !== this.searchResult.id);
          // Reset 'liked' to null
          if(liked.length === 0) {
            localStorage.removeItem('liked');
          }
          else {
            localStorage.setItem('liked', JSON.stringify(liked));
          }
        }
        this.searchResult.isDisliked = true;
        // First dislike
        if(disliked === null) {
          localStorage.setItem('disliked', JSON.stringify([[this.searchResult.id, this.searchResult.name]]));
        }
        // Other dislikes
        else {
          disliked.push([this.searchResult.id, this.searchResult.name]);
          localStorage.setItem('disliked', JSON.stringify(disliked));
        }
      }
    }
  },
  created() {
    setTimeout(() => {
      detectSwipe('img-main-container', (id, dir) => {
        // console.log('direction = ', dir);
        if(dir === 'r') {
          this.handlePhoto(1, 'img-main');
        }
        else if(dir === 'l') {
          this.handlePhoto(-1, 'img-main');
        }
      });
    }, 250);
  }
};
</script>

<style>
#container {
  margin: 0;
  padding: 0;
}
#card-main {
  display: absolute;
  overflow-y: scroll;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #222831;
  color: #eeeeee;
  text-shadow: 0 0 6px black;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
}
#links-container {
  display: flex;
  flex-wrap: wrap;
}
#links-container a {
  text-decoration: none;
  color: white;
  margin-left: 10px;
}
.fa-yelp {
  font-size: 2.5rem;
}
.fa-phone {
  font-size: 2.5rem;
}
.fa-map {
  font-size: 2.5rem;
}
h3 {
  padding: 6px 0;
  margin: 0;
}
#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  background-color: #393e46;
  text-shadow: none;
  height: 50px;
}
#back {
  font-size: 2rem;
  cursor: pointer;
}
#like {
  font-size: 2rem;
  color: #111;
  cursor: pointer;
}
#dislike {
  font-size: 2rem;
  cursor: pointer;
  padding-right: 13px;
}
#img-main-container {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 200px;
  background-color: #111;
}
#img-main {
  display: inline-block;
  height: auto;
  width: 200px;
  margin: auto;
  transition: .5s;
}
#business-content {
  overflow: scroll;
  height: calc(100% - 50px);
}
#info-container {
  display: flex;
  flex-direction: column;
}
#rating {
  background-color: #eeeeee !important;
  color: #393e46;
  background: #393e46;
  font-size: 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 6px;
  text-shadow: none;
}
#review-count {
  font-size: 1rem;
  text-shadow: none;
}
#address-links-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
}
#address-container {
  display: flex;
  flex-direction: column;
  text-align: left;
}
#review-container {
  background-color: #eeeeee;
  color: black;
  text-shadow: none;
  border-top: 1px solid black;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  border-left: 1px solid black;
  border-radius: 13px;
  margin: 0 3px 3px 3px;
}
#review-container p {
  margin: 0;
  padding: 0 0 6px;
}
#user-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  /* width: fit-content; */
  padding: 3px 6px 0;
}
#user-img {
  height: 69px;
  width: auto;
}
#user-sub-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  margin: 0;
}
.fa-heart {
  color: #00adb5 !important;
}
.photo-arrow {
  color: #00adb5;
  display: inline-block;
}
.arrow-disable {
  color: #333;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>