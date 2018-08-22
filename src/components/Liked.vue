<template>
  <div id="liked-container">
    <span id="title">
      <span id="back" class="fa fa-reply" @click="toggleView('back')" />
      <span class="fa fa-trash" @click="clearAll()" />
    </span>
    <div v-if="liked" id="container">
      <ul>
        <!-- Keep these comments for now -->
          <!-- @click="toggleDelete(like.id)" -->
        <li
          @click="handleLikedView(like.id)"
          v-for="like in liked"
          :key="like.id"
          :id="like.id"
        >
          <div
            :class="like.deleting ? 'name deleting-name' : 'name not-deleting-name'"
          >
            {{ like.name.length > 15 ? like.name.substr(0, 15) + '...' : like.name }}
          </div>
          <div
            :class="like.deleting ? 'del deleting' : 'del not-deleting'"
            @click.stop="handleDelete(like.id)"
          >
            Delete
          </div>
        </li>
      </ul>
    </div>
    <span v-else id="message"><h1>Looks like you haven't liked any spots yet</h1></span>
  </div>
</template>

<script>
import { detectSwipe } from '../services/swipe';
export default {
  name: 'liked',
  props: {
    toggleView: {
      type: Function,
      required: true
    },
    getBusiness: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      liked: null
    };
  },

  methods: {
    handleLikedView(id) {
      this.getBusiness(id);
    },
    toggleDelete(id) {
      this.liked.map(e => e.id === id ? e.deleting = !e.deleting : e.deleting = false);
    },
    clearAll() {
      if(confirm('Remove all \'liked\' spots?')) {
        localStorage.removeItem('liked');
        this.liked = null;
      }
    },
    handleDelete(id) {
      let storage = JSON.parse(localStorage.getItem('liked'));
      // Unlike
      storage = storage.filter(e => e[0] !== id);
      this.liked = this.liked.filter(e => e.id !== id);
      // Reset 'liked' to null if none are left
      if(storage.length === 0) {
        localStorage.removeItem('liked');
      }
      else {
        localStorage.setItem('liked', JSON.stringify(storage));
      }
    }
  },

  mounted() {
    if(!localStorage.getItem('liked')) {
      return;
    }
    this.liked = JSON.parse(localStorage.getItem('liked'));
    // Parse arrays as Objects
    this.liked = this.liked.reduce((acc, cur, i) => {
      acc[i] = { id : cur[0], name : cur[1], deleting : false };
      return acc;
    }, []);
    // Listen for swipes
    setTimeout(() => {
      this.liked.forEach(e => {
        detectSwipe(e.id, (el, dir) => {
          if(dir === 'l' && !e.deleting) {
            this.toggleDelete(e.id);
          }
          else if(dir === 'r' && e.deleting) {
            this.toggleDelete(e.id);
          }
        });
      });
    }, 200);


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
  cursor: pointer;
}
#message h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#container {
  top: 50px;
}
ul {
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  flex-direction: column;
  list-style: none;
  height: calc(100% - 50px);
  width: 100%;
  margin: 0;
  padding: 0;
  transition: .5s ease-in-out;
}
li {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 2rem;
  width: 200%;
  /* height: 100%; */
  border-top: 1px solid grey;
  border-bottom: 1px solid black;
  /* padding: 6px 0; */
  cursor: pointer;
  transition: .5s ease-in-out;
}
.name {
  width: 50%;
  /* border: 1px solid white; */
}
.deleting-name {
  transform: translate(-100px);
  transition: .5s ease-in-out;
}
.not-deleting-name {
  transition: .5s ease-in-out;
}
.del {
  text-align: left;
  position: relative;
  display: inline-block;
  width: 50%;
  height: 100%;
  padding-left: 6px;
  background-color: red;
  color: white;
  transition: .5s ease-in-out;
}
.not-deleting {
  transform: translate(500px);
}
.deleting {
  transform: translate(-100px);
}


</style>