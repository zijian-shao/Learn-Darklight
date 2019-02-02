var baseURL, currURL, currURL2, currURLHost, options, configs, themeConfigs, themeCustomConfigs;

function injectCSS(url, tag, type) {

    var style;

    if (type === 'text') {

        style = $('<style/>');

        style.text(url);

    } else {

        style = $('<link/>', {
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': url
        });

    }

    $(tag).append(style);

}

function injectJS(url, tag, type) {

    var script = $('<script/>', {
        'type': 'text/javascript'
    });

    if (type === 'text') {
        script.text(url);
    } else {
        script.attr('src', url);
    }

    $(tag).append(script);

}

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
    // return !!window.chrome && !!window.chrome.webstore;
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

        if (themeConfigs.overlayColor !== 'none') {
            var cover = document.createElement("div");
            cover.id = 'darklight-load-overlay';
            cover.style = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background:' + themeConfigs.overlayColor;
            document.documentElement.appendChild(cover);
        }

        // course thumbs
        if (options.COURSE_CustomThumb) {
            if (currURL2.match(/\/d2l\/home$/) || currURL2.match(/\/d2l\/home\/\d+$/)) {

                var act = '';
                if (currURL2.match(/\/d2l\/home$/))
                    act = 'getCourseThumbsResponse';
                else
                    act = 'getCourseThumbsOneResponse';

                browser.runtime.onMessage.addListener(
                    function (request, sender, sendResponse) {

                        if (request.action == act) {
                            var style = '';
                            request.data.forEach(function (item, index) {
                                style += '.darklight-course-thumb-' + item.course_id + ' {';
                                style += 'background-image: url("' + item.thumb_image + '");';
                                style += '}';
                                style += '.darklight-course-thumb-' + item.course_id + ' img {';
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
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    currURL2 = window.location.href.split('#')[0].split('?')[0];
    currURLHost = window.location.protocol + '//' + window.location.hostname;
    configs = getOptionListDefault();

    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });

}

initDarklight();