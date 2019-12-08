<template>
  <section>
    <div class="columns">
      <div class="column is-two-fifths">Results for {{domain}}:</div>
    </div>

    <!-- If Error is returned instead of page results -->
    <div v-if="error" class="columns">
      <div class="column">
        <div class="has-text-danger is-size-4">{{error}}</div>
        <div class="has-text-danger">
          Make sure the webpage exists and please try again.
          <br />Try changing to the protocol from http to https or visa versa
        </div>
      </div>
    </div>

    <!-- If page results are returned -->
    <div v-if="results[0]">
      <!-- collapse for each page -->
      <b-collapse
        class="card"
        v-for="(collapse, index) of results"
        :key="index"
        :open="isOpen == index"
        @open="isOpen = index"
      >
        <div slot="trigger" slot-scope="props" class="card-header" role="button">
          <p class="card-header-title">{{ collapse.url }}</p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
          </a>
        </div>
        <div class="card-content">
          <div v-if="collapse.data" class="content">
            <div v-if="collapse.data.text" class="columns">
              <div
                v-if="collapse.data.text.length === 0"
                class="noText"
              >Could not find any words on this page.</div>
              <div v-else class="column is-half">
                <!-- misspelled objects -->
                <div v-if="collapse.data.spelling">
                  <div v-if="collapse.data.spelling.misspelled.length > 0" class="results">
                    <div
                      v-if="collapse.data.spelling.misspelled[0]['passed']"
                      class="has-text-success"
                    >{{collapse.data.spelling.misspelled[0]['passed']}}</div>
                    <div v-else>
                      <div class="title is-3">List of misspelled words</div>
                      <div class="panel-block">
                        <ol>
                          <div
                            v-for="(error, i) in collapse.data.spelling.misspelled"
                            :key="i"
                            class="list"
                          >
                            <li class="has-text-danger">{{error}}</li>
                          </div>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- spelled correctly objects -->
              <div
                v-if="collapse.data.spelling.correctlySpelled.length > 0"
                class="column is-two-fifths"
              >
                <b-collapse aria-id="contentIdForA11y2" class="panel" :open.sync="spelledOpen">
                  <div
                    slot="trigger"
                    class="panel-heading"
                    role="button"
                    aria-controls="contentIdForA11y2"
                  >
                    <strong>Words spelled correctly</strong>
                  </div>
                  <div class="panel-block">
                    <ol>
                      <div
                        v-for="(correct, i) in collapse.data.spelling.correctlySpelled"
                        :key="i"
                        class="list"
                      >
                        <li class="has-text-success">{{correct}}</li>
                      </div>
                    </ol>
                  </div>
                </b-collapse>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface Results {
  text: Array<string>;
  links: Array<string>;
  spelling: any;
}

interface TextReturn {
  url: string;
  data: Results;
}

@Component
export default class pageResults extends Vue {
  private dictionary: Array<String>;
  private misspelled = [];
  private correctlySpelled = [];
  private isOpen = 0;
  private spelledOpen = false;

  @Prop() private results: any;
  @Prop() private domain: string;
  @Prop() private error: string;

  // @Watch("domain")

  // when 'text' prop is changed
  @Watch("results")
  TextResults(data: [TextReturn]) {
    console.log(data);

    if (data[0]) {
      this.dictionary = localStorage.getItem("dictionary").split(",");

      for (let i = 0; i < data.length; i++) {
        if (data[i].data) {
          data[i].data.spelling = this.returnSpelling(
            data[i].data.text,
            this.dictionary
          );
        }
      }

      console.log("After processing: ");
      console.log(data);
    }
  }

  contains(array1, array2) {
    // loop through all words returned from webpage
    for (let i = 0; i < array1.length; i++) {
      // if word is not in dictionary, add it to list of misspelled words
      if (this.inDictionary(array2, array1[i])) {
        this.correctlySpelled.push(array1[i]);
      } else {
        this.misspelled.push(array1[i]);
      }
    }

    if (this.misspelled.length === 0) {
      this.misspelled.push({
        passed: "There are no misspelled words on this page."
      });
      console.log(this.misspelled);
    }
  }

  returnSpelling(text, dictionary) {
    // console.log(text, dictionary);
    let correctlySpelled = [];
    let misspelled = [];

    // loop through all words returned from webpage
    for (let i = 0; i < text.length; i++) {
      // if word is not in dictionary, add it to list of misspelled words
      if (this.inDictionary(dictionary, text[i])) {
        correctlySpelled.push(text[i]);
      } else {
        misspelled.push(text[i]);
      }
    }

    if (misspelled.length === 0) {
      misspelled.push({
        passed: "There are no misspelled words on this page."
      });
      console.log(this.misspelled);
    }
    return {
      misspelled: misspelled,
      correctlySpelled: correctlySpelled
    };
  }

  // function to check if word is in dictionary
  inDictionary(arr: Array<string>, val: string): boolean {
    return arr.some(arrVal => val.toLowerCase() === arrVal);
  }
}
</script>

<style scoped lang="scss">
ol {
  min-width: 85% !important;
}
</style>
