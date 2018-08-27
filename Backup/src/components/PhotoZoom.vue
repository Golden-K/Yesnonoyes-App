<template>
  <div id="photo-zoom-main" @click.stop="handleZoom">
      <img
        id="zoom-img"
        :src="zoomPhotos[currentPhotoNum]"
      >
  </div>
</template>

<script>
import { detectSwipe } from '../services/swipe';
export default {
  props: {
    zoomPhotos: Array,
    currentPhotoNum: Number,
    toggleZoom: {
      type: Function,
      required: true
    },
    handlePhoto: {
      type: Function,
      required: true
    }
  },

  methods: {
    handleZoom() {
      this.toggleZoom();
    }
  },

  created() {
    setTimeout(() => {
      detectSwipe('photo-zoom-main', (id, dir) => {
        // console.log('direction = ', dir);
        if(dir === 'r') {
          this.handlePhoto(1, 'zoom-img');
        }
        else if(dir === 'l') {
          this.handlePhoto(-1, 'zoom-img');
        }
      });
    }, 0);
  }

};
</script>

<style scoped>
#photo-zoom-main {
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: rgba(0, 0, 0, .69);
}
img {
  max-width: 100%;
  height: auto;
  top: 50%;
}
</style>