<template>
  <section>
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
    />
    <div class="columns">
      <div class="column is-half">
        <form
          @keyup.enter="onSubmit"
          @keyup="validateForm"
          @paste="validateForm"
          @submit.prevent
        >
          <b-field label="Website">
            <b-input
              v-model="webSite"
              placeholder="https://example.com"
            />
          </b-field>
          <div class="buttons has-addons">
            <b-button
              rounded
              type="is-black"
              :disabled="disabled || isLoading"
              @click="onSubmit"
            >
              Search
            </b-button>
            <b-button
              v-if="checked"
              rounded
              type="is-primary"
              @click="stopSearch"
            >
              Stop
            </b-button>
            <b-button
              rounded
              type="is-warning"
              @click="clearPage"
            >
              Clear
            </b-button>
          </div>
          <label class="checkbox tooltip">
            <input
              id="checkbox"
              v-model="checked"
              type="checkbox"
            >
            Check whole domain?
            <span
              class="tooltiptext"
            >Check this to spell check each page on the site.</span>
          </label>
          <label
            class="checkbox tooltip ml-5 has-text-left"
            for="checkboxFast"
          >
            <input
              id="checkboxFast"
              v-model="fast"
              type="checkbox"
            >
            Search quickly?
            <br>
            <small>Turn off this option if initially it returns no results.</small>
            <span
              class="tooltiptext"
            >Search with seleium, or via http.</span>
          </label>
        </form>
        <div
          v-if="error"
          class="error has-text-danger"
        >
          {{ error }}
        </div>
      </div>
      <div class="column">
        Welcome!
        <p>Simple enter any public web address and click 'Search'.</p>
        <p>The site will get all the text on the page, and check its spelling.</p>
        <div v-if="checked">
          <br>
          <b-message
            title="Warning"
            aria-close-label="Close message"
          >
            When crawling domain this can take some time. <br> Sit back and relax.
          </b-message>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
export default class searchForm extends Vue {
  webSite = ""; // input into search box
  disabled = true; // enables submit button
  error = null; // displays input error message
  checked = false; // value of checkbox
  fast = true; // if to search quickly or slowly

  @Prop() private isLoading: boolean;

  created() {
    console.log(this.$store.state.page);
    this.webSite = this.$store.state.page;
    this.validateForm();
  }

  @Emit("search:web")
  searchWeb() {
    this.$store.state.page = this.webSite;
    this.checkDomain();
    this.getFast();
    return this.webSite;
  }

  @Emit("domain:boolean")
  checkDomain() {
    return this.checked;
  }

  @Emit("search:clear")
  clearPage(){
    this.webSite = "";
    return true;
  }

  @Emit("fast:boolean")
  getFast() {
    return this.fast;
  }

  onSubmit() {
    const regEx = /:\/\/(.[^/]+)/;
    if (this.webSite === "") {
      this.error = "Please enter a web address.";
      this.disabled = true;
    } else {
      if (regEx.test(this.webSite)) {
        // do nothing
      } else {
        this.webSite = `http://${this.webSite}`;
      }
      this.searchWeb();
    }
  }

  stopSearch() {
    localStorage.setItem("webSocketStop", "true");
  }

  validateForm() {
    this.webSite = this.webSite.trim();
    if (this.webSite) {
      this.disabled = false;
    }
  }
}
</script>

<style scoped lang='scss'>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.lot {
  left: -2.8rem;
}

.little {
  left: -1.2rem;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.404);
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
