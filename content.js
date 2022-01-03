let idx = 0;
let lastScrollTop = 0;

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

function onUrlChange() {
  idx = 0;
}
const sendImagesForDetection = () => {
  const nl = document.querySelectorAll("img");
  const imageUrls = [];
  for (let i = idx; i < nl.length; i++) {
    imageUrls.push(nl[i].getAttribute("src"));
  }
  idx = nl.length;
  if (imageUrls.length > 0) {
    chrome.runtime.sendMessage({
      todo: "checkImages",
      images: imageUrls,
    });
  }
};
const handleScroll = () => {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  if (st > lastScrollTop) {
    console.log("scrolled");
    sendImagesForDetection();
  }
  lastScrollTop = st <= 0 ? 0 : st;
};

chrome.runtime.sendMessage({ todo: "showPageAction" });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.todo == "blurImage") {
    console.log("mil gaya blur");
    const results = request.images;
    if (results) {
      for (let i = 0; i < results.length; i++) {
        const img = results[i];
        console.log(img);
        const main = document.querySelector(`img[src='${img}']`);
        console.log(main);
        main.classList.add("blur");
      }
    }
  } else if (request.todo === "addFilter") {
    idx = 0;
    sendImagesForDetection();
    window.addEventListener("scroll", handleScroll);
  } else if (request.todo === "removeFilter") {
    const nl = document.querySelectorAll("img");
    for (let i = 0; i < nl.length; i++) {
      if (nl[i].classList.contains("blur")) {
        nl[i].classList.remove("blur");
      }
    }
    window.removeEventListener("scroll", handleScroll);
  }
  return true;
});

window.addEventListener("scroll", handleScroll);
