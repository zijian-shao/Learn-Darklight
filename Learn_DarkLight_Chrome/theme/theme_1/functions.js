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

    // widget header dropdown
    var dropdownCSS = baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_widget_header_dropdown.css';
    var dropdowns = document.querySelectorAll('.d2l-homepage-header-menu-wrapper d2l-dropdown d2l-button-icon');

    function _injectDropdownCSS(el, counter) {
        if (counter === undefined) counter = 0;
        if (counter > 20) return;

        if (el.shadowRoot !== null) {
            var icon = el.shadowRoot.querySelector('button d2l-icon');
            if (icon.shadowRoot !== null) {
                injectCSS(dropdownCSS, $(el.shadowRoot), 'file');
                injectCSS(dropdownCSS, $(icon.shadowRoot), 'file');
            } else {
                setTimeout(function () {
                    _injectDropdownCSS(el, ++counter);
                }, 500);
            }
        } else {
            setTimeout(function () {
                _injectDropdownCSS(el, ++counter);
            }, 500);
        }
    }

    dropdowns.forEach(function (el) {
        _injectDropdownCSS(el);
    });

    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
    }

    // wait for navbar
    // var d2lNavigation = document.querySelector('d2l-navigation');
    // if (d2lNavigation !== null) {
    //     if (d2lNavigation.shadowRoot !== null) {
    //         themeOnNavbarReady(d2lNavigation);
    //     } else {
    //         var navCounter = 0;
    //         var navInterval = setInterval(function () {
    //             if (d2lNavigation.shadowRoot !== null || navCounter > 20) {
    //                 clearInterval(navInterval);
    //                 themeOnNavbarReady(d2lNavigation);
    //             }
    //             navCounter++;
    //         }, 200);
    //     }
    // }
}

function themeOnNavbarReady(d2lNavigation) {
    d2lNavigation.setAttribute('data-theme-navbar-init', '');
    // css
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $(d2lNavigation), 'file', true);
    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        injectCSS('.d2l-navigation-centerer{max-width:none!important}',
            $(d2lNavigation.querySelector('d2l-navigation-main-header').shadowRoot), 'text');
        injectCSS('.d2l-navigation-centerer{max-width:none!important}',
            $(d2lNavigation.querySelector('d2l-navigation-main-footer').shadowRoot), 'text');
    }
}

// initTheme();