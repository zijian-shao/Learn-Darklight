function initTheme() {
    // For safari, only injects into top level frame
    if (window.self !== window.top)
        return;

    if (!isWLU()) {

        // bg - waterloo
        $('.d2l-page-main').prepend('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png)"></div>');

        // logo - white
        $('.d2l-navigation-s-logo-link img').after('<img src="' + baseURL + 'img/waterloo_learn_logo.png" alt="My Home" class="logo-white">');

    } else {

        // for wlu learn (beta)
        $('.d2l-navigation-s-logo-link img').after('<img src="' + baseURL + 'img/laurier_learn_logo.png" alt="My Home" class="logo-white">');

        // var logo = $('.d2l-navigation-s-logo-link img').clone();
        // logo.addClass('logo-white');
        // $('.d2l-navigation-s-logo-link img').after(logo);
        //
        // var cssText = '.d2l-navigation-s-logo-link img {-webkit-filter:invert(100%); filter:invert(100%);}';
        // cssText += '.d2l-navigation-s-logo-link img.logo-white {-webkit-filter: none; filter: none;}';
        // injectCSS(cssText, 'head', 'text');

    }
}

initTheme();
