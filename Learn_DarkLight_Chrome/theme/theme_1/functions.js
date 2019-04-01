function initTheme() {

    var cssText = '';
    if (!getCustomThemeOption('whiteNavbar')) {
        // black bar
        cssText += 'd2l-navigation-main-footer' +
            '{border:none!important;background:rgba(0, 0, 0, 0.8)!important;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2)!important;}';
        cssText += 'd2l-navigation-main-footer a.d2l-navigation-s-link, d2l-navigation-main-footera.d2l-navigation-s-link:link, d2l-navigation-main-footera.d2l-navigation-s-link:visited' +
            '{color:#aaa!important;}';
        cssText += 'd2l-navigation-main-footer .d2l-navigation-s-item .d2l-navigation-s-group-text, d2l-navigation-main-footer .d2l-navigation-s-item d2l-icon' +
            '{color:#aaa!important;}';
    } else {
        // white bar
        cssText += 'd2l-navigation-main-footer' +
            '{box-shadow:0 2px 3px rgba(0, 0, 0, 0.02)!important;}' +
            '.d2l-page-main:before{content:"";background:linear-gradient(to bottom, rgba(249,250,251,1) 0%,rgba(249,250,251,0) 100%);' +
            'position:absolute;top:0;left:0;right:0;height:50vh;max-height:400px;z-index:-10;}';
    }

    chrome.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });

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

    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_widget_header_dropdown.css',
        $('.d2l-homepage-header-menu-wrapper d2l-dropdown'), 'file', true);

    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
        injectCSSShadow('div.d2l-navigation-centerer {max-width: none !important}', $('d2l-navigation'), 'text', true);
    }

}

initTheme();