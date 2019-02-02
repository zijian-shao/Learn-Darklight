function initTheme() {

    if (!getCustomThemeOption('whiteNavbar')) {
        var cssText = '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{border: none !important; background: rgba(0, 0, 0, 0.8) !important; -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);}';
        cssText += '.d2l-navigation-s-shadow-gradient, .d2l-navigation-shadow-gradient' +
            '{background: none !important;}';
        cssText += 'd2l-navigation-main-footer a.d2l-navigation-s-link, d2l-navigation-main-footera.d2l-navigation-s-link:link, d2l-navigation-main-footera.d2l-navigation-s-link:visited' +
            '{color: #aaa !important;}';
        cssText += 'd2l-navigation-main-footer .d2l-navigation-s-item .d2l-navigation-s-group-text, d2l-navigation-main-footer .d2l-navigation-s-item .d2l-icon-0' +
            '{color: #aaa !important;}';
        injectCSS(cssText, 'body', 'text');
    } else {
        var cssText = '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03); -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);}';
        injectCSS(cssText, 'body', 'text');
    }

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