<template>
  <div class="a-loader">
      <div class="lds-ripple"><div></div><div></div></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';


@Component({
    components: {
    }
})
export default class Loader extends Vue {
}
</script>
