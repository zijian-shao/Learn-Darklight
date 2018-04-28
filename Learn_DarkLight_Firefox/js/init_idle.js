function initDarklightIdle() {
    if (!options.GLB_Enabled)
        return;

    // favicon
    var head = $('head');
    head.find('link[rel="icon"]').remove();
    head.append($('<link rel="icon" type="image/png" href="' + baseURL + 'icon/icon32.png' + '">'));

    // css
    injectCSS(baseURL + 'css/common.css', 'head');

    // js
    var jsText = 'var baseURL = "' + baseURL + '";';
    var params = document.createElement("script");
    params.textContent  = jsText;
    document.head.appendChild(params);

    injectJS(baseURL + 'js/functions.js', 'head');

    // overlay
    $('#darklight-load-overlay').delay(400).fadeOut(400, function () {
        $(this).remove();
    });
}

initDarklightIdle();