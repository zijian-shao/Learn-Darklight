function initTheme() {

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
                    chrome.runtime.sendMessage({
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
        logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.85);

        var themeInvCnt = 0;
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('d2l-navigation-link-image').sRoot().find('.d2l-navigation-link-image-container img');
            } else if (!logoImg.attr('src').match(/waterloo_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.85);
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

    if (document.querySelector('d2l-input-search') !== null && document.querySelector('d2l-input-search').shadowRoot !== null) {
        injectCSS(':host{--d2l-input_-_background-color:#424a56;' +
            '--d2l-input_-_border-color:#424a56;' +
            '--d2l-input_-_box-shadow:none}',
            $(document.querySelector('d2l-input-search').shadowRoot), 'text');

    }

    injectCSS('.d2l-floating-buttons-container.d2l-floating-buttons-floating' +
        '{border:none!important;background:#424a56!important;box-shadow:none!important;}',
        $('d2l-floating-buttons').sRoot(), 'text');


}

function themeOnDropdownClick($elem) {
    if ($elem.data('theme-dropdown-init') !== 'true') {
        $elem.data('theme-dropdown-init', 'true');
        injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_dropdown.css', $elem, 'file', true);
    } else if (typeof $elem.children('d2l-dropdown-menu').attr('render-content') === typeof undefined) {
        injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_dropdown.css', $elem.children('d2l-dropdown-menu'), 'file', true);
    }
}

function themeOnCourseDropdownClick(elem) {
    if (!elem.hasAttribute('data-theme-dropdown-init')) {
        elem.setAttribute('data-theme-dropdown-init', '');
        injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_dropdown.css', $(elem.querySelector('d2l-dropdown-menu')), 'file');
        injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_dropdown.css', $(elem.querySelector('d2l-dropdown-menu').shadowRoot), 'file');
    }
}

function themeOnCourseTileLoaded(elem) {
    var extraCSS = '';
    if (getCustomThemeOption('darkCoursePic')) {
        extraCSS += '.d2l-card-link-container>.d2l-card-header{opacity:0.7!important;}';
    }
    injectCSS(':host{background:#424a56;border:none!important}' +
        ':host([active]), :host([subtle][active]){box-shadow:0 0 0 4px rgba(9, 177, 185, 0.4)!important;}'
        + extraCSS,
        $(elem.shadowRoot), 'text');
}

initTheme();
