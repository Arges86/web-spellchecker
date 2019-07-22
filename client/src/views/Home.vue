<template>
  <div class="home">
    <searchForm  @search:web="searchForText"/>
    <pageResults :domain="domain" :text="text"/>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
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

  private text = {};
  private isFullPage = true;
  private isLoading = false;
  private domain = '';

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
    this.text = {};
    this.isLoading = true
    this.domain = this.breakDownURL(data);
    this.$store.state.domain = this.domain;

    const request = {
      params: {
        site: data
      }
    }

    HTTP.get(`/search`,request)
    .then(response => {
      this.isLoading = false;
      console.log(response.data);
      this.text = response.data
    })
    .catch(error => {
      this.isLoading = false;
      console.log(error);
    });
  }

    private breakDownURL(url: string) {
    let domain = '';
    // remove 'http://'
    if (url.indexOf('http://') === 0) {
        url = url.substr(7);
    }
    // remove 'https://'
    if (url.indexOf('https://') === 0) {
        url = url.substr(8);
    }
    // remove 'www.'
    if (url.indexOf('www.') === 0) {
        url = url.substr(4);
    }
    domain = url.split('/')[0].split('.')[0];

    return domain;
  }

}
</script>
