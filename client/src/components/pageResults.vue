<template>
  <section>
      <div class="columns">
        <div class="column is-half">
            Testing:
        </div>
      </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class pageResults extends Vue {
  @Prop() private msg!: string;

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
