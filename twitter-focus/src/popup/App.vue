<template>
   <div v-if="isTwitter == true">
            <button v-if="isHome == true" v-on:click="changeFeedAction">{{feedAction}}</button>
            <br>
            <button v-on:click="changePanelAction">{{panelAction}}</button>
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
      feedAction: 'Activate Feed',
      panelAction: 'Activate Panel',
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

    

    const feedActionInStorage = this.getFeedAction();
    const panelActionInStorage = this.getPanelAction();


    if(feedActionInStorage === undefined){
      console.log("Feed storage is undefined");
      this.storeFeedAction(this.feedAction)
    }else{
      this.feedAction = feedActionInStorage;
    }


    if(panelActionInStorage === undefined){
      console.log("Panel storage is undefined");
      this.storePanelAction(this.panelAction)
    }else{
      this.panelAction = panelActionInStorage;
    }

    chrome.storage.local.clear();
    

  },

  methods: {
    changeFeedAction(){
      var msg;
      if(this.feedAction == "Activate Feed"){
        msg = "un-block feed"
        this.feedAction = "Deactivate Feed"
      }else{
        msg = "block feed"
        this.feedAction = "Activate Feed"
      }
      //set in local storage here
      this.storeFeedAction(this.feedAction);
      this.delieverMessageToContentScript(msg);

    },
    changePanelAction(){
      var msg;
      if(this.panelAction == "Activate Panel"){
        msg = "un-block panel"
        this.panelAction = "Deactivate Panel"
      }else{
        msg = "block panel"
        this.panelAction = "Activate Panel"
      }
      //set in local storage here
      this.storePanelAction(this.panelAction);

      this.delieverMessageToContentScript(msg)
    },

    delieverMessageToContentScript(msg){
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, {
          msg: {action: msg}
        })
      })
    },

    storeFeedAction(feedAction){
      chrome.storage.local.set({"feedAction": feedAction}, function() {
          console.log('Value is set to ' + feedAction);
      });
      
      this.getFeedAction();
    },

    storePanelAction(panelAction){
      chrome.storage.local.set({"panelAction": panelAction}, function() {
          console.log('Value is set to ' + panelAction);
        });

      this.getPanelAction();
    },

    getFeedAction(){
      var feedAction = "";
      chrome.storage.local.get(['feedAction'], function(result) {
          console.log('Value of feedAction currently is ' + result.feedAction);
          feedAction =  result.feedAction
          // console.log("Bool of panel Action is " + bool);
          // console.log("Feed action is " + feedAction);

          var bool = feedAction === undefined
          console.log("Bool of feed Action is " + bool);
          console.log("Feed action is " + feedAction);
          return feedAction;
      })
      // var bool = feedAction === undefined
      // console.log("Bool of feed Action is " + bool);
      // console.log("Feed action is " + feedAction);
      // return feedAction;
    },

    getPanelAction(){
      var panelAction = "";
      chrome.storage.local.get(['panelAction'], function(result) {
          console.log('Value of panelAction currently is ' + result.panelAction);
          panelAction = result.panelAction
          // var bool = panelAction === undefined
          // console.log("Bool of panel Action is " + bool);
          // console.log("Panel action is " + panelAction);

          var bool = panelAction === undefined
          console.log("Bool of panel Action is " + bool);
          console.log("Panel action is " + panelAction);
          return panelAction
      })
      // var bool = panelAction === undefined
      // console.log("Bool of panel Action is " + bool);
      // console.log("Panel action is " + panelAction);
      // return panelAction
    }

    
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
