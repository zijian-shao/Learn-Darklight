function initTheme() {

    // custom options - css
    var cssText = '';
    if (getCustomThemeOption('darkIframe') || getCustomThemeOption('invertIframe')) {
        var filterText = '';
        if (getCustomThemeOption('darkIframe'))
            filterText += 'brightness(0.8) ';
        if (getCustomThemeOption('invertIframe'))
            filterText += 'invert(1) ';
        cssText += 'iframe{-webkit-filter:' + filterText + ';filter:' + filterText + ';}';
    }

    if (getCustomThemeOption('darkCoursePic')) {
        cssText += '.d2l-enrollment-card-image-container.shown {opacity: 0.8 !important;}';
        cssText += '#CourseImageBannerPlaceholderId .d2l-course-banner {opacity: 0.8 !important;}';
    }

    if (cssText != '')
        injectCSS(cssText, 'body', 'text');

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

        // bg - waterloo
        if (currURL.match(/quizzing/g) || currURL.match(/survey/g) || currURL.match(/\/admin\//g)) {
            // quiz & survey
            injectCSS('.d2l-page-bg > div, .d2l-page-main, .d2l-max-width, .d2l-min-width{min-height:0;}', 'body', 'text');
        } else {
            // $('.d2l-page-main').pre  pend('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png); opacity: 0.4;"></div>');
        }

        // logo - white
        if (isBrowser('firefox')) {
            var logoImg = $('.d2l-navigation-link-image img');
            var dlightThemeInterval = setInterval(function () {
                if (!logoImg.length) {
                    logoImg = $('.d2l-navigation-link-image img');
                } else if (!logoImg.attr('src').match(/waterloo_learn_logo\.png/)) {
                    logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);
                } else {
                    clearInterval(dlightThemeInterval);
                }
            }, 200);
        } else {
            $('.d2l-navigation-link-image img').attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);
        }

    } else {

        // for wlu learn (beta)
        if (isBrowser('firefox')) {
            var logoImg = $('.d2l-navigation-link-image img');
            var dlightThemeInterval = setInterval(function () {
                if (!logoImg.length) {
                    logoImg = $('.d2l-navigation-link-image img');
                } else if (!logoImg.attr('src').match(/laurier_learn_logo\.png/)) {
                    logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png').css('opacity', 0.8);
                } else {
                    clearInterval(dlightThemeInterval);
                }
            }, 200);
        } else {
            $('.d2l-navigation-link-image img').attr('src', baseURL + 'img/laurier_learn_logo.png').css('opacity', 0.8);
        }

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
        $('.d2l-widget-header').each(function (i, e) {
            var headText = $(e).text();
            if (headText.match(/Calendar/)) {
                $(e).parents('div.d2l-widget').addClass('darklight-course-home-calendar');
            }
        });
    }
}

initTheme();
