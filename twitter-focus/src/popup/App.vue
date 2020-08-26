<template>
   <div>
            <button>{{feed}}</button>
            <br>
            <button>{{panel}}</button>
    </div>
</template>

<script>
const browser = require("webextension-polyfill");
export default {
  data () {
    return {
      feed: 'Activate Feed',
      panel: 'Activate Panel'
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
