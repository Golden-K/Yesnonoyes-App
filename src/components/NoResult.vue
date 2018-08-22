<template>
  <div id="liked-container">
    <span id="title">
      <span id="back" class="fa fa-reply" @click="toggleView('back')" />
      <h3></h3>
    </span>
    <span id="container">
      <h1>No results were found</h1>
    <button @click="randomSearch" id="lucky-button">Feeling Lucky?</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'no-result',
  props: {
    toggleView: {
      type: Function,
      required: true
    },
    randomSearch: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
    };
  },

  methods: {
  },

  mounted() {
  }
};
</script>

<style scoped>
@keyframes button-glow {
  from {
    box-shadow: 0 0 0 #00adb5;
  }
  to {
    box-shadow: 0 0 13px 3px #00adb5;
  }
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
h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#lucky-button {
  font-size: 1rem;
  font-weight: bold;
  color: #222831;
  background-color: #eeeeee;
  border-style: none;
  border-radius: 10px;
  height: 2em;
  position: absolute;
  top: 33%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: button-glow 3s alternate infinite ease-out;
}
#lucky-button:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
</style>
