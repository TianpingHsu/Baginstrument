
document.addEventListener('DOMContentLoaded', function() {
    console.log("button clicked");
    const button = document.getElementById('view');
    button.addEventListener('click', () => {
        // Open view.html in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('html/view.html') });
    });

    const buttonB = document.getElementById('export');
    buttonB.addEventListener('click', function() {
        // Open view.html in a new tab for export functionality
        chrome.tabs.create({ url: chrome.runtime.getURL('html/view.html') });
    });
});
