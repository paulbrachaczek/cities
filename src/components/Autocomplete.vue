<template>
  <ul v-if="items">
      <li v-for="item in items" v-key="item.id">
          {{item.name}}
      </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';


@Component({
    components: {
    }
})
export default class Autocomplete extends Vue {
  @Prop() items!: any[];
 
  constructor() {
    super();
  
  }

  mounted() {
    
  }

  
}
</script>
