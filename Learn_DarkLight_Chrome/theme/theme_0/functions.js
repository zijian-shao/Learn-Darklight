function initTheme() {

    var cssText = '';
    cssText += ':root{--darklight-nav-primary-color:' + getCustomThemeOption('navPrimaryColor') + '}';

    chrome.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });

    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $('d2l-navigation'), 'file', true);
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_widget_header_dropdown.css',
        $('.d2l-homepage-header-menu-wrapper d2l-dropdown'), 'file', true);

    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
        injectCSSShadow('div.d2l-navigation-centerer {max-width: none !important}',
            $('d2l-navigation'), 'text', true);
    }

    if (!isWLU()) {

        // bg - waterloo
        if (currURL.match(/quizzing/g) || currURL.match(/survey/g) || currURL.match(/\/admin\//g) || !getCustomThemeOption('showWaterlooLogo')) {
            // quiz & survey
            chrome.runtime.sendMessage({
                action: 'insertCSS',
                data: {code: '.d2l-page-bg > div, .d2l-page-main, .d2l-max-width, .d2l-min-width{min-height:0!important;}'}
            });
        } else {
            body.prepend('<div class="darklight-waterloo-side-logo"></div>');
        }

        // logo - white
        var logoImg = $('d2l-navigation-link-image');
        logoImg.each(function () {
            $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', baseURL + 'img/waterloo_learn_logo.png');
        });

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('d2l-navigation-link-image');
            } else {
                clearInterval(dlightThemeInterval);
                logoImg.each(function () {
                    $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', baseURL + 'img/waterloo_learn_logo.png');
                });
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    } else {

        // for wlu learn
        var logoImg = $('d2l-navigation-link-image');
        logoImg.each(function () {
            $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', baseURL + 'img/laurier_learn_logo.png');
        });

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('d2l-navigation-link-image');
            } else {
                clearInterval(dlightThemeInterval);
                logoImg.each(function () {
                    $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', baseURL + 'img/laurier_learn_logo.png');
                });
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    }

}

initTheme();