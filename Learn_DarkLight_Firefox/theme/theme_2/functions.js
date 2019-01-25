function initTheme() {
    if (!isWLU()) {

        // bg - waterloo
        if ((currURL.match(/quizzing/g) || currURL.match(/survey/g))) {
            // quiz & survey
            injectCSS('.d2l-page-bg > div, .d2l-page-main, .d2l-max-width, .d2l-min-width{min-height:0;}', 'body', 'text');
        } else {
            $('.d2l-page-main').prepend('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png); opacity: 0.2;"></div>');
        }

        // logo - white
        // $('.d2l-navigation-link-image img').attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);

        var logoImg = $('.d2l-navigation-link-image img');
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('.d2l-navigation-link-image img');
            } else if (!logoImg.attr('src').match(/waterloo_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/waterloo_learn_logo.png');
            } else {
                clearInterval(dlightThemeInterval);
            }
        }, 200);

    } else {

        // for wlu learn (beta)
        // $('.d2l-navigation-link-image img').attr('src', baseURL + 'img/laurier_learn_logo.png').css('opacity', 0.8);

        var logoImg = $('.d2l-navigation-link-image img');
        var dlightThemeInterval = setInterval(function () {
            if (!logoImg.length) {
                logoImg = $('.d2l-navigation-link-image img');
            } else if (!logoImg.attr('src').match(/laurier_learn_logo\.png/)) {
                logoImg.attr('src', baseURL + 'img/laurier_learn_logo.png');
            } else {
                clearInterval(dlightThemeInterval);
            }
        }, 200);
        
    }

    // if (currURL.includes('/content/')) {
    //     var pageHeaderLine = $('.d2l-page-header').next('div').next('div');
    //     if (pageHeaderLine.text().trim() == '')
    //         pageHeaderLine.hide();
    // }

    // quiz & survey warning
    if (currURL.match(/\/quizzing\//g)) {
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
