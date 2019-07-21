<template>
  <section>
      <div class="columns">
        <div class="column is-half">
          <form 
            v-on:keyup.enter="searchWeb"
            v-on:submit.prevent>
            <b-field label="Website">
              <b-input
                v-model="webSite"
                placeholder="example.com"></b-input>
            </b-field>
            <b-button
              @click="searchWeb" 
              type="is-black is-pulled-left"
              >Search</b-button>
          </form>
        </div>
      </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class searchForm extends Vue {

  webSite = 'https://arges86.homeserver.com';

  @Emit('search:web')
  searchWeb() {
    console.log(this.webSite);
    const regEx = /:\/\/(.[^/]+)/;
    return this.webSite;
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
