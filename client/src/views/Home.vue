<template>
  <div class="home">
    <searchForm  @search:web="searchForText"/>
    <pageResults/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import searchForm from '../components/searchForm.vue';
import pageResults from '../components/pageResults.vue';

import {HTTP} from '../services/axios';

@Component({
  components: {
    searchForm,
    pageResults,
  },
})
export default class Home extends Vue {

  created() {
    if (localStorage.getItem('dictionary') === null) {
      HTTP.get(`dictionary`)
      .then(response => {
        localStorage.setItem('dictionary', response.data)
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      const dict = localStorage.getItem('dictionary')
      console.log('local dictionary');
    }
  }
  
  private searchForText(data:string) {
    console.log(data);

    const request = {
      params: {
        site: data
      }
    }

    HTTP.get(`/search`,request)
    .then(response => {
      console.log(response.data);
    })

    .catch(error => {
      console.log(error);
    });
  }
}
</script>
