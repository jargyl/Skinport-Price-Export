// Function to extract the data from a single skin element
function extractSkinData(skinElement) {
  const name = skinElement
    .querySelector(".ItemPreview-href")
    .textContent.trim();
  const wear = skinElement.querySelector(".WearBar-value").textContent;
  const price = skinElement.querySelector(
    ".ItemPreview-priceValue"
  ).textContent;

  return { name, wear, price };
}

// Function to extract data from all skin elements on the page
function extractAllSkinData() {
  const skinElements = document.querySelectorAll(".InventoryPage-item");

  const skinData = Array.from(skinElements).map((skinElement) =>
    extractSkinData(skinElement)
  );

  return skinData;
}

// Function to extract the alt value from the User-avatar element
function extractUsername() {
  const userAvatar = document.querySelector(".User-avatar");
  if (userAvatar) {
    const alt = userAvatar.querySelector("img").alt;
    return alt;
  }
  return null;
}

// Send a message to the background script when the extension icon is clicked
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "extractData") {
    const skinData = extractAllSkinData();
    const username = extractUsername();

    // Send the extracted data and username to the background script
    chrome.runtime.sendMessage({ data: skinData, username: username });
  }
});
