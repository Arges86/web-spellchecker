<template>
  <section>
    <div class="columns">
      <div class="column is-two-fifths">Results for {{domain}}:</div>
    </div>
    <div v-if="error" class="columns">
      <div class="column">
        <div class="has-text-danger is-size-4"> {{error}} </div>
        <div class="has-text-danger">Make sure the webpage exists and please try again.<br>Try changing to the protocol from http to https or visa versa</div>
      </div>
    </div>
    <div v-if="text['text']" class="columns">
      <div v-if="(text['text']).length === 0" class="noText">
        Could not find any words on this page.
      </div>
      <div v-else class="column is-half">
        <div v-if="misspelled.length > 0" class="results">
          <div v-if="misspelled[0]['passed']" class="has-text-success">{{misspelled[0]['passed']}}</div>
          <div v-else>
            <div class="title is-3">List of misspelled words</div>
            <div class="panel-block">
              <ol>
                <div v-for="(error, i) in misspelled" :key="i" class="list">
                  <li class="has-text-danger">{{error}}</li>
                </div>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div v-if="correctlySpelled.length > 0" class="column is-two-fifths">
        <b-collapse aria-id="contentIdForA11y2" class="panel" :open.sync="isOpen">
          <div slot="trigger" class="panel-heading" role="button" aria-controls="contentIdForA11y2">
            <strong>Words spelled correctly</strong>
          </div>
          <div class="panel-block">
            <ol>
              <div v-for="(correct, i) in correctlySpelled" :key="i" class="list">
                <li class="has-text-success">{{correct}}</li>
              </div>
            </ol>
          </div>
        </b-collapse>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface Results {
  text: Array<string>;
  links: Array<string>;
}

@Component
export default class pageResults extends Vue {
  private dictionary: Array<String>;
  private misspelled = [];
  private correctlySpelled = [];
  private isOpen = false;

  @Prop() private text: any;
  @Prop() private domain: string;
  @Prop() private error: string;

  @Watch("domain")

  // when 'text' prop is changed
  @Watch("text") TextResults(data: Results) {
    console.log(data);
    if (data.text) {

        console.log(this.domain);

        this.misspelled = [];
        this.correctlySpelled = [];

        if (data.text) {
          this.dictionary = localStorage.getItem("dictionary").split(",");
          this.contains(data.text, this.dictionary);
        }

        console.log(data.links);
        const links = data.links.filter(x => x.includes(this.domain));
        console.log(links);
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
