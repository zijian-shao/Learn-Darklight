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

    $('body').animate({scrollTop: pos - offset}, time);

}

function blockPage(color) {

    var elem = $('<div/>', {
        'id': 'darklight-block-page',
        'class': 'darklight-block-page'
    });

    if (color !== undefined)
        elem.css('background-color', color);

    elem.append($('<i class="fa fa-spinner fa-spin fa-3x"></i>')).hide().appendTo('body').fadeIn(300);

}

function unblockPage() {

    $('#darklight-block-page').fadeOut(300, function () {
        $(this).remove();
    });

}

function isOnScreen(element) {

    if ($.type(element) === 'object')
        return ($('body').scrollTop() < element.offset().top);
    else if ($.type(element) === 'number')
        return ($('body').scrollTop() < element);

    return true;
}

function addBackToTopButton() {
    function _addBackToTopButton() {
        if ($(window).scrollTop() < 100)
            $('#darklight-back-to-top').addClass('darklight-back-to-top-hidden').delay(200);
        else
            $('#darklight-back-to-top').removeClass('darklight-back-to-top-hidden');
    }

    $('<div class="darklight-back-to-top darklight-back-to-top-hidden" id="darklight-back-to-top"><i class="arrow up"></i></div>').on('click', function (e) {
        e.preventDefault();
        scrollToUtil(0, 400);
    }).appendTo('body');

    _addBackToTopButton();
    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function fixNavigation() {
    function _fixNavigation() {

        if ($(window).width() < 768)
            return;

        if ($('body').scrollTop() < offset) {
            // is on screen
            nav.removeClass('darklight-navbar-fixed');
            header.css('margin-bottom', '0px');
        } else {
            // not on screen
            nav.addClass('darklight-navbar-fixed');
            header.css('margin-bottom', navHeight + 'px');
        }
    }

    var nav = $('.d2l-navigation-s-main');
    var navHeight = nav.height();
    var header = $('.d2l-navigation-s-header');
    var offset = header.height();

    _fixNavigation();
    $(window).on('scroll', function () {
        _fixNavigation();
    });

    $(window).on('resize', function () {
        if ($(window).width() < 768) {
            header.css('margin-bottom', '0px');
        } else {
            navHeight = nav.height();
            offset = header.height();
            _fixNavigation();
        }
    });
}

function isWLU() {
    return currURL.includes('mylearningspace.wlu.ca');
}

function init() {

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    // fix navigation
    if (options.GLB_FixNavigation) {
        fixNavigation();
    }

    if (currURL.match(/\/d2l\/home/gi)) {
        $('.d2l-homepage-header-wrapper').each(function (i, e) {
            var headText = $(e).text();
            if (headText.match(/SYSTEM ALERT/gi)) {
                if (options.GLB_AutoHideSysAlert) {
                    // remove sys alert if empty
                    var alertHtml = $(e).parent('div.d2l-widget-header').next('div.d2l-widget-content').children('div.d2l-htmlblock').first();
                    var _alertHtml = alertHtml.clone();
                    _alertHtml.find('a').remove();
                    _alertHtml.find('script').remove();
                    if (_alertHtml.text().trim() == '') {
                        $(e).parents('div.d2l-widget').remove();
                    }
                }
            } else if (headText.match(/Check My System/gi)) {
                if (options.GLB_HideCheckMySys) {
                    $(e).parents('div.d2l-widget').remove();
                }
            }

        });
    }

    $('.darklight-load-overlay').delay(400).fadeOut(400, function () {
        $(this).remove();
    });

}

init();
