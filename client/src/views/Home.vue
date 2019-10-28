<template>
  <div class="home">
    <searchForm @search:web="searchForText" @domain:boolean="getChecked" />
    <pageResults :domain="domain" :results="text" :error="error" />
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import searchForm from "../components/searchForm.vue";
import pageResults from "../components/pageResults.vue";

import { HTTP } from "../services/axios";

@Component({
  components: {
    searchForm,
    pageResults
  }
})
export default class Home extends Vue {
  private text = []; // whole object getting sent to component
  private isFullPage = true; // loading boolean
  private isLoading = false; // loading boolean
  private domain = ""; // domain of website being searched
  private error = ""; // if error getting returned
  private checked: boolean; // if check box is check to search whole domain
  // private URLs = []; // array of all URLs to loop through
  private URLs =  new Set([]);

  created() {
    if (localStorage.getItem("dictionary") === null) {
      HTTP.get(`dictionary`)
        .then(response => {
          localStorage.setItem("dictionary", response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const dict = localStorage.getItem("dictionary");
      console.log("local dictionary");
    }
  }

  private searchForText(data: string) {
    console.log(this.checked);
    console.log(data);
    this.text = [];
    this.isLoading = true;
    this.domain = this.breakDownURL(data);
    this.$store.state.domain = this.domain;
    console.log(this.$store.state.domain);

    const request = {
      params: {
        site: data
      }
    };

    HTTP.get(`/v2/search`, request)
      .then(response => {
        this.isLoading = false;
        console.log(response.data);
        this.error = null;
        const temp = {
          url: data,
          data: response.data
        };
        this.text.push(temp);

        // if checking whole domain
        if (this.checked) {
          console.log("Checking whole domain...");

          // loop through responses
          for (let i = 0; i < response.data.links.length; i++) {

            // if part of domain
            if (response.data.links[i].includes(this.domain)) {

              // if not already on list
              if (!this.URLs.has(response.data.links[i])) {
                this.URLs.add(response.data.links[i]);
                this.text.push({
                  url: (response.data.links[i]).toUpperCase()
                });
              }
            }
          }
        }
      })
      .catch(error => {
        this.isLoading = false;
        console.log(error);
        this.error = error;
      });
  }

  getChecked(data: boolean) {
    this.checked = data;
  }

  private breakDownURL(url: string) {
    let domain = "";
    // remove 'http://'
    if (url.indexOf("http://") === 0) {
      url = url.substr(7);
    }
    // remove 'https://'
    if (url.indexOf("https://") === 0) {
      url = url.substr(8);
    }
    // remove 'www.'
    if (url.indexOf("www.") === 0) {
      url = url.substr(4);
    }
    domain = url.split("/")[0].split(".")[0];

    return domain;
  }
}
</script>
