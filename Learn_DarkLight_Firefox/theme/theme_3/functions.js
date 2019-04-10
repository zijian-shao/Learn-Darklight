function initTheme() {

    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
    }

    // widget header dropdown
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_widget_header_dropdown.css',
        $('.d2l-homepage-header-menu-wrapper d2l-dropdown'), 'file', true);

    // wait for navbar
    var d2lNavigation = document.querySelector('d2l-navigation');
    if (d2lNavigation !== null) {
        if (d2lNavigation.shadowRoot !== null) {
            themeOnNavbarReady(d2lNavigation);
        } else {
            var navCounter = 0;
            var navInterval = setInterval(function () {
                if (d2lNavigation.shadowRoot !== null || navCounter > 20) {
                    clearInterval(navInterval);
                    themeOnNavbarReady(d2lNavigation);
                }
                navCounter++;
            }, 200);
        }
    }
}

function themeOnNavbarReady(d2lNavigation) {
    d2lNavigation.setAttribute('data-theme-navbar-init', '');
    // blue banner
    $(d2lNavigation).append('<div class="blue-banner"></div>');
    // css
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $(d2lNavigation), 'file', true);
    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        injectCSSShadow('div.d2l-navigation-centerer {max-width: none !important}',
            $(d2lNavigation), 'text', true);
    }
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
    replaceLogo(logoPath, logoFile);
}
initTheme();