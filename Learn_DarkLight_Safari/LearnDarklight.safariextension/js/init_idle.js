var baseURL, currURL, options, configs, themeConfigs;

function initDarklightIdle() {

    function extensionUpdate() {

        var oldVer = options.EXT_Version, newVer;

        console.log('Learn Darklight (V' + oldVer + ')');

        // browser.runtime.sendMessage({action: 'getDetails'}, function (response) {
        //
        //     newVer = response.version;
        //
        //     // update storage
        //     browser.storage.sync.set({
        //         'EXT_Version': newVer
        //     });
        //
        //     // return on install
        //     // if (oldVer == '0.0.0')
        //     //     return;
        //
        //     if (versionCompare(oldVer, newVer) >= 0)
        //         return;
        //
        //     console.log('New version updated (V' + newVer + ')');
        //
        //     if (newVer == '1.1.0') {
        //
        //     } else if (newVer == '1.0.0') {
        //
        //     }
        //
        //     console.log('Extension update script executed!');
        // });
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
    var head = $('head');
    head.find('link[rel="icon"]').remove();
    head.append($('<link rel="icon" type="image/png" href="' + baseURL + 'icon-32.png' + '">'));

    // css
    injectCSS(baseURL + 'css/common.css', 'head');
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');
    if (options.GLB_EnableCustomStyle)
        injectCSS(options.GLB_CustomCSS, 'head', 'text');

    // js
    var jsText = 'var baseURL = "' + baseURL + '";';
    jsText += 'var currURL = "' + window.location.href + '";';
    jsText += 'var options = ' + JSON.stringify(options) + ';';
    jsText += 'var themeConfig = ' + JSON.stringify(themeConfigs) + ';';
    var params = document.createElement("script");
    params.textContent = jsText;
    document.head.appendChild(params);

    // injectJS(baseURL + 'js/functions.js', 'head');
    $.getScript(baseURL + 'js/functions.js', function () {
        injectJS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/functions.js', 'head');
        if (options.GLB_EnableCustomStyle)
            injectJS(options.GLB_CustomJS, 'head', 'text');
    });

    // overlay
    $('.darklight-load-overlay').fadeOut(300, function () {
        $(this).remove();
    });

    // extensionUpdate();
}

$(window).on('load', function () {

    // For safari, only injects into top level frame
    if (window.self !== window.top) {
        // overlay
        $('.darklight-load-overlay').remove();
        return;
    }

    initDarklightIdle();

});