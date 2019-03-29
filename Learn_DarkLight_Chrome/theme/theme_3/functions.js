function initTheme() {

    // custom options - css
    // var cssText = '';
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
        injectCSSShadow('div.d2l-navigation-centerer {max-width: none !important}',
            $('d2l-navigation'), 'text', true);
    }
    // chrome.runtime.sendMessage({
    //     action: 'insertCSS',
    //     data: {code: cssText}
    // });

    $('d2l-navigation').append('<div class="blue-banner"></div>');

    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $('d2l-navigation'), 'file', true);
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_widget_header_dropdown.css',
        $('.d2l-homepage-header-menu-wrapper d2l-dropdown'), 'file', true);


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

    var logoImg = $('d2l-navigation-link-image');
    logoImg.each(function () {
        $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', logoPath + logoFile);
    });

    var themeInvCnt = 0;
    var dlightThemeInterval = setInterval(function () {
        if (!logoImg.length) {
            logoImg = $('d2l-navigation-link-image');
        } else if (!logoImg.attr('src').includes(logoFile)) {
            logoImg.each(function () {
                $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', logoPath + logoFile);
            });
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