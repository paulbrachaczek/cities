<template>
  <div class="home">
    <div class="m-input -input-text">
        <label for="country">Where You like to go this weekend?</label>
        <input type="text" name="country"  v-model="country"  id="country">  
      </div>  
      <button v-on:click.prevent="getCities()">search</button> 
      <ul>
        <li v-for="city in cities" v-bind:key="city.name">
          <span v-on:click.prevent="getCity(city.name)">{{city.name}}</span>
        </li>
      </ul>
      <p>
        {{city}}
      </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';


@Component({
    components: {
       
    }
})
export default class Home extends Vue {
  public country = '';
  public citynames = [
    {
      name: "France",
      id: "FR"
    },
    {
      name: "Poland",
      id: "PL"
    },
    {
      name: "Germany",
      id: "GR"
    },
    {
      name: "Spain",
      id: "SP"
    }
  ]

  public cities = [];
  private citiesUrl = 'https://api.openaq.org/v1/cities';
  private wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=';
  public city: string|null = null;

  constructor() {
    super();
  
  }

  mounted() {
    if (localStorage.country) {
      this.country = localStorage.country;
      this.getCities();
      console.log(this.country);
    } 
    if (localStorage.city) {
      const city = localStorage.city;
      this.getCity(city);

    } 
  }

  public getCities() {  
    localStorage.country = this.country;
    axios.get(`${this.citiesUrl}?limit=10&country=${this.country}&&order_by[]=count&sort=desc`).then((response: AxiosResponse) => {
      this.cities = response.data.results;     
      this.city = null; 
    }).catch(
      (error:string) => {
        
      }
    )
  }

  getCity(_city: string) {
    const city = _city;

    localStorage.city = city;
    console.log(city);
    axios.get(`${this.wikiUrl}${city}`).then((response: AxiosResponse) => {
      const obj = response.data.query.pages;    
      if(obj) {
        this.city = (Object as any).values!(obj)[0].extract;
      }
    }).catch((error)=>{});
  }
}
</script>
