function initTheme() {
    // tmp warning
    if (currURL2.match(/\/d2l\/home$/)) {
        $('<d2l-alert type="call-to-action" dir="ltr" style="max-width:none">' +
            '<strong>LEARN DARKLIGHT</strong><br>' +
            'Learn\'s recent updates have caused some extension functions broken. ' +
            'This theme will be updated in a few days. ' +
            'Please switch to other themes temporarily. ' +
            'Apologize for any inconvenience.</d2l-alert>')
            .prependTo('div.homepage-col-8');
    }

    // custom options - css
    var cssText = '';
    if (getCustomThemeOption('darkIframe') || getCustomThemeOption('invertIframe')) {
        var filterText = '';
        if (getCustomThemeOption('darkIframe'))
            filterText += 'brightness(0.8) ';
        if (getCustomThemeOption('invertIframe'))
            filterText += 'invert(1) ';
        if (filterText != '')
            cssText += 'iframe{-webkit-filter:' + filterText + '!important;filter:' + filterText + '!important;}';
    }
    if (getCustomThemeOption('darkCoursePic')) {
        cssText += '.d2l-card-link-container>.d2l-card-header{opacity:0.7!important;}';
        cssText += '#CourseImageBannerPlaceholderId .d2l-course-banner{opacity:0.7!important;}';
    }
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
        injectCSSShadow('div.d2l-navigation-centerer {max-width: none !important}',
            $('d2l-navigation'), 'text', true);
    }
    browser.runtime.sendMessage({
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

    // custom options - invert iframe
    if (getCustomThemeOption('invertIframe') && currURL.match(/\/d2l\/le\/content\/\d+\/viewContent\/\d+\/View/i)) {

        var iframe = null;
        var getIframeCounter = 0;

        function _getIframe() {
            iframe = $('#ContentView').find('iframe');
        }

        var interval = setInterval(function () {
            _getIframe();
            iframe.each(function (idx, elem) {
                if ($(elem).attr('src').trim() != '') {
                    clearInterval(interval);
                    browser.runtime.sendMessage({
                        action: 'executeScript',
                        data: {file: 'theme/theme_' + options.GLB_ThemeID + '/functions_iframe.js', allFrames: true}
                    });
                    return false;
                }
            });
            getIframeCounter++;
            if (getIframeCounter > 20) {
                clearInterval(interval);
            }
        }, 300);

    }

    if (!isWLU()) {

        // logo - white
        var logoImg = $('d2l-navigation-link-image').sRoot().find('.d2l-navigation-link-image-container img');
        logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('d2l-navigation-link-image').sRoot().find('.d2l-navigation-link-image-container img');
            } else if (!logoImg.attr('src').match(/waterloo_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);
            } else {
                clearInterval(dlightThemeInterval);
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    } else {

        // for wlu learn (beta)
        var logoImg = $('d2l-navigation-link-image').sRoot().find('.d2l-navigation-link-image-container img');
        logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png').css('opacity', 0.8);

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('d2l-navigation-link-image').sRoot().find('.d2l-navigation-link-image-container img');
            } else if (!logoImg.attr('src').match(/laurier_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png').css('opacity', 0.8);
            } else {
                clearInterval(dlightThemeInterval);
            }
            themeInvCnt++;
            if (themeInvCnt > 20) {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    }

    // quiz & survey warning
    if (currURL.match(/\/quizzing\//g) || currURL.match(/\/admin\//g)) {
        // || currURL.includes('/survey/') || currURL.includes('/dropbox/')
        alert('This theme has made many changes to the original webpage. In order to ensure nothing will go wrong, it\'s recommended to switch to other themes before you continue your work here.');
    }

    // calendar - upcoming
    if (currURL.match(/\/d2l\/home\/\d+/)) {
        $('.d2l-collapsepane-header').each(function (i, e) {
            if ($(e).text().match(/upcoming events/gi)) {
                $(e).parent('div.d2l-collapsepane').addClass('darklight-upcoming-events');
            }
        });
    }

}

initTheme();
