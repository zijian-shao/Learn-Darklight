function initTheme() {
    if (!isWLU()) {

        // // bg - waterloo
        $('.d2l-page-main').prepend('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png); opacity: 0.2;"></div>');

        // logo - white
        $('.d2l-navigation-s-logo-link img').attr('src', baseURL + 'img/waterloo_learn_logo.png').css('opacity', 0.8);

    } else {

        // for wlu learn (beta)
        var cssText = '.d2l-navigation-s-logo-link img {-webkit-filter:invert(100%); filter:invert(100%);}';
        injectCSS(cssText, 'head', 'text');

    }

    // if (currURL.includes('/content/')) {
    //     var pageHeaderLine = $('.d2l-page-header').next('div').next('div');
    //     if (pageHeaderLine.text().trim() == '')
    //         pageHeaderLine.hide();
    // }

    // quiz & survey warning
    if (currURL.includes('/quizzing/')) {
        // || currURL.includes('/survey/') || currURL.includes('/dropbox/')
        alert('This theme has made many changes to the original webpage. In order to ensure nothing will go wrong, it\'s recommended to switch to other themes before you continue your work on this page.');
    }
}

initTheme();
