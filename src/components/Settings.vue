<template>
    <span id="settings-main">
        <span v-if="!undisliking">
            <span id="title">
                <span id="back" class="fa fa-reply" @click="toggleView('back')" />
                <h3> </h3>
                <h3> </h3>
            </span>
            <div id="main-content">
                <form id="form">
                    <span id="col-left">
                        <div class="left">Glutton Free</div>
                        <div class="left">Vegan</div>
                        <div class="left">Vegetarian</div>
                        <div class="left">Price</div>
                        <div class="left">Zip Code</div>
                        <div class="left">Distance</div>
                    </span>

                    <span id="col-right">
                        <div class="right">
                            <input class="checkbox" type="checkbox" v-model="settings.gluttonFree">
                        </div>
                        <div class="right">
                            <input class="checkbox" type="checkbox" v-model="settings.vegan">
                        </div>

                        <div class="right">
                            <input class="checkbox" type="checkbox" v-model="settings.vegetarian">
                        </div>

                        <div class="right">
                            <span v-for="i in [1, 2, 3, 4]" :key=i>
                                <a @click="setPrice(i)">
                                    <span :id="i + '-dollar'" :class="settings.price >= i ? 'dollar-light dollars fa fa-dollar' : 'dolar-default dollars fa fa-dollar'" />
                                </a>
                            </span>
                        </div>

                        <div class="right">
                            <div>
                                <input class="textbox" type="text" v-model="settings.zipCode" maxlength="5" pattern="^\d$">
                            </div>
                        </div>

                        <div class="right">
                            <input type="range" min="1" max="25" v-model="settings.distance">
                            <br />{{ settings.distance }}
                            <span v-if="settings.distance == 1"> mile </span>
                            <span v-else> miles</span>
                        </div>
                    </span>

                    <!-- Clear / Save -->
                    <span id="button-container">
                        <div id="reset-dislikes">
                            <input class="reset-btn" type="button" @click="resetDisliked()" value="Dislikes">
                        </div>

                        <div id="clear-settings">
                            <input class="clear-btn" type="button" @click="clearSettings()" value="Clear">
                        </div>

                        <div id="save-settings">
                            <input class="save-btn" type="submit" @click.prevent="saveSettings()" value="Save">
                        </div>
                    </span>
                </form>
            </div>
        </span>

        <Disliked v-else
          :getBusiness="getBusiness"
          :goBack="goBack"
        />
    </span>
</template>

<script>
import Disliked from './Disliked.vue';
export default {
  name: 'Settings',

  data() {
    return {
      undisliking: false
    };
  },

  components: {
    Disliked
  },

  props: {
    settings: Object,
    toggleView: {
      type: Function,
      required: true
    },
    checkSettings: {
      type: Function,
      required: true
    },
    resetSettings: {
      type: Function,
      required: true
    },
    getBusiness: {
      type: Function,
      required: true
    }
  },

  methods: {
    goBack() {
      this.undisliking = false;
    },
    setPrice(price) {
      this.settings.price = price;
      for(let i = 1; i <= 4; i++) {
        let dollar = document.getElementById(i + '-dollar');
        dollar.classList.remove('dollar-light');
        dollar.classList.add('dollar-default');
      }
      for(let i = 1; i <= price; i++) {
        let dollar = document.getElementById(i + '-dollar');
        dollar.classList.remove('dollar-default');
        dollar.classList.add('dollar-light');
      }
    },
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    clearSettings() {
      localStorage.setItem('settings', '');
      this.resetSettings();
    },
    resetDisliked() {
      this.undisliking = true;
    }
  },
  mounted() {
    this.setPrice(this.settings.price);
  }
};
</script>

<style scoped>
#main-content {
    margin: auto;
    padding: 13px;
    max-height: 568px;
    max-width: 320px;
}
#form {
    height: 87vh;
    display: grid;
    grid-template:
        'l  r'
        '.  .'
        'f  f';
    font-size: 25px;
}
.left {
    grid-area: l;
    text-align: left;
}
.right {
    grid-area: r;
    text-align: right;
}
#col-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
#col-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.checkbox {
    transform: scale(2);
}
.dollars {
    padding-left: 13px;
}
.dollar-light {
    color: goldenrod;
}
.dollar-default {
    color: #eeeeee;
}
.textbox {
    font-size: 25px;
    width: 5rem;
}
.clear-btn, .save-btn, .reset-btn {
    font-size: 25px;
}
#button-container {
    grid-area: f;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
