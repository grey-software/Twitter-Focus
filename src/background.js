// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");
//   });
// });
chrome.browserAction.onClicked.addListener(buttonClicked)

function buttonClicked(tab){
  console.log(tab);
  let msg = {
    txt: "focus"
  }
  chrome.tabs.sendMessage(tab.id, msg)
}



console.log("running background")
