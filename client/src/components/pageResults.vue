<template>
  <section>
    <div class="columns">
      <div class="column is-two-fifths">Results for {{domain}}:</div>
    </div>

    <!-- If Error is returned instead of page results -->
    <div v-if="error">
      <div v-if="error[0]" class="columns">
        <div class="column">
          <div class="has-text-danger is-size-4">{{error[0]}}</div>
          <div class="has-text-danger">
            Make sure the webpage exists and please try again.
            <br />Try changing to the protocol from http to https or visa versa
          </div>
        </div>
      </div>
    </div>

    <div v-if="results !== null">
      <div class="card-header">
        <p class="card-header-title">
          URL:
          <span class="time">Elapsed Time</span>
          <span class="ratio">Mispelled Ratio</span>
        </p>
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
            <p class="card-header-title">
              <span class="url"> {{ collapse.url }}</span>
              <span class="time">{{collapse.data.time}}</span>
              <span class="ratio">
                <span class="has-text-danger">{{(collapse.data.incorrect).length}}</span> /
                <span class="has-text-success">{{(collapse.data.correct).length}}</span>
              </span>
            </p>
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
                    <b-collapse class="panel" :open.sync="missSpelledOpen">
                      <div slot="trigger" class="panel-heading" role="button">
                        <strong>Words spelled incorrectly</strong>
                      </div>
                      <div class="panel-block">
                        <ol>
                          <div v-for="(text, i) in collapse.data.incorrect" :key="i" class="list">
                            <li class="has-text-danger">{{text}}</li>
                          </div>
                        </ol>
                      </div>
                    </b-collapse>
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
              <div v-if="collapse.data.images" class="pictures">
                <b-collapse v-if="collapse.data.images.length !== 0" class="panel" :open.sync="imageOpen">
                  <div slot="trigger" class="panel-heading" role="button">
                    <strong>Images:</strong>
                  </div>
                  <div class="panel-block">
                    <div class="columns is-multiline">
                      <div
                        class=""
                        v-for="(image, i) in collapse.data.images"
                        :key="image + i"
                      >
                        <!-- Image Card -->
                        <div class="card" style="margin: 5px;">
                          <div class="card-image has-background-grey-lighter">
                            <figure class="image is-96x96">
                              <img :src="image" alt="Image Not Found!"/>
                            </figure>
                          </div>
                          <div class="card-content">
                            <div class="content">
                              <a :href="image" target="_blank" rel="noopener noreferrer">URL</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-collapse>
              </div>
            </div>
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
  private missSpelledOpen = false;
  private imageOpen = false;

  @Prop() private results: any;
  @Prop() private domain: string;
  @Prop() private error: string;
}
</script>

<style scoped lang="scss">
ol {
  min-width: 85% !important;
}
.ratio {
  position: absolute;
  left: 65%;
  @media only screen and (max-width: 1215px) {
    position: absolute;
    right: 0px;
  }
}
.time {
  position: absolute;
  right: 10%;
  @media only screen and (max-width: 1215px) {
    visibility: hidden;
  }
}

.pictures {
  max-width: 85%;
}
.url {
  max-width: 65%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
