<template>
  <div id="disliked-container">
    <span id="title">
      <span id="back" class="fa fa-reply" @click="back()" />
      <span class="fa fa-trash" @click="clearAll()" />
    </span>
    <div v-if="disliked" id="container">
      <ul>
        <!-- Keep these comments for now -->
          <!-- @click="toggleDelete(dislike.id)" -->
        <li
          @click="handleDislikedView(dislike.id)"
          v-for="dislike in disliked"
          :key="dislike.id"
          :id="dislike.id"
        >
          <div
            :class="dislike.deleting ? 'name deleting-name' : 'name not-deleting-name'"
          >
            {{ dislike.name.length > 15 ? dislike.name.substr(0, 15) + '...' : dislike.name }}
          </div>
          <div
            :class="dislike.deleting ? 'del deleting' : 'del not-deleting'"
            @click.stop="handleDelete(dislike.id)"
          >
            Delete
          </div>
        </li>
      </ul>
    </div>
    <span v-else id="message"><h1>Looks dislike you haven't disliked any spots yet</h1></span>
  </div>
</template>

<script>
import { detectSwipe } from '../services/swipe';
export default {
  name: 'disliked',
  props: {
    getBusiness: {
      type: Function,
      required: true
    },
    goBack: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      disliked: null
    };
  },

  methods: {
    back() {
      this.goBack();
    },
    handleDislikedView(id) {
      this.getBusiness(id);
    },
    toggleDelete(id) {
      this.disliked.map(e => e.id === id ? e.deleting = !e.deleting : e.deleting = false);
    },
    clearAll() {
      if(confirm('Remove all \'zliked\' spots?')) {
        localStorage.removeItem('disliked');
        this.disliked = null;
      }
    },
    handleDelete(id) {
      let storage = JSON.parse(localStorage.getItem('disliked'));
      // Unlike
      storage = storage.filter(e => e[0] !== id);
      this.disliked = this.disliked.filter(e => e.id !== id);
      // Reset 'disliked' to null if none are left
      if(storage.length === 0) {
        localStorage.removeItem('disliked');
      }
      else {
        localStorage.setItem('disliked', JSON.stringify(storage));
      }
    }
  },

  mounted() {
    if(!localStorage.getItem('disliked')) {
      return;
    }
    this.disliked = JSON.parse(localStorage.getItem('disliked'));
    // Parse arrays as Objects
    this.disliked = this.disliked.reduce((acc, cur, i) => {
      acc[i] = { id : cur[0], name : cur[1], deleting : false };
      return acc;
    }, []);
    // Listen for swipes
    setTimeout(() => {
      this.disliked.forEach(e => {
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