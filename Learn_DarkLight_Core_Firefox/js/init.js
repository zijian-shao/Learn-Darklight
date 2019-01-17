var baseURL, currURL, options, configs;

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


function initDarklight() {

    function init() {

        if (currURL.includes('/content/enforced/'))
            return;
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