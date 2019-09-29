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
            cssText += 'iframe{filter:' + filterText + '!important;}';
    }
    if (getCustomThemeOption('darkCoursePic')) {
        cssText += '.d2l-card-link-container>.d2l-card-header{opacity:0.7!important;}';
        cssText += '#CourseImageBannerPlaceholderId .d2l-course-banner{opacity:0.7!important;}';
    }
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
    }
    browser.runtime.sendMessage({
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

    // legacy widget viewer
    if (currURL2.match(/\/d2l\/home\/\d+$/)) {
        browser.runtime.sendMessage({
            action: 'insertCSS',
            data: {code: '[darklight-legacy-widget-viewer]{filter:none!important;background:none!important}'}
        });

        $('iframe').each(function (idx, el) {
            var self = $(el);
            if (el.hasAttribute('src') && el.getAttribute('src').match(/\/d2l\/lp\/homepage\/LegacyWidgetViewer\.d2l/gi)) {
                el.setAttribute('darklight-legacy-widget-viewer', '');
                var loadingCont = self.prev('.d2l-iframe-loading-container');
                if (loadingCont.css('display') !== 'none') {
                    var targetNode = loadingCont[0];
                    var observer = new MutationObserver(function () {
                        if (targetNode.style.display === 'none') {
                            var iframeDocument = el.contentDocument || el.contentWindow.document;
                            injectJS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/functions_legacy_widget_viewer.js',
                                $(iframeDocument.head), 'file');
                            injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/iframe_legacy_widget_viewer.css',
                                $(iframeDocument.head), 'file');
                        }
                    });
                    observer.observe(targetNode, {attributes: true});
                } else {
                    var iframeDocument = this.contentDocument || this.contentWindow.document;
                    injectJS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/functions_legacy_widget_viewer.js',
                        $(iframeDocument.head), 'file');
                    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/iframe_legacy_widget_viewer.css',
                        $(iframeDocument.head), 'file');
                }
            }
        });
    }

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

    // quiz & survey warning
    if (currURL.match(/\/quizzing\//g) || currURL.match(/\/admin\//g)) {
        // || currURL.includes('/survey/') || currURL.includes('/dropbox/')
        // alert('This theme has made many changes to the original webpage. In order to ensure nothing will go wrong, it\'s recommended to switch to other themes before you continue your work here.');
    }

    // calendar - upcoming
    if (currURL.match(/\/d2l\/home\/\d+/)) {
        $('.d2l-collapsepane-header').each(function (i, e) {
            if ($(e).text().match(/upcoming events/gi)) {
                $(e).parent('div.d2l-collapsepane').addClass('darklight-upcoming-events');
            }
        });
    }

    // input search box
    var inputSearch = document.querySelector('d2l-input-search');
    if (inputSearch !== null) {
        var waitSearchIntCnt = 0;
        var waitSearchInt = setInterval(function () {
            if (inputSearch.shadowRoot !== null) {
                clearInterval(waitSearchInt);
                injectCSS(':host{--d2l-input_-_background-color:#424a56;' +
                    '--d2l-input_-_border-color:#424a56;' +
                    '--d2l-input_-_box-shadow:none}',
                    $(inputSearch.shadowRoot), 'text');
            }
            waitSearchIntCnt++;
            if (waitSearchIntCnt > 20) {
                clearInterval(waitSearchInt);
            }
        }, 300);
    }

    // floating buttons
    if (document.querySelector('d2l-floating-buttons') !== null && document.querySelector('d2l-floating-buttons').shadowRoot !== null) {
        injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_float_button.css',
            $(document.querySelector('d2l-floating-buttons').shadowRoot), 'file');
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
    //                 setTimeout(function () {
    //                     themeOnNavbarReady(d2lNavigation);
    //                 }, 10);
    //             }
    //             navCounter++;
    //         }, 200);
    //     }
    // }

    if (currURL.match(/\/d2l\/login/gi) && currURL.match(/noRedirect=1/gi)) {
        $('.d2l-page-main, .d2l-login-portal-heading').css({
            'background': 'none',
            'color': ''
        });
        $('.d2l-login-portal-bordered').css({
            'background': 'none',
            'border-color': 'rgba(255,255,255,0.1)'
        });
    }
}

function themeOnNavbarReady(d2lNavigation) {
    d2lNavigation.setAttribute('data-navbar-init', '');
    // css
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $(d2lNavigation), 'file', true);
    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        if (d2lNavigation.querySelector('d2l-navigation-main-header') !== null
            && d2lNavigation.querySelector('d2l-navigation-main-header').shadowRoot !== null)
            injectCSS('.d2l-navigation-centerer{max-width:none!important}',
                $(d2lNavigation.querySelector('d2l-navigation-main-header').shadowRoot), 'text');
        if (d2lNavigation.querySelector('d2l-navigation-main-footer') !== null
            && d2lNavigation.querySelector('d2l-navigation-main-footer').shadowRoot !== null)
            injectCSS('.d2l-navigation-centerer{max-width:none!important}',
                $(d2lNavigation.querySelector('d2l-navigation-main-footer').shadowRoot), 'text');
    }
    // logo
    var logoPath = baseURL + 'img/';
    var logoFile = 'waterloo_learn_logo.png';
    if (isWLU()) logoFile = 'laurier_learn_logo.png';
    replaceLogo(logoPath, logoFile);
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
        ':host([active]), :host([subtle][active]){box-shadow:0 0 0 4px rgba(9, 177, 185, 0.4)!important;}' +
        extraCSS,
        $(elem.shadowRoot), 'text');
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_course_tile.css',
        $(elem), 'file');
}

function themeOnCourseTabAvailable(d2lTabs) {
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_course_tab.css', $(d2lTabs.shadowRoot), 'file');
    d2lTabs.querySelectorAll('d2l-tab-panel').forEach(function (elem) {
        injectCSS('d2l-alert{color:#ddd;background:var(--d2l-color-gypsum);border:var(--d2l-color-gypsum);}', $(elem.querySelector('d2l-my-courses-content').shadowRoot), 'text');
    });
}

// initTheme();
