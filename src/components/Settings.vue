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

                    <span id="col-right">
                        <div class="row">
                            <span>Gluten Free</span>
                            <input class="checkbox" type="checkbox" v-model="settings.glutenFree">
                        </div>
                        <div class="row">
                            <span>Vegan</span>
                            <input class="checkbox" type="checkbox" v-model="settings.vegan">
                        </div>

                        <div class="row">
                            <span>Vegetarian</span>
                            <input class="checkbox" type="checkbox" v-model="settings.vegetarian">
                        </div>

                        <div class="row">
                            <span class="left">Price</span>
                            <span>
                                <span v-for="i in [1, 2, 3, 4]" :key=i>
                                    <a @click="setPrice(i)">
                                        <span :id="i + '-dollar'" :class="settings.price >= i ? 'dollar-light dollars fa fa-dollar' : 'dolar-default dollars fa fa-dollar'" />
                                    </a>
                                </span>
                            </span>
                        </div>

                        <div class="row">
                            <span>Zip Code</span>
                            <input class="textbox" type="text" v-model="settings.zipCode" maxlength="5" pattern="^\d$">
                        </div>

                        <div class="row">
                            <span>Distance</span>
                            <span>
                                <input type="range" min="1" max="25" v-model="settings.distance">
                                <br />{{ settings.distance }}
                                <span v-if="settings.distance == 1"> mile </span>
                                <span v-else> miles</span>
                            </span>
                        </div>
                    </span>

                    <!-- Clear / Save -->
                    <span id="button-container" class="row">
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
    display: flex;
    flex-direction: column;
    font-size: 25px;
}
.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
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
#button-container {
    grid-area: f;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
#button-container input {
    font-size: 1.25rem;
}
</style>
