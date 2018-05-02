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

function initDarklight() {

    function init() {
        if (!options.GLB_Enabled)
            return;

        if (currURL.includes('/content/enforced/'))
            return;

        // For safari, only injects into top level frame
        if (window.self !== window.top)
            return;

        themeConfigs = getThemeConfigs(options.GLB_ThemeID);

        var cover = document.createElement("div");
        cover.id = 'darklight-load-overlay';
        cover.className = 'darklight-load-overlay';
        cover.style = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background:' + themeConfigs.overlayColor;
        document.documentElement.appendChild(cover);
    }

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

// initDarklight();