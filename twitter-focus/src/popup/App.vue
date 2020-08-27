<template>
   <div v-if="isTwitter == true">
            <button v-if="isHome == true" v-on:click="changeFeedStatus">{{feedStatus}}</button>
            <br>
            <button v-on:click="changePanelStatus">{{panelStatus}}</button>
    </div>

    <div v-else>
      <h1>This is not a Twitter page</h1>
    </div>
</template>

<script>
const browser = require("webextension-polyfill");
export default {
  data () {
    return {
      feedStatus: 'Activate Feed',
      panelStatus: 'Activate Panel',
      url: "",
      isHome: false,
      isTwitter: false
    }
  },
  created(){
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      this.url = tabs[0].url
      if(this.url.includes("twitter.com")){
        this.isTwitter = true
        if(this.url.includes("/home")){
          this.isHome = true
        }else{
          this.isHome = false
        }
      }else{
        this.isTwitter = false;
      }
    })
  },
  methods: {
    changeFeedStatus(){
      console.log("isTwitter " + this.isTwitter)
      console.log("isHomePage " + this.isHome)
      var msg;

      // put this in a function
      if(this.feedStatus == "Activate Feed"){
        msg = "un-block feed"
        this.feedStatus = "Deactivate Feed"
      }else{
        msg = "block feed"
        this.feedStatus = "Activate Feed"
      }

      this.delieverMessageToContentScript(msg);
    },
    changePanelStatus(){
      var msg;
      if(this.panelStatus == "Activate Panel"){
        msg = "un-block panel"
        this.panelStatus = "Deactivate Panel"
      }else{
        msg = "block panel"
        this.panelStatus = "Activate Panel"
      }
      this.delieverMessageToContentScript(msg)
    },

    delieverMessageToContentScript(msg){
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, {
          msg: {action: msg}
        })
      })
    }
    
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
