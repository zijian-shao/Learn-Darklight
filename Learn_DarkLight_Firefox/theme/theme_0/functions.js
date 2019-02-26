function initTheme() {

    var cssText = '';
    var primColor = getCustomThemeOption('navPrimaryColor');
    // navbar logo top border
    cssText += '.d2l-navigation-link:hover .d2l-navigation-link-top-border.d2l-navigation-link, .d2l-navigation-link:focus .d2l-navigation-link-top-border.d2l-navigation-link' +
        '{background:' + primColor + '!important}';
    // navbar right icons top border
    cssText += '.d2l-navigation-button:hover .d2l-navigation-button-top-border.d2l-navigation-button, .d2l-navigation-button:focus .d2l-navigation-button-top-border.d2l-navigation-button' +
        '{background:' + primColor + '!important}';
    // navbar right icons
    cssText += '.d2l-navigation-button:hover, .d2l-navigation-button:focus, .d2l-navigation-button:hover > *, .d2l-navigation-button:focus > *, .d2l-navigation-button:hover > * *, .d2l-navigation-button:focus > * *' +
        '{color:' + primColor + '!important}';
    // navbar line
    cssText += '.d2l-navigation-s-header, d2l-navigation-header, d2l-navigation-main-header' +
        '{border-bottom-color:' + primColor + '!important}';
    // navbar logo icon
    cssText += '.d2l-navigation-s-highlight-bar{background:' + primColor + '!important}';
    cssText += '.d2l-navigation-s-button-highlight:focus d2l-icon, .d2l-navigation-s-button-highlight:hover d2l-icon, button.d2l-navigation-s-button-highlight:focus, button.d2l-navigation-s-button-highlight:hover' +
        '{color:' + primColor + '!important;}';
    if (getCustomThemeOption('fullWidthLayout')) {
        $('body').addClass('darklight-fullwidth');
    }
    browser.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });

    if (!isWLU()) {

        // bg - waterloo
        if (currURL.match(/quizzing/g) || currURL.match(/survey/g) || currURL.match(/\/admin\//g) || !getCustomThemeOption('showWaterlooLogo')) {
            // quiz & survey
            browser.runtime.sendMessage({
                action: 'insertCSS',
                data: {code: '.d2l-page-bg > div, .d2l-page-main, .d2l-max-width, .d2l-min-width{min-height:0!important;}'}
            });
        } else {
            $('body').prepend('<div class="darklight-waterloo-side-logo"></div>');
        }

        // logo - white
        var logoImg = $('.d2l-navigation-link-image img');
        logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png');

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('.d2l-navigation-link-image img');
            } else if (!logoImg.attr('src').match(/waterloo_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png');
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
