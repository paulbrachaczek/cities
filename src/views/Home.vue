<template>
  <div class="home">
    <transition name="step-anim" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft">
      <section class="o-section -first" v-if="step === 0">
        <div class="m-input -input-text">
            <label for="country">Where You like to go this weekend?</label>
            <input  type="text" 
                    name="country" 
                    placeholder="Select country" 
                    @input="filterCities()" 
                    v-model="country" 
                    v-on:keyup.enter="onEnterVal()" 
                    @keydown.down="onArrowDown()"
                    @keydown.up="onArrowUp()"
                    @focus="autocompleteOpen = true"
                    @blur="autocompleteOpen = false"
                    id="country">  
        </div>  
        <Autocomplete @set-result="setCountry" :items="results" :isOpen="autocompleteOpen" :active="arrowCounter" />  
        <button  :disabled="inProgress" class="a-button -primary" v-on:click.prevent="onEnterVal()">search</button> 
      </section>
    </transition>
    <transition name="step-anim" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft">
      <section class="o-section -second" v-if="step === 1">
        <h2>
            Most polluted cities right now:
        </h2>
        <ul class="m-list">
          <li v-for="city in cities" v-bind:key="city.id" class="m-list_element">
            <a href="#" v-on:click.prevent="getCity(city.name)" :class="{'-active': city.name === selected}">{{city.name}} <span>PM 2.5: {{avg(city.pm25)}}</span></a>
          </li>
        </ul>
        <transition name="step-anim" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutLeft">
          <div v-if="city" class="m-city">
            {{city}}
          </div>
        </transition>
        <div class="m-buttons">
          <button  :disabled="inProgress" class="a-button -primary" v-on:click.prevent="step = 0; scrollTop()">To beginning</button>
        </div>
      </section>
    </transition>
    <transition name="step-anim" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <Loader v-if="inProgress"/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import  Autocomplete from "@/components/Autocomplete.vue";
import { Location, Country } from '../models/models';
import Loader from '../components/Loader.vue';

@Component({
    components: {
       Autocomplete,
       Loader
    }
})
export default class Home extends Vue {
  public country = '';
  public coutrynames = [
    {
      id: "FR",
      name: "France",
    },
    {
      id: "PL",
      name: "Poland",
    },
    {
      id: "DE",
      name: "Germany"
    },
    {
      id: "ES",
      name: "Spain"
    }
  ];
  public results: (Country|null)[] = [];
  public autocompleteOpen = false;
  public step = 0;
  public cities: (null|any)[] = [];
  private citiesUrl = 'https://api.openaq.org/v1/measurements/';
  private wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=';
  public city: string|null = null;
  public arrowCounter = 0;
  public inProgress = false;
  public selected: null|string = null;

  constructor() {
    super();
  
  }

  mounted() {
    if (localStorage.country) {
      this.country = localStorage.country;
    } 
  }

  public onArrowDown() {
    if (this.arrowCounter < this.results.length) {
      this.arrowCounter++;
    }
  }

  public onArrowUp() {
    if (this.arrowCounter > 0) {
      this.arrowCounter--;
    }
  }

  public onEnterVal() {
    if(this.results.length) {
      this.setCountry((Object.values(this.results[this.arrowCounter]!)));  
    }
    else {
      this.coutrynames.forEach(country=> {
        if(country.name.toLowerCase() === this.country.toLowerCase()) {
          this.setCountry([country.id, country.name]);
        }
      });
    }
  }

  public setCountry(_result: string[]) {
    const country = _result;
    localStorage.country = country[1];
    this.getCities(country[0]);
  }

  public filterCities() {
    this.autocompleteOpen = true;
    this.results = this.coutrynames.filter((countryname) => countryname.name.toLowerCase().indexOf(this.country.toLowerCase()) > -1);
  }

  public avg(_pm25: number[]) {
    const pm25 = _pm25;
    let avg = 0;
    pm25.forEach((value: number) => {
      avg += value;
    });
    return (avg/pm25.length).toFixed(2);
  }

  public scrollTop() {
    this.selected = null;
    this.results = [];
    this.arrowCounter = 0;
    this.city = null;
    this.cities = [];
    this.country = '';
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

   public getCity(_city: string) {
    let city = _city.indexOf('/') > -1 ? _city.slice(0, _city.indexOf('/')) : _city;
    this.inProgress = true;
    this.selected = _city;

    axios.get(`${this.wikiUrl}${encodeURIComponent(city.trim())}`).then((response: AxiosResponse) => {
      const obj = response.data.query.pages;    
      if(obj) {
        this.city = (Object as any).values!(obj)[0].extract;
        this.inProgress = false;
      }
    }).catch((error)=>{ this.inProgress = false; });
  }

  private getCities(_county: string) {  
    const country = _county;

    this.inProgress = true;

    axios.get(`${this.citiesUrl}?country=${country}&limit=2000&parameter=pm25&order_by[]=value&sort=desc`).then((response: AxiosResponse) => {
      const data = response.data.results;
      data.forEach((result: Location, index: number) => {
        if(this.cities!.some(element => element.name === result.city)) {
          
          this.cities.forEach((city, i)=> {
            if(city.name === result.city){
              this.cities[i].pm25.push(result.value);
            }
          });  
        } else {
          this.cities!.push({
            "id": index,
            "name": result.city,
            "pm25": [result.value]
          });
        }
      });
      
      this.cities = this.cities.sort((a, b) => {
        let avg1 = 0;
        let avg2 = 0;

        a.pm25.forEach((value:number) => {
          avg1 += value;
        });
        b.pm25.forEach((value:number) => {
          avg2 += value;
        });
        return ((avg2/b.pm25.length) - (avg1/a.pm25.length));
      }).slice(0,9);
      this.city = null; 
      this.step = 1;
      this.inProgress = false;
    }).catch(
      (error:string) => {
        this.inProgress = false;
      }
    )
  }
}
</script>
