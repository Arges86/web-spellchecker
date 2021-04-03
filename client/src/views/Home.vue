<template>
  <div class="home">
    <div class="columns">
      <div class="column is-half">
        Select dictionary language:
        <select v-model="selected" class="select">
          <option :disabled="true">Pick Language</option>
          <option
            v-for="option in list"
            v-bind:value="option.value"
            :key="option.value"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <searchForm
      @search:web="searchForText"
      @search:clear="clearPage"
      @domain:boolean="getChecked"
      :isLoading="isLoading"
    />
    <pageResults :domain="domain" :results="text" :error="error" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import searchForm from "../components/searchForm.vue";
import pageResults from "../components/pageResults.vue";
// import { WebSocket } from 'ws';

import { HTTP } from "../services/axios";

interface lang {
  name: string;
  value: string;
}

@Component({
  components: {
    searchForm,
    pageResults,
  },
})
export default class Home extends Vue {
  private text = []; // whole object getting sent to component
  private isLoading = false; // loading boolean
  private domain = ""; // domain of website being searched
  private error = []; // if error getting returned
  private checked: boolean; // if check box is check to search whole domain
  conn = new WebSocket(process.env.VUE_APP_VUE_WEBSOCKET_API);
  list: lang[] = []; // list of dictionaries to use
  selected = null; // which dictionary language to use

  created() {
    localStorage.setItem("webSocketStop", "false");
    this.getDictionaries();
  }

  searchForText(data: string) {
    console.log(data);
    this.text = [];
    this.error = [];
    this.domain = this.breakDownURL(data);
    this.$store.state.domain = this.domain;
    console.log(this.$store.state.domain);

    // if checking whole domain
    if (this.checked) {
      console.log("Checking domain...");
      if ("WebSocket" in window) {
        const conn = new WebSocket(process.env.VUE_APP_VUE_WEBSOCKET_API);

        const params = {
          site: data,
          dictionary: this.selected,
        }

        conn.onopen = function (e) {
          console.log("connection created");
          conn.send(JSON.stringify(params));
        };

        const tempArray = this.text;
        let wsError = this.error;
        localStorage.setItem("webSocketStop", "false");
        conn.onmessage = function (event) {
          // console.log('Message received.');

          const returnObject = JSON.parse(event.data);

          if (returnObject.Error) {
            console.log(returnObject.Error);
            wsError.push(returnObject.Error);
          } else {
            const temp = {
              url: returnObject.url,
              data: returnObject,
            };
            tempArray.push(temp);
          }

          // if value for webSocketStop is 'true' then close connection
          const value = localStorage.getItem("webSocketStop");
          if (value == "true") {
            conn.close();
          }
        };

        conn.onclose = function () {
          console.log("Connection Closed");
        };
      } else {
        console.error("Browser does not support Web Socket");
      }

      // if checking just one page
    } else {
      const request = {
        params: {
          site: data,
          dictionary: this.selected,
        },
      };

      HTTP.get(`/v3/search`, request)
        .then((response) => {
          this.isLoading = false;

          // console.log(response.data);
          this.error = null;
          const temp = {
            url: data,
            data: response.data,
          };
          this.text.push(temp);
          console.log(this.text);
        })
        .catch((error) => {
          if (!this.checked) {
            this.isLoading = false;
          }
          console.log(error);
          this.error.push(error.message);
        });
    }
  }

  /** Get list of dictionary languages */
  private async getDictionaries() {
    this.list = await HTTP.get("languages").then((resp) => resp.data);
    const filtered = this.list.filter((x) => x.value === navigator.language);
    this.selected = filtered[0].value;
  }

  checkStatus(conn) {
    if (this.$store.state.stop) {
      console.log("Stopping search ", this.$store.state.stop);
      conn.close();
    }
  }

  clearPage() {
    this.text = [];
    this.error = [];
  }

  getChecked(data: boolean) {
    console.log("Is Checked ", data);
    this.checked = data;
  }

  /**
   * Strips a URL for just the domain
   * @param {string} url The web address
   * @return {string} The domain portion of the url
   */
  private breakDownURL(url: string): string {
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
