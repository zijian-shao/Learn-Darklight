function init() {
    // bg - waterloo
    $('.d2l-page-main').prepend('<div class="darklight-waterloo" style="background-image: url(' + baseURL + 'img/waterloo_background.png)"></div>');

    // logo - white
    $('.d2l-navigation-s-logo-link img').after('<img src="'+baseURL+'img/waterloo_learn_logo.png" alt="My Home" class="logo-white">');

    $('.d2l-homepage-header-wrapper').each(function (i, e) {
        // remove sys alert if empty
        if ($(e).text().match(/SYSTEM ALERT/gi)) {
            var alertHtml = $(e).parent('div.d2l-widget-header').next('div.d2l-widget-content').children('div.d2l-htmlblock').first();
            var _alertHtml = alertHtml.clone();
            _alertHtml.find('a').remove();
            _alertHtml.find('script').remove();
            if (_alertHtml.text().trim() == '') {
                $(e).parents('div.d2l-widget').remove();
            }
        }
    });
}

init();