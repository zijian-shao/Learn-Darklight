function initTheme() {
    if (!isWLU()) {

        // bg - waterloo
        $('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png)"></div>').prependTo('.d2l-page-main');

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

    var d2lNavigation = document.getElementsByTagName('d2l-navigation');
    if (d2lNavigation.length) {
        d2lNavigation = d2lNavigation[0];
        if (d2lNavigation.shadowRoot !== null) {
            d2lNavigation.setAttribute('data-navbar-init', '');
            injectCSSShadow(baseURL + 'css/theme_shadow_navbar.css',
                $(d2lNavigation), 'file', true);
        } else {
            var navCounter = 0;
            var navInterval = setInterval(function () {
                if (d2lNavigation.shadowRoot !== null || navCounter > 20) {
                    clearInterval(navInterval);
                    d2lNavigation.setAttribute('data-navbar-init', '');
                    setTimeout(function () {
                        injectCSSShadow(baseURL + 'css/theme_shadow_navbar.css',
                            $(d2lNavigation), 'file', true);
                    }, 10);
                }
                navCounter++;
            }, 200);
        }
    }

    injectCSSShadow(baseURL + 'css/theme_shadow_widget_header_dropdown.css',
        $('.d2l-homepage-header-menu-wrapper d2l-dropdown'), 'file', true);


    // course home calendar
    if (currURL.match(/\/d2l\/home\/\d+/)) {
        $('.d2l-widget-header').each(function (i, e) {
            var headText = $(e).text();
            if (headText.match(/Calendar/)) {
                $(e).parents('div.d2l-widget').addClass('darklight-course-home-calendar');
            }
        });
    }
}