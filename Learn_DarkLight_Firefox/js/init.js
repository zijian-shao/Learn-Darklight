var baseURL, currURL, currURL2, currURLHost, options, configs, themeConfigs, thumbData;

var initReady = false;

function isBrowser(name) {
    name = name.toLowerCase();
    if (name == 'opera')
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    else if (name == 'firefox')
        return typeof InstallTrigger !== 'undefined';
    else if (name == 'safari')
        return /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    else if (name == 'ie')
        return /*@cc_on!@*/false || !!document.documentMode;
    else if (name == 'edge')
        return !isIE && !!window.StyleMedia;
    else if (name == 'chrome')
        return /chrome/.test(navigator.userAgent.toLowerCase());
    else
        return false;
}

function isWLU() {
    if (typeof isWLU.isWLUBool === typeof undefined) {
        isWLU.isWLUBool = currURL.includes('mylearningspace.wlu.ca');
    }
    return isWLU.isWLUBool;
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1)
        hostname = url.split('/')[2];
    else
        hostname = url.split('/')[0];
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function getCustomThemeOption(name) {
    return options['THEME_ID_' + options.GLB_ThemeID + '_OPT_' + name];
}


function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('Learn Darklight (V' + oldVer + ')');

    browser.runtime.sendMessage({action: 'getDetails'}, function (response) {

        newVer = response.version;

        // update storage
        browser.storage.sync.set({
            'EXT_Version': newVer
        });

        // return on install
        if (oldVer == '0.0.0')
            return;

        if (versionCompare(oldVer, newVer) >= 0)
            return;

        console.log('New version updated (V' + newVer + ')');

        if (newVer.match(/2\.0\./) && !oldVer.match(/2\.0\./)) {
            browser.runtime.sendMessage({
                action: 'createTab',
                data: {url: browser.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
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
        } else if (v1parts[i] > v2parts[i]) {
            return 1;
        } else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

function initDarklight() {

    function init() {
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

        themeConfigs = getThemeConfigs(options.GLB_ThemeID);

        if (options['THEME_ID_' + options.GLB_ThemeID + '_OPT_overrideOverlayColor'] !== undefined)
            themeConfigs.overlayColor = options['THEME_ID_' + options.GLB_ThemeID + '_OPT_overrideOverlayColor'];

        if (themeConfigs.overlayColor !== 'none') {
            var cover = document.createElement("div");
            cover.id = 'darklight-load-overlay';
            cover.className = 'darklight-load-overlay';
            cover.style.background = themeConfigs.overlayColor;
            document.documentElement.appendChild(cover);
        }

        // css
        browser.runtime.sendMessage({
            action: 'insertCSS',
            data: [
                {code: 'html{font-size:' + options.GLB_BasicFontSize + 'px!important}'},
                {file: 'css/common.css'}
            ]
        });

        // course thumbs
        if (options.COURSE_CustomThumb && !isWLU()) {
            if (currURL2.match(/\/d2l\/home$/) || currURL2.match(/\/d2l\/home\/\d+$/)) {

                var act = '', extraSel = '';
                if (currURL2.match(/\/d2l\/home$/)) {
                    act = 'getCourseThumbsResponse';
                    extraSel = ' d2l-course-image';
                } else {
                    act = 'getCourseThumbsOneResponse';
                    extraSel = '';
                }

                browser.runtime.onMessage.addListener(
                    function (request, sender, sendResponse) {
                        if (request.action === 'getCourseThumbsResponse') {
                            thumbData = request;
                        } else if (request.action === 'getCourseThumbsOneResponse') {
                            var style = '';
                            request.data.forEach(function (item, index) {
                                style += '.darklight-course-thumb-' + item.course_id + extraSel + ' {';
                                style += 'background-image: url("' + item.thumb_image + '");';
                                style += '}';
                                style += '.darklight-course-thumb-' + item.course_id + extraSel + ' img {';
                                style += 'opacity: 0 !important;';
                                style += '}';
                            });
                            var styleElem = document.createElement("style");
                            styleElem.innerText = style;
                            styleElem.id = 'darklight-course-thumbs';
                            document.documentElement.appendChild(styleElem);
                        }
                    }
                );

                if (currURL2.match(/\/d2l\/home$/)) {
                    browser.runtime.sendMessage({action: 'getCourseThumbs'});
                } else {
                    var courseID = currURL2.match(/\/d2l\/home\/\d+$/)[0].split('/')[3];
                    browser.runtime.sendMessage({
                        action: 'getCourseThumbsOne',
                        data: {
                            course_id: courseID
                        }
                    });
                }

            }
        }

        extensionUpdate();

        initReady = true;
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    currURL2 = window.location.href.split('#')[0].split('?')[0];
    currURLHost = window.location.protocol + '//' + window.location.hostname;
    configs = getOptionListDefault();

    // add theme options
    var fullThemeConf = getThemeConfigs();
    for (var key in fullThemeConf) {
        if (Array.isArray(fullThemeConf[key].options)) {
            fullThemeConf[key].options.forEach(function (ob) {
                configs['THEME_ID_' + fullThemeConf[key].id + '_OPT_' + ob.key] = ob.value;
            });
        }
    }

    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });

}

initDarklight();