chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.todo == "showPageAction") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.pageAction.show(tabs[0].id);
    });
  } else if (request.todo === "checkImages") {
    console.log("Check request recieved", request.images);
    const images = request.images;
    fetch("http://localhost:4000/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: images }),
    })
      .then((resp) => resp.json())
      .then((respJson) => {
        console.log(respJson);
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              todo: "blurImage",
              images: respJson.result,
            });
          }
        );
      });
  }
  return true;
});
