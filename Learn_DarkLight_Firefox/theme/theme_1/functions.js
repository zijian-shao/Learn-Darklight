function initTheme() {

    var cssText = '';
    if (!getCustomThemeOption('whiteNavbar')) {
        cssText += '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{border:none!important;background:rgba(0, 0, 0, 0.8)!important;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2)!important;}';
        // cssText += '.d2l-navigation-s-shadow-gradient, .d2l-navigation-shadow-gradient' +
        //     '{background:none!important;}';
        cssText += 'd2l-navigation-main-footer a.d2l-navigation-s-link, d2l-navigation-main-footera.d2l-navigation-s-link:link, d2l-navigation-main-footera.d2l-navigation-s-link:visited' +
            '{color:#aaa!important;}';
        cssText += 'd2l-navigation-main-footer .d2l-navigation-s-item .d2l-navigation-s-group-text, d2l-navigation-main-footer .d2l-navigation-s-item .d2l-icon-0' +
            '{color:#aaa!important;}';
    } else {
        cssText += '.d2l-navigation-s-main, d2l-navigation-bottom-bar, d2l-navigation-main-footer' +
            '{box-shadow:0 2px 3px rgba(0, 0, 0, 0.02)!important;}' +
            '.d2l-page-main:before{content:"";background:linear-gradient(to bottom, rgba(249,250,251,1) 0%,rgba(249,250,251,0) 100%);' +
            'position:absolute;top:0;left:0;right:0;height:50vh;max-height:400px;z-index:-10;}';
    }
    if (getCustomThemeOption('fullWidthLayout')) {
        cssText += '.d2l-max-width {max-width:none!important}' +
            '.d2l-page-bg{max-width:none!important}' +
            'd2l-navigation-main-header>div.d2l-navigation-centerer{max-width:none!important}' +
            'd2l-navigation-main-footer>div.d2l-navigation-centerer{max-width:none!important}' +
            '.max-width.d2l-simple-overlay{max-width:none!important}' +
            '.d2l-navigation-s-centerer{max-width:none!important}' +
            '.daylight iframe.d2l-navbar-margin{max-width:none!important;width:100%!important;padding:0!important}';
    }
    chrome.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });

}

initTheme();