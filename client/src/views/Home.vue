<template>
  <div class="home">
    <searchForm @search:web="searchForText" @domain:boolean="getChecked" :isLoading="isLoading"/>
    <pageResults :domain="domain" :results="text" :error="error" />
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
  private isLoading = false; // loading boolean
  private domain = ""; // domain of website being searched
  private error = ""; // if error getting returned
  private checked: boolean; // if check box is check to search whole domain
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
        
        if (!this.checked) {
          this.isLoading = false;
        }

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
                // this.text.push({
                //   url: (response.data.links[i]).toLowerCase()
                // });
              }
            }
          }
          console.log(this.text);
          console.log(this.URLs.size);
          this.loopThroughDomain();

        }
      })
      .catch(error => {
        if (!this.checked) {
          this.isLoading = false;
        }
        console.log(error);
        this.error = error;
      });
  }

  // loops through whole domain array
  loopThroughDomain() {
    const getText = request => {
      return new Promise((resolve, reject) => {
       HTTP.get(`/v2/search`, request)
          .then(response => {
            return resolve(response.data);
          })
          .catch(error => {
            return reject(error.response);
          });
      });
    };

    // async loop through webpages
    const start = async () => {

      // adds loading icon
      this.isLoading = true;

      // turns set in to an array then loops through it
      const tempArray = Array.from(this.URLs);
      for (let i = 0; i < (tempArray).length; i++) {

        const url = tempArray[i];
        console.log('URL: ', url);

        const request = {
          params: {
            site: url
          }
        };
        const check = await getText(request)
          .then(response => {
            console.log(response);

            // pushes new data to text array
            this.text.push({
              url: url,
              data: response,
            });
          })
          .catch(_ => {
            console.log('error ',_);
          });
      }
      console.log("Done");
      this.isLoading = false;
    };

    // trigger loop
    start();
  }

  getChecked(data: boolean) {
    this.checked = data;
  }

  // removes protocal and 'www' from URL
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
