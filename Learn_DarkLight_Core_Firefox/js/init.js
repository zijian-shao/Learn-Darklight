var baseURL, currURL, options, configs;

var initReady = false;

function injectCSS(src, tag, type) {

    var style;
    var id = 'darklight-css-' + Math.floor(Math.random() * 90000 + 10000);
    if (type === 'text') {
        style = $('<style/>', {
            id: id
        });
        style.text(src);
    } else {
        style = $('<link/>', {
            id: id,
            rel: 'stylesheet',
            type: 'text/css',
            href: src
        });
    }

    if (typeof tag === typeof {})
        tag.append(style);
    else
        $(tag).append(style);

    return id;
}

function injectJS(src, tag, type) {

    var id = 'darklight-js-' + Math.floor(Math.random() * 90000 + 10000);
    var script = $('<script/>', {
        id: id,
        type: 'text/javascript'
    });

    if (type === 'text') {
        script.text(src);
    } else {
        script.attr('src', src);
    }

    if (typeof tag === typeof {})
        tag.append(script);
    else
        $(tag).append(script);

    return id;
}

function injectCSSShadow(src, tag, type, allDom) {
    tag.each(function () {
        if (this.shadowRoot !== null) {
            injectCSS(src, $(this.shadowRoot), type);
            if (allDom === true) {
                injectCSSShadow(src, $(this.shadowRoot), type, allDom);
            }
        }
    });
    if (allDom === true) {
        tag.children('*').each(function () {
            injectCSSShadow(src, $(this), type, allDom);
        });
    }
}

function injectJSShadow(src, tag, type, allDom) {
    tag.each(function () {
        if (this.shadowRoot !== null) {
            injectJS(src, $(this.shadowRoot), type);
            if (allDom === true) {
                injectJSShadow(src, $(this.shadowRoot), type, allDom);
            }
        }
    });
    if (allDom === true) {
        tag.children('*').each(function () {
            injectJSShadow(src, $(this), type, allDom);
        });
    }
}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    var html = null;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    html.animate({scrollTop: pos - offset}, time);

}


function blockPage(color) {
    if ($('#darklight-block-page').length)
        return;

    var elem = $('<div/>', {
        'id': 'darklight-block-page',
        'class': 'darklight-block-page'
    });

    if (color !== undefined)
        elem.css('background-color', color);


    elem.append($('<div class="darklight-block-page-wrapper"><div class="darklight-block-page-loader"></div><div class="darklight-block-page-message">Loading</div></div>')).hide().appendTo('body').fadeIn(300);

}


function blockPageMsg(msg) {
    $('#darklight-block-page').find('.darklight-block-page-message').text(msg);
}


function unblockPage() {

    $('#darklight-block-page').fadeOut(300, function () {
        $(this).remove();
    });

}


function isOnScreen(element) {

    var html = null;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    if ($.type(element) === 'object')
        return (html.scrollTop() < element.offset().top);
    else if ($.type(element) === 'number')
        return (html.scrollTop() < element);

    return true;
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


function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('Learn Darklight Core (V' + oldVer + ')');

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

        if (newVer == '1.0.0') {

        }

        console.log('Extension update script executed!');
    });
}

/**
 * Compare Versions
 * @param v1
 * @param v2
 * @param opt
 * @returns {*}
 *  0 if the versions are equal
 *  a negative integer iff v1 < v2
 *  a positive integer iff v1 > v2
 * NaN if either version string is in the wrong format
 */
function versionCompare(v1, v2, opt) {
    var lexicographical = opt && opt.lexicographical,
        zeroExtend = opt && opt.zeroExtend,
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

        if (currURL.includes('/content/enforced/'))
            return;

        var cover = document.createElement("div");
        cover.id = 'darklight-load-overlay';
        cover.className = 'darklight-load-overlay';
        cover.style.background = '#111';
        document.documentElement.appendChild(cover);

        extensionUpdate();

        initReady = true;
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();

    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });

}

initDarklight();