<template>
  <section>
      <div class="columns">
        <div class="column is-half">
            Results:
        </div>
      </div>
      <div class="columns">
        <div class="column is-half">
          <div v-if="misspelled.length > 0" class="results">
            <div v-if="misspelled.passed" class="success">
              {{misspelled.passed}}
            </div>
            <div v-else>
              <div class="title is-3">List of misspelled words</div>
              <div  v-for="(error, i) in misspelled" :key="i" class="list">
                <strong>{{i + 1}}: </strong> {{error}}
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

interface Results {
  text: Array<string>,
  links: Array<string>
}

@Component
export default class pageResults extends Vue {

  private dictionary: Array<String>;
  private misspelled = [];
  private textResult: Array<String>;

  @Prop() private text: any;

  // when 'text' prop is changed
  @Watch('text')TextResults(data: Results) {
    console.log(data);
    this.textResult = data.text;
    this.misspelled = []

    if (this.textResult){
      this.dictionary = localStorage.getItem('dictionary').split(',');
      this.contains(this.textResult, this.dictionary);
    }
  }

  contains(array1, array2){

    console.log(array1);

    // loop through all words returned from webpage
    for (let i =0; i < array1.length; i++ ) {

      // if word is not in dictionary, add it to list of misspelled words
      if (this.inDictionary(array2, array1[i])) {
      } else {
        this.misspelled.push(array1[i]);
      }
    }

    if (this.misspelled.length === 0) {
      this.misspelled.push({passed: 'There are no missplled words on this page.'})
    }
  }

  // function to check if word is in dictionary
  inDictionary(arr: Array<string>, val:string):boolean {
    return arr.some(arrVal => val.toLowerCase() === arrVal)
  }

}
</script>

<style scoped lang="scss">

</style>
