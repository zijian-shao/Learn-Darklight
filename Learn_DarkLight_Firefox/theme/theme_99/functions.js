function initTheme() {

    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $('d2l-navigation'), 'file', true);

}

initTheme();