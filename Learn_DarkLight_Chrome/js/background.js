/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        // chrome.tabs.create({
        //     'url': chrome.extension.getURL('/html/welcome.html')
        // });
        chrome.runtime.openOptionsPage();
    }
}

/**
 * Update option
 * @param oldVer
 * @param newVer
 */
function updateOptions(oldVer, newVer) {

    // update storage
    chrome.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

/**
 * Toolbar context menu
 * @param id
 * @param title
 * @param contexts
 * @param onClick
 */
function createContextMenu(id, title, contexts, onClick) {

    chrome.contextMenus.remove(id, function () {
        chrome.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId == id) {
            if (typeof onClick === 'function')
                onClick();
        }
    });
}

function initBackground() {
    /**
     * Background Started
     */
    console.log('Welcome to Learn Darklight!');
    chrome.runtime.onInstalled.addListener(installWelcome);

    var version = getOptionVersion();
    var configs = getOptionListDefault();
    var options;

    /**
     * Check data updates
     */
    chrome.storage.sync.get(configs, function (items) {
        options = items;

        // option version
        if (options.OPT_Version < version)
            updateOptions(options.OPT_Version, version);

        // extension version
        // if (versionCompare(options.EXT_Version, chrome.app.getDetails().version) < 0)
        //     extensionUpdated(options.EXT_Version, chrome.app.getDetails().version);

    });

    /**
     * Chrome API Calls From Content Scripts
     */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}
        var obj = {};

        // execute script
        if (request.action == 'executeScript') {

            if (Array.isArray(request.data)) {
                for (var i = 0; i < request.data.length; i++) {
                    obj[request.data[i].type] = request.data[i].content;
                }
            } else {
                obj[request.data.type] = request.data.content;
            }

            chrome.tabs.executeScript(sender.tab.id, obj);

        }

        // inject css
        else if (request.action == 'insertCSS') {

            obj[request.data.type] = request.data.content;
            chrome.tabs.insertCSS(sender.tab.id, obj);

        }

        // app.getDetails
        else if (request.action == 'getDetails') {
            obj = chrome.app.getDetails();
        }

        if (typeof sendResponse === 'function') {
            // var response = {'status': 1};
            sendResponse(obj);
        }

    });

    /**
     * Add toolbar context menu
     */
    createContextMenu('dlight-website', 'Official Website', ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.zijianshao.com/dlight/'
        });
    });
    createContextMenu('dlight-contribute', 'Donate', ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.paypal.me/zjshao'
        });
    });
    createContextMenu('dlight-github', 'GitHub', ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://github.com/SssWind/Learn-Darklight'
        });
    });
}

initBackground();
