function initTheme() {

    var cssText = '';
    if (!getCustomThemeOption('whiteNavbar')) {
        cssText += '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{border:none!important;background:rgba(0, 0, 0, 0.8)!important;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2)!important;}';
        cssText += '.d2l-navigation-s-shadow-gradient, .d2l-navigation-shadow-gradient' +
            '{background:none!important;}';
        cssText += 'd2l-navigation-main-footer a.d2l-navigation-s-link, d2l-navigation-main-footera.d2l-navigation-s-link:link, d2l-navigation-main-footera.d2l-navigation-s-link:visited' +
            '{color:#aaa!important;}';
        cssText += 'd2l-navigation-main-footer .d2l-navigation-s-item .d2l-navigation-s-group-text, d2l-navigation-main-footer .d2l-navigation-s-item .d2l-icon-0' +
            '{color:#aaa!important;}';
    } else {
        cssText += '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{box-shadow:0 2px 4px rgba(0, 0, 0, 0.03)!important;}';
    }
    chrome.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });


    // course home calendar
    if (currURL.match(/\/d2l\/home\/\d+/)) {
        $('.d2l-widget-header').each(function (i, e) {
            var headText = $(e).text();
            if (headText.match(/Calendar/)) {
                $(e).parents('div.d2l-widget').addClass('darklight-course-home-calendar');
            }
        });
    }
}

initTheme();