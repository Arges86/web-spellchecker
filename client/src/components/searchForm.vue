<template>
  <section>
      <div class="columns">
        <div class="column is-half">
          <form 
            v-on:keyup.enter="onSubmit"
            v-on:keyup="validateForm"
            v-on:paste="validateForm"
            v-on:submit.prevent>
            <b-field label="Website">
              <b-input
                v-model="webSite"
                placeholder="example.com"></b-input>
            </b-field>
            <b-button
              @click="onSubmit" 
              type="is-black is-pulled-left"
              :disabled="disabled"
              >Search</b-button>
          </form>
          <div v-if="error" class="error has-text-danger">
            {{error}}
          </div>
        </div>
        <div class="column">
          Welcome!
          <p>Simple enter any public web address and click 'Search'.</p>
          <p>The site will get all the text on the page, and check its spelling.</p>
        </div>
      </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component
export default class searchForm extends Vue {

  webSite = ''
  disabled = true;
  error = null;

  created(){
    console.log(this.$store.state.page);
    this.webSite = this.$store.state.page;
    this.validateForm();
  }

  @Emit('search:web')
  searchWeb() {
    this.$store.state.page = this.webSite;
    return this.webSite;
  }
  
  onSubmit() {
    const regEx = /:\/\/(.[^/]+)/;
    console.log(this.webSite.search(regEx));
     if (this.webSite === '') {
      this.error = "Please enter a web address."
      this.disabled = true;
    } else {
      this.searchWeb();
    }

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
</style>
