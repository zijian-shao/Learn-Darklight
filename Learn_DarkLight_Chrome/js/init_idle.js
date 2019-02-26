function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('Learn Darklight (V' + oldVer + ')');

    chrome.runtime.sendMessage({action: 'getDetails'}, function (response) {

        newVer = response.version;

        // update storage
        chrome.storage.sync.set({
            'EXT_Version': newVer
        });

        // return on install
        if (oldVer == '0.0.0')
            return;

        if (versionCompare(oldVer, newVer) >= 0)
            return;

        console.log('New version updated (V' + newVer + ')');

        if (newVer.match(/2\.0\./) && !oldVer.match(/2\.0\./)) {
            chrome.runtime.sendMessage({
                action: 'createTab',
                data: {url: chrome.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
            });
        }
        console.log('Extension update script executed!');
    });
}

/**
 * Compare Versions
 * @param v1
 * @param v2
 * @param options
 * @returns {*}
 *  0 if the versions are equal
 *  a negative integer iff v1 < v2
 *  a positive integer iff v1 > v2
 * NaN if either version string is in the wrong format
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

function initDarklightIdle() {

    if (!options.GLB_Enabled)
        return;

    // disable on Waterloo Learn
    if (!options.GLB_EnableForWaterloo && !isWLU())
        return;

    // disable on Laurier MLS
    if (!options.GLB_EnableForLaurier && isWLU())
        return;

    if (currURL.includes('/content/enforced/'))
        return;

    // favicon
    if (options.GLB_DarklightFavicon) {
        var icon = $('head').find('link[rel="icon"]');
        icon.attr({
            type: 'image/png',
            href: baseURL + 'icon/icon48.png'
        });
        setTimeout(function () {
            if (!icon.length) {
                icon.attr({
                    type: 'image/png',
                    href: baseURL + 'icon/icon48.png'
                });
            }
        }, 2000);
    }

    // css
    injectCSS('html{font-size:' + options.GLB_BasicFontSize + 'px}', 'head', 'text');
    injectCSS(baseURL + 'css/common.css', 'head');
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');
    if (options.GLB_EnableCustomStyle)
        injectCSS(options.GLB_CustomCSS, 'head', 'text');

    // js
    var jsText = 'var dlightData = {';
    jsText += 'baseURL : "' + baseURL + '",';
    jsText += 'currURL : "' + currURL + '",';
    jsText += 'currURL2 : "' + currURL2 + '",';
    jsText += 'currURLHost : "' + currURLHost + '",';
    jsText += 'options : ' + JSON.stringify(options) + ',';
    jsText += 'themeConfigs : ' + JSON.stringify(themeConfigs) + '';
    jsText += '}';
    var params = document.createElement("script");
    params.textContent = jsText;
    document.head.appendChild(params);

    injectJS(baseURL + 'js/functions_inject.js', 'head');

    // theme js
    var scriptArr = [];
    scriptArr.push({
        file: 'theme/theme_' + options.GLB_ThemeID + '/functions.js'
    });
    if (options.GLB_EnableCustomStyle) {
        scriptArr.push({
            code: options.GLB_CustomJS
        });
    }
    chrome.runtime.sendMessage({
        action: 'executeScript',
        data: scriptArr
    });

    extensionUpdate();

    initDarklightFunc();
}

if (initReady) {
    initDarklightIdle();
} else {
    var initIntvCnt = 0;
    var initIntv = setInterval(function () {
        if (initReady) {
            initDarklightIdle();
            clearInterval(initIntv);
        } else {
            initIntvCnt++;
            if (initIntvCnt > 50) {
                $('#darklight-load-overlay').remove();
                clearInterval(initIntv);
            }
        }
    }, 100);
}
