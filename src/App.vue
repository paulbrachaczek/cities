<template>
   <div id="app">
    <header class="o-header">
      <Logo/>
    </header>
    <main>
      <div class="container">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
#app { 
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import Logo from '@/layout/Logo.vue';

@Component({
  components: {
    Logo
  },
})
export default class App extends Vue {
}
</script>
