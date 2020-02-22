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
// import { WebSocket } from 'ws';

import { HTTP } from "../services/axios";
import { sendws } from "../services/webpages";

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
  // private ws = new WebSocket(process.env.VUE_WEBSOCKET_API);

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
    console.log(data);
    this.text = [];
    this.domain = this.breakDownURL(data);
    this.$store.state.domain = this.domain;
    console.log(this.$store.state.domain);
    this.isLoading = true;

    if (this.checked) {
      console.log('Checking domain...');
      if ("WebSocket" in window) {
            const conn = new WebSocket(process.env.VUE_APP_VUE_WEBSOCKET_API);

            conn.onopen = function (e) {
                console.log('connection created');
                conn.send(JSON.stringify(data));
            }

            const tempArray = this.text;
            conn.onmessage = function (event) {
                // console.log('Message received.');

                const returnObject=JSON.parse(event.data);
                // console.log(returnObject);

                const temp = {
                  url: returnObject.url,
                  data: returnObject
                };
                tempArray.push(temp);
            }

            let loading = this.isLoading;
            conn.onclose = function() {
                console.log('Connection Closed');
                loading = false;
            }

        } else {
            console.error('Browser does not support Web Socket');
        }

    } else {
          
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
        })
        .catch(error => {
          if (!this.checked) {
            this.isLoading = false;
          }
          console.log(error);
          this.error = error;
        });
    }
  }

  getChecked(data: boolean) {
    console.log('Is Checked ', data);
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
