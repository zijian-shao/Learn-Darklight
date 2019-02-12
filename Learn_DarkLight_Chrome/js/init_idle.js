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

        if (newVer.match(/1\.7\./) && !oldVer.match(/1\.7\./)) {
            chrome.runtime.sendMessage({
                action: 'createTab',
                data: {url: chrome.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
            });
        } else if (newVer.match(/1\.5\./) && !oldVer.match(/1\.5\./)) {
            chrome.runtime.sendMessage({
                action: 'createTab',
                data: {url: chrome.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
            });
        } else if (newVer == '1.1.3') {
            // chrome.runtime.sendMessage({
            //     action: 'createTab',
            //     data: {url: 'https://www.zijianshao.com/dlight/whatsnew/?version=1.1.0&platform=chrome'}
            // });
        } else if (newVer == '1.0.0') {

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
        var head = $('head');
        head.find('link[rel="icon"]').remove();
        head.append($('<link rel="icon" type="image/png" href="' + baseURL + 'icon/icon32.png' + '">'));
    }

    // css
    if (options.GLB_UseSmallerFonts)
        injectCSS('html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend {font-size: 100%;}', 'head', 'text');
    injectCSS(baseURL + 'css/common.css', 'head');
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');
    if (options.GLB_EnableCustomStyle)
        injectCSS(options.GLB_CustomCSS, 'head', 'text');

    // js
    var jsText = 'var baseURL = "' + baseURL + '";';
    jsText += 'var currURL = "' + currURL + '";';
    jsText += 'var currURL2 = "' + currURL2 + '";';
    jsText += 'var currURLHost = "' + currURLHost + '";';
    jsText += 'var options = ' + JSON.stringify(options) + ';';
    jsText += 'var themeConfigs = ' + JSON.stringify(themeConfigs) + ';';
    var params = document.createElement("script");
    params.textContent = jsText;
    document.head.appendChild(params);

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

    // theme options
    var tConf = themeConfigs['options'];
    var tConfObj = {};
    for (var i in tConf)
        tConfObj['THEME_ID_' + options.GLB_ThemeID + '_OPT_' + tConf[i]['key']] = tConf[i]['value'];

    chrome.storage.sync.get(tConfObj, function (e) {
        themeCustomConfigs = e;
        chrome.runtime.sendMessage({
            action: 'executeScript',
            data: scriptArr
        });
    });

    extensionUpdate();

    initDarklightFunc();
}

initDarklightIdle();
