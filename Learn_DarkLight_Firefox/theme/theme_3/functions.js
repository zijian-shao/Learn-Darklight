function initTheme() {

    // custom options - css
    var cssText = '';
    if (getCustomThemeOption('fullWidthLayout')) {
        cssText += '.d2l-max-width {max-width:none!important}' +
            '.d2l-page-bg{max-width:none!important}' +
            'd2l-navigation-main-header>div.d2l-navigation-centerer{max-width:none!important}' +
            'd2l-navigation-main-footer>div.d2l-navigation-centerer{max-width:none!important}' +
            '.max-width.d2l-simple-overlay{max-width:none!important}' +
            '.d2l-navigation-s-centerer{max-width:none!important}' +
            '.daylight iframe.d2l-navbar-margin{max-width:none!important;width:100%!important;padding:0!important}';
    }
    if (!currURL.match(/quizzing/g)) {
        browser.runtime.sendMessage({
            action: 'insertCSS',
            data: {code: cssText}
        });
    }

    $('d2l-navigation').append('<div class="blue-banner"></div>');

    if (!isWLU()) {

        // logo - white
        var logoImg = $('.d2l-navigation-link-image img');
        logoImg.attr('src', baseURL + 'theme/theme_' + options.GLB_ThemeID + '/logo-waterloo.png');

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('.d2l-navigation-link-image img');
            } else if (!logoImg.attr('src').match(/logo-waterloo\.png/)) {
                logoImg.attr('src', baseURL + 'theme/theme_' + options.GLB_ThemeID + '/logo-waterloo.png');
            } else {
                clearInterval(dlightThemeInterval);
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    } else {

        // for wlu learn
        var logoImg = $('.d2l-navigation-link-image img');
        logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png');

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('.d2l-navigation-link-image img');
            } else if (!logoImg.attr('src').match(/laurier_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png');
            } else {
                clearInterval(dlightThemeInterval);
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    }

}

initTheme();