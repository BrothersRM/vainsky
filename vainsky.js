// ==UserScript==
// @name         vainsky
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  filter out self-reposts on bsky.social
// @author       ryan
// @match        https://bsky.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        none
// ==/UserScript==

(function() {
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;
  let response = await originalFetch(resource, config);
  if(!resource.startsWith("https://bsky.social/xrpc/app.bsky.feed.getTimeline")) {
    return response
  }
  var respData = await response.clone().json()
  var filtered = respData.feed.filter(x => x.post.author.did !== x.reason?.by.did)

  // response interceptor/
  const json = () => filtered;
  response.json = json;
  return response;
};
})();
