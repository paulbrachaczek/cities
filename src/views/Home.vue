<template>
  <div class="home">
    <div class="m-input -input-text">
        <label for="country">Where You like to go this weekend?</label>
        <input type="text" name="country"  v-model="country"  id="country">  
      </div>  
      <!-- <Autocomplete :items="citynames"/>   -->
      <button v-on:click.prevent="getCities()">search</button> 
      <ul>
        <li v-for="city in cities" v-bind:key="city.id">
          <span v-on:click.prevent="getCity(city.name)">{{city.name}}</span>
          <p>
            {{avg(city.pm10)}}
          </p>
          <p>
            {{city.pm10}}
          </p>
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
import  Autocomplete from "@/components/Autocomplete.vue";

@Component({
    components: {
       Autocomplete
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

  public cities: (null|any)[] = [];
  private citiesUrl = 'https://api.openaq.org/v1/latest/';
  private wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=';
  public city: string|null = null;

  constructor() {
    super();
  
  }

  mounted() {
    if (localStorage.country) {
      this.country = localStorage.country;
      this.getCities();
    } 
    if (localStorage.city) {
      const city = localStorage.city;
      this.getCity(city);

    } 
  }

  public avg(_pm10: number[]) {
    const pm10 = _pm10;
    let avg = 0;
    pm10.forEach(value => {
      avg += value;
    });
    return (avg/pm10.length).toFixed(2);
  }

  public getCities() {  
    localStorage.country = this.country;
    axios.get(`${this.citiesUrl}?country=${this.country}&limit=250`).then((response: AxiosResponse) => {
      const data = response.data.results;
      //console.log(data.length);
      data.forEach((result: any, index: number) => {
        if(this.cities!.some(element => element.name === result.city)) {
          
          this.cities.forEach((city, i)=> {
           
            if(city.name === result.city){
              result.measurements.forEach((measurement: any)=> {
                
                if(measurement.parameter === "pm10") {
                  this.cities[i].pm10.push(measurement.value);
                }
              });

            }
          });  

          
        } else {
            result.measurements.forEach((measurement: any)=> {
              
              if(measurement.parameter === "pm10") {
                this.cities!.push({
                  "id": index,
                  "name": result.city,
                  "pm10": [measurement.value]
                });
              }
            });        
        }
      });
      //console.log(this.cities);
      this.cities = this.cities.sort((a, b) => {
        let avg1 = 0;
        let avg2 = 0;

        a.pm10.forEach((value:number) => {
          avg1 += value;
        });
        b.pm10.forEach((value:number) => {
          avg2 += value;
        });
        //console.log(avg1/a.pm10.length);
        return ((avg2/b.pm10.length) - (avg1/a.pm10.length));
      }).slice(0,9);
      this.city = null; 
    }).catch(
      (error:string) => {
        
      }
    )
  }

  getCity(_city: string) {
    const city = _city;

    localStorage.city = city;
   // console.log(city);
    axios.get(`${this.wikiUrl}${city}`).then((response: AxiosResponse) => {
      const obj = response.data.query.pages;    
      if(obj) {
        this.city = (Object as any).values!(obj)[0].extract;
      }
    }).catch((error)=>{});
  }
}
</script>
