<template>
  <span id="questions-main">
    <span id="title">
      <span id="back" class="fa fa-reply" @click="goBack()" />
      <h3> </h3>
      <span id="like" class="fa fa-list-ul" @click="toggleView('liked')" />
    </span>
    <h2 @click="handleNo()" class="fa fa-chevron-left" id="left" />
    <h2 @click="handleYes()" class="fa fa-chevron-right" id="right" />
    <p>Swipe Left for NO and Right for YES</p>
    <!-- <span> -->
      <h1 v-show="currentCat.category" id="questions">{{ currentCat.category }}</h1>
    <!-- </span> -->
  </span>
</template>

<script>
import { detectSwipe } from '../services/swipe';

export default {
  name: 'Questions',
  props: {
    searchResult: Object,
    searchReview: Object,
    toggleView: {
      type: Function,
      required: true
    },
    getSearchResult: {
      type: Function,
      required: true
    },
    handleSwipe: {
      type: Function,
      reuired: true
    },
    assignGlobal: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      currentCat: '',
      copyCat: this.assignGlobal(),
      searchingCategories: true,
      ask: 'first',
      paramCount: 0,
      params: {}
    };
  },

  methods: {
    randomCat() {
      let random = Math.floor(Math.random() * this.copyCat.length);
      this.currentCat = this.copyCat[random];
      this.copyCat.splice(random, 1);
      // this. = this..filter(a => a.category !== this.currentCat.category);

    },

    handleYes() {
      this.getResult();
    },

    handleNo() {
      this.handleSwipe('questions', 'l');
      // Timeout only necessarry for aesthetics
      setTimeout(() => {
        this.randomCat();
        if(this.copyCat.length === 0) {
          this.toggleView('noresult');
        }
      }, 250);
    },

    getResult() {
      this.toggleView('loading');
      this.copyCat = this.assignGlobal();
      this.getSearchResult(this.currentCat.alias, 0);
    },

    goBack() {
      this.copyCat = this.assignGlobal();
      this.toggleView('back');
    }
  },

  mounted() {
    this.randomCat();
    detectSwipe('questions-main', (id, dir) => {
      if(dir === 'r') {
        this.handleYes();
      }
      else if(dir === 'l') {
        this.handleNo();
      }
    });
  }
};
</script>

<style scoped>
#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  background-color: #393e46;
  text-shadow: none;
  height: 50px;
}
.fa {
  font-size: 2rem;
  color: #eeeeee !important;
}
#left {
  position: relative;
  top: calc(50% - 50px);
  float: left;
  color: red !important;
  font-size: 25px;
  padding-left: 6px;
}
#right {
  position: relative;
  float: right;
  top: calc(50% - 50px);
  color: lime !important;
  font-size: 25px;
  padding-right: 6px;
}
#container {
  margin: 0;
  padding: 0;
}
#questions-main {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #222831;
  color: #eeeeee;
  text-shadow: 0 0 13px black;
}
#questions {
  display: inline-block;
  transition: all .5s;
}
h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>