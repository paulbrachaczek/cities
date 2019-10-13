<template>
  <div id="app">
    <header>
      City Break for a weekend
    </header>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <!-- <main>
      <div class="m-input -input-text">
        <label for="country">Where You like to go this weekend?</label>
        <input type="text" name="country" v-model="cityname"  id="country">  
      </div>  
      <button v-on:click.prevent="getCities()">search</button> 
      <ul>
        <li v-for="city in cities" v-bind:key="city.name">
          {{city.name}}
        </li>
      </ul>
      {{cityname}}
    </main> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';

export default class App extends Vue {
  // public cityname = '';
  // public cities = [
    
  // ];
  // private citiesUrl = 'https://api.openaq.org/v1/cities';


  // public getCities() {  
  //   axios.get(`${this.citiesUrl}?limit=50&country=PL`).then((response: AxiosResponse) => {
  //     console.log(response.data.results);

  //     this.cities = response.data.results;
  //     console.log(this.cities);
      
  //   }).catch(
  //     (error:string) => {
        
  //     }
  //   )
  // }
}
</script>
