function initTheme() {

    var d2lNavigation = document.getElementsByTagName('d2l-navigation');
    if (d2lNavigation.length) {
        d2lNavigation = d2lNavigation[0];
        if (d2lNavigation.shadowRoot !== null) {
            d2lNavigation.setAttribute('data-navbar-init', '');
            injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
                $(d2lNavigation), 'file', true);
        } else {
            var navCounter = 0;
            var navInterval = setInterval(function () {
                if (d2lNavigation.shadowRoot !== null || navCounter > 20) {
                    clearInterval(navInterval);
                    d2lNavigation.setAttribute('data-navbar-init', '');
                    setTimeout(function () {
                        injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
                            $(d2lNavigation), 'file', true);
                    }, 10);
                }
                navCounter++;
            }, 200);
        }
    }

}

initTheme();