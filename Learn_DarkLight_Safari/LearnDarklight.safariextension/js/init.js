var baseURL, currURL, options, configs, themeConfigs;

function injectCSS(src, tag, type) {
    var style;
    if (type === 'text') {
        style = $('<style/>');
        style.text(src);
    } else {
        style = $('<link/>', {
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': src
        });
    }
    style.appendTo($(tag));
}

function injectJS(src, tag, type) {
    var script = $('<script/>', {
        'type': 'text/javascript'
    });
    if (type === 'text') {
        script.text(src);
    } else {
        script.attr('src', src);
    }
    script.appendTo($(tag));
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
        return !!window.chrome && !!window.chrome.webstore;
    else
        return false;
}

function isWLU() {
    return currURL.includes('mylearningspace.wlu.ca');
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

        var cover = document.createElement("div");
        cover.id = 'darklight-load-overlay';
        cover.className = 'darklight-load-overlay';
        cover.style = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background:' + themeConfigs.overlayColor;
        document.documentElement.appendChild(cover);
    }

    if (window.self !== window.top)
        return;

    baseURL = safari.extension.baseURI;
    currURL = window.location.href;
    configs = getOptionListDefault();

    safari.self.addEventListener('message', function (event) {
        if (event.name == 'options') {
            options = event.message;
            init();
        }
    }, false);
    safari.self.tab.dispatchMessage('getOptions');

}

initDarklight();