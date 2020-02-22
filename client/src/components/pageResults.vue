<template>
  <section>
    <div class="columns">
      <div class="column is-two-fifths">Results for {{domain}}:</div>
    </div>

    <!-- If Error is returned instead of page results -->
    <div v-if="error[0]" class="columns">
      <div class="column">
        <div class="has-text-danger is-size-4">{{error[0]}}</div>
        <div class="has-text-danger">
          Make sure the webpage exists and please try again.
          <br />Try changing to the protocol from http to https or visa versa
        </div>
      </div>
    </div>

    <div v-if="results[0]">
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
            <div v-if="collapse.data.text">
              <div
                v-if="collapse.data.text.length === 0"
                class="noText"
              >Could not find any words on this page.</div>

              <div v-else class="columns">

                <!-- Mispelled words -->
                <div class="column is-two-fifths">
                  <div v-for="(text, i) in collapse.data.incorrect" :key="i" class="list">
                    <span class="has-text-danger">{{text}}</span>
                  </div>
                </div>

                <!-- Words spelled correctly -->
                <div class="column is-two-fifths">
                  <b-collapse class="panel" :open.sync="spelledOpen">
                  <div slot="trigger" class="panel-heading" role="button">
                    <strong>Words spelled correctly</strong>
                  </div>
                  <div class="panel-block">
                  <ol>
                    <div v-for="(text, i) in collapse.data.correct" :key="i" class="list">
                      <li class="has-text-success">{{text}}</li>
                    </div>
                  </ol>
                  </div>
                  </b-collapse>
                </div>

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

}
</script>

<style scoped lang="scss">
ol {
  min-width: 85% !important;
}
</style>
