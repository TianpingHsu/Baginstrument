// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")

// function createContextMenu() {
//     chrome.contextMenus.create({
//         id: 'baidu-search',
//         title: '使用度娘搜索：%s',
//         contexts: ['selection']
//     }, () => {
//         if (chrome.runtime.lastError) {
//             console.error(chrome.runtime.lastError);
//         }
//     });
// }

// // Create context menu when the extension is installed or updated
// chrome.runtime.onInstalled.addListener(() => {
//     createContextMenu();
// });

// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     switch(info.menuItemId){
//         case 'baidu-search':
//             chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(info.selectionText)});
//             break;
//     }
// });

// chrome.contextMenus.create({
//     id: 'my_menu_item',
//     title: 'save to pocket',
//     contexts: ['selection']
// });
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === 'my_menu_item') {
//         chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(info.selectionText)});
//     }
// });

chrome.contextMenus.create({
    id: 'foo',
    title: 'save to pocket',
    contexts: ['selection']
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'foo') {
        // Save the selected text to local storage
        chrome.storage.local.get(['savedTexts'], function(result) {
            let savedTexts = result.savedTexts || [];
            savedTexts.push({
                text: info.selectionText,
                date: new Date().toISOString(),
                url: tab.url
            });
            chrome.storage.local.set({ savedTexts: savedTexts }, function() {
                console.log('Text saved:', info.selectionText);
            });
        });
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
	else if(text == '微博') {
		suggest([
			{content: '新浪' + text, description: '新浪' + text},
			{content: '腾讯' + text, description: '腾讯' + text},
			{content: '搜狐' + text, description: '搜索' + text},
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

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.