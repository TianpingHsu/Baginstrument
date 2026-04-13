// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

chrome.contextMenus.create({
    id: 'pocket',
    title: 'save to pocket',
    contexts: ['selection']
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'pocket') {
        saveToStorage(info.selectionText, tab.url);
    }
});

// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	console.log('inputChanged: ' + text);
	if(!text) return;
	if(text == '美女') {
		suggest([
			{content: '中国' + text, description: '你要找“中国美女”吗？'},
			{content: '日本' + text, description: '你要找“日本美女”吗？'},
			{content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？'},
			{content: '韩国' + text, description: '你要找“韩国美女”吗？'}
		]);
	}
	else {
		suggest([
			{content: '百度搜索 ' + text, description: '百度搜索 ' + text},
			{content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
		]);
	}
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('inputEntered: ' + text);
	if(!text) return;
	var href = '';
    if(text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
	else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
	else if(text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
	else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
	openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, {url: url});
	})
}

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
    if (command === "save-it-into-pocket") {
        getCurrentTabId(tabId => {
            // Inject script to get selected text
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    func: () => {
                        const selection = window.getSelection();
                        return selection ? selection.toString() : '';
                    }
                },
                (results) => {
                    if (results && results[0] && results[0].result) {
                        const selectedText = results[0].result;
                        if (selectedText) {
                            chrome.tabs.get(tabId, (tab) => {
                                saveToStorage(selectedText, tab.url);
                            });
                        }
                    }
                }
            );
        });
    }
});

function saveToStorage(text, url) {
    chrome.storage.local.get(['savedTexts'], function(result) {
        let savedTexts = result.savedTexts || [];
        savedTexts.push({
            text: text,
            date: new Date().toISOString(),
            url: url
        });
        chrome.storage.local.set({ savedTexts: savedTexts }, function() {
            console.log('Text saved:', text);
            // Show notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'logo/logo-48.png',
                title: 'Saved!',
                message: text.length > 50 ? text.substring(0, 50) + '...' : text
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "view") {
            // Return all saved texts
            chrome.storage.local.get(['savedTexts'], function(result) {
                sendResponse({ data: result.savedTexts || [] });
            });
            return true; // Keep channel open for async response
        } else if (request.action === "export") {
            // Return all saved texts for export
            chrome.storage.local.get(['savedTexts'], function(result) {
                sendResponse({ data: result.savedTexts || [] });
            });
            return true;
        } else if (request.action === "deleteItem") {
            // Delete a specific item
            chrome.storage.local.get(['savedTexts'], function(result) {
                let savedTexts = result.savedTexts || [];
                savedTexts.splice(request.index, 1);
                chrome.storage.local.set({ savedTexts }, function() {
                    sendResponse({ success: true });
                });
            });
            return true;
        } else if (request.action === "deleteAll") {
            // Delete all items
            chrome.storage.local.set({ savedTexts: [] }, function() {
                sendResponse({ success: true });
            });
            return true;
        }
    }
);

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.