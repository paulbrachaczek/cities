<template>
  <ul v-if="items" v-show="isOpen" class="m-autocomplete">
      <li v-for="(item, i) in items" :class="{ '-active': i === active }" @click="setResult([item.id, item.name])" v-bind:key="item.id">
          {{item.name}}
      </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';


@Component({
    components: {
    }
})
export default class Autocomplete extends Vue {
  @Prop() items!: any[];
  @Prop() isOpen!: boolean;
  @Prop() active!: number;
 
  constructor() {
    super();
  
  }

  @Emit()
  setResult(result) {
    return result;
  }

  mounted() {
    
  }
}
</script>
