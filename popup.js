// let x = 0;
// document.querySelector("#lol").onclick = () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { todo: "krdo", change: x });
//   });
// };

const checkbox = document.querySelector("input");
window.onload = () => {
  chrome.storage.sync.get("isChecked", (x) => {
    const { isChecked } = x;
    console.log(isChecked, typeof isChecked);
    if (!x) {
      chrome.storage.sync.set({ isChecked: true });
      checkbox.checked = true;
    } else {
      checkbox.checked = isChecked;
    }
  });
};
checkbox.onchange = () => {
  chrome.storage.sync.set({ isChecked: checkbox.checked });
  if (checkbox.checked) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { todo: "addFilter" });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { todo: "removeFilter" });
    });
  }
};
