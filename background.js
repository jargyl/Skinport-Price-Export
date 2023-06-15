// Listen for the click event on the extension icon
chrome.browserAction.onClicked.addListener(function (tab) {
  // Send a message to the content script to extract data
  chrome.tabs.sendMessage(tab.id, { action: "extractData" });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.data) {
    const data = request.data;
    const username = request.username;

    // Create an Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const sheetName = "Skin Data";

    // Set custom column widths
    const columnWidths = [
      { wch: 60 }, // Column B width
      { wch: 20 }, // Column A width
      { wch: 20 }, // Column C width
    ];
    worksheet["!cols"] = columnWidths;

    // Append the modified worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate the Excel file
    const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Get the current date
    const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");

    // Create the filename with the current date and username
    const filename = `${username}_${currentDate}_Skinport_Export.xlsx`;

    // Save the Excel file automatically without prompting for the "Save As" dialog
    const blob = new Blob([excelData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false, // Automatically save the file without prompting
    });
  }
});
