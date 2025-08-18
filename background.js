import config from './config.js';
import log from './log.js';

const mainLoop = async () => {
    let cphResponse;
    try {
        const headers = new Headers();
        headers.append('cph-submit', 'true');
        const request = new Request(config.cphServerEndpoint.href, {
            method: 'GET',
            headers,
        });
        cphResponse = await fetch(request);
    } catch(e) {
        log('Error: ', e);
        return;
    }

    if (!cphResponse.ok) {
        log("Error while fetching CPH: ", cphResponse.status, cphResponse);
        return;
    }

    const response = await cphResponse.json();
    if (response.empty) return;

    const submitUrl = response.url.replace('/problem/', '/submit/');

    // Check if any codeforces.com tab is open
    chrome.tabs.query({ url: '*://codeforces.com/*' }, async (tabs) => {
        let tab;
        if (tabs.length > 0) {
            tab = tabs[0];
            await chrome.tabs.update(tab.id, { url: submitUrl });
        } else {
            tab = await chrome.tabs.create({ url: submitUrl });
        }

        // Wait for the tab to complete loading
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.tabs.sendMessage(tab.id, {
                    type: 'cph-submit-plus',
                    payload: {
                        sourceCode: response.sourceCode,
                        languageId: response.languageId
                    }
                });
            }
        });
    });
}

setInterval(mainLoop, config.loopTimeOut);
