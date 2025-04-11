
document.addEventListener('DOMContentLoaded', function() {
    console.log("button clicked");
    const button = document.getElementById('view');
    button.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: "view"}, function(response) {
            console.log(response.farewell);
        });
    });

    const buttonB = document.getElementById('export');
    buttonB.addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "export"}, function(response) {
            console.log(response.farewell);
        });
    });
});
