chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(details);
  },
  { urls: ["http://localhost:5500/devices/*"] }
);
