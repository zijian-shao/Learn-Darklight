function initTheme() {

    // custom options - css
    // var cssText = '';
    if (getCustomThemeOption('fullWidthLayout')) {
        $('body').addClass('darklight-fullwidth');
    }
    // chrome.runtime.sendMessage({
    //     action: 'insertCSS',
    //     data: {code: cssText}
    // });

    $('d2l-navigation').append('<div class="blue-banner"></div>');

    // logo - white
    var logoPath = '', logoFile = '';
    if (getCustomThemeOption('useThemeLogo')) {
        logoPath = baseURL + 'theme/theme_' + options.GLB_ThemeID + '/';
        logoFile = 'logo-waterloo.png';
        if (isWLU()) logoFile = 'logo-laurier.png';
    } else {
        logoPath = baseURL + 'img/';
        logoFile = 'waterloo_learn_logo.png';
        if (isWLU()) logoFile = 'laurier_learn_logo.png';
    }

    var logoImg = $('.d2l-navigation-link-image img');
    logoImg.attr('src', logoPath + logoFile);

    var themeInvCnt = 0;
    var dlightThemeInterval = setInterval(function () {
        if (!logoImg.length) {
            logoImg = $('.d2l-navigation-link-image img');
        } else if (!logoImg.attr('src').includes(logoFile)) {
            logoImg.attr('src', logoPath + logoFile);
        } else {
            clearInterval(dlightThemeInterval);
        }
        themeInvCnt++;
        if (themeInvCnt > 20) {
            clearInterval(dlightThemeInterval);
        }
    }, 200);

}

initTheme();