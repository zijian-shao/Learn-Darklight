function initTheme() {

    var cssText = '';
    var colorScheme = getCustomThemeOption('colorScheme');
    var colorItem = ['--dlight-band-color-1', '--dlight-band-color-2', '--dlight-band-color-3', '--dlight-band-color-4', '--dlight-nav-header-highlight-color', '--dlight-menu-hover-text-color', '--dlight-menu-hover-border-color', '--dlight-menu-hover-background-color', '--dlight-menu-hover-background-color-plus', '--dlight-widget-header-background-color', '--dlight-widget-header-text-color', '--dlight-link-hover-color', '--dlight-btn-primary-background-color', '--dlight-btn-primary-border-color', '--dlight-btn-primary-text-color', '--dlight-btn-primary-hover-background-color', '--dlight-btn-primary-hover-border-color', '--dlight-btn-primary-hover-text-color', '--dlight-btn-primary-hover-box-shadow-color', '--dlight-btn-default-background-color', '--dlight-btn-default-border-color', '--dlight-btn-default-text-color', '--dlight-btn-default-hover-background-color', '--dlight-btn-default-hover-border-color', '--dlight-btn-default-hover-text-color', '--dlight-btn-default-hover-box-shadow-color'];
    var colorData = {
        default: ['#fffaaa', '#ffea30', '#fdd54f', '#e4b429', '#fdd54f', '#222222', '#999999', '#eeeeee', '#f6f6f6', '#222222', '#fdd54f', '#f4ad24', '#333333', '#333333', '#fdd54f', '#fdd54f', '#fdd54f', '#333333', 'rgba(0,0,0,0.7)', '#f9fafb', '#d3d9e3', '#565a5c', '#333333', '#333333', '#ffffff', 'rgba(0,0,0,0.2)'],
        ahs: ['#97dfef', '#00bed0', '#0098a5', '#005963', '#00bed0', '#0098a5', '#00bed0', '#d5f2f9', 'rgba(213,242,249,.7)', '#0098a5', '#ffffff', '#0098a5', '#0098a5', '#0098a5', '#ffffff', '#97dfef', '#97dfef', '#005963', '#0098a5', '#f9fafb', '#d3d9e3', '#565a5c', '#0098a5', '#0098a5', '#ffffff', '#97dfef'],
        art: ['#ffd5a5', '#fbaf00', '#e78100', '#d93f00', '#fbaf00', '#d93f00', '#e78100', '#ffeedb', 'rgba(255,238,219,.6)', '#d93f00', '#ffffff', '#d93f00', '#d93f00', '#d93f00', '#ffffff', '#ffd5a5', '#ffd5a5', '#d93f00', '#e78100', '#f9fafb', '#d3d9e3', '#565a5c', '#d93f00', '#d93f00', '#ffffff', '#ffd5a5'],
        eng: ['#d0b4ef', '#be33da', '#8100b4', '#57058b', '#d0b4ef', '#8100b4', '#8100b4', '#ece1f9', 'rgba(236,225,249,.7)', '#57058b', '#d0b4ef', '#57058b', '#57058b', '#57058b', '#ffffff', '#d0b4ef', '#d0b4ef', '#57058b', '#8100b4', '#f9fafb', '#d3d9e3', '#565a5c', '#57058b', '#57058b', '#ffffff', '#d0b4ef'],
        env: ['#daf582', '#bed500', '#b4be00', '#607000', '#b4be00', '#607000', '#b4be00', '#f0fbcd', 'rgba(240,251,205,.5)', '#607000', '#daf582', '#607000', '#607000', '#607000', '#ffffff', '#daf582', '#daf582', '#607000', '#b4be00', '#f9fafb', '#d3d9e3', '#565a5c', '#607000', '#607000', '#ffffff', '#daf582'],
        mat: ['#ffbeef', '#ff63aa', '#df2498', '#c60078', '#ff63aa', '#df2498', '#df2498', '#ffe5f9', 'rgba(255,229,249,.6)', '#df2498', '#ffffff', '#df2498', '#df2498', '#df2498', '#ffffff', '#ffbeef', '#ffbeef', '#c60078', '#df2498', '#f9fafb', '#d3d9e3', '#565a5c', '#df2498', '#df2498', '#ffffff', '#ffbeef'],
        sci: ['#b4d5ff', '#63a0ff', '#0073ce', '#0033be', '#63a0ff', '#0073ce', '#63a0ff', '#e1eeff', 'rgba(225,238,255,.6)', '#0073ce', '#ffffff', '#0073ce', '#0073ce', '#0073ce', '#ffffff', '#b4d5ff', '#b4d5ff', '#0033be', '#0073ce', '#f9fafb', '#d3d9e3', '#565a5c', '#0073ce', '#0073ce', '#ffffff', '#b4d5ff']
    };
    cssText += ':root{';
    colorItem.forEach(function (c, i) {
        cssText += c + ':' + colorData[colorScheme][i] + ';';
    });
    cssText += '}';
    body.addClass('uw-' + colorScheme);

    browser.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: cssText}
    });

    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        body.addClass('darklight-fullwidth');
    }

    // tile mode for widget
    if (!getCustomThemeOption('tileModeForWidgets')) {
        body.addClass('darklight-tile-legacy');
        $('.d2l-widget').removeClass('d2l-tile');
        // $('.d2l-widget .vui-heading-4').removeClass('vui-heading-4').addClass('vui-heading-2');
        $('.d2l-body').removeClass('daylight-widget-demarcation d2l-tiles-container');
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
    //                 themeOnNavbarReady(d2lNavigation);
    //             }
    //             navCounter++;
    //         }, 200);
    //     }
    // }

    // drop down button observer
    function _customizeButtons() {
        document.querySelectorAll('d2l-button-subtle, d2l-button-icon').forEach(function (el) {
            if (!el.hasAttribute('data-theme-button-init')) {
                el.setAttribute('data-theme-button-init', '');
                injectCSS('button:hover, button:focus, :host([active]) button, :host(.d2l-button-subtle-hover) button, :host(.d2l-button-subtle-focus) button{background-color:var(--dlight-menu-hover-background-color);color:var(--dlight-menu-hover-text-color)}' +
                    'button:hover d2l-icon, button:focus d2l-icon, :host([active]) button d2l-icon, :host(.d2l-button-subtle-hover) button d2l-icon, :host(.d2l-button-subtle-focus) button d2l-icon{color:var(--dlight-menu-hover-text-color)}',
                    $(el.shadowRoot), 'text');
            }
        });
    }

    _customizeButtons();

    var tabPanel = document.getElementById('d2l_two_panel_selector_main');
    if (tabPanel !== null) {
        var observer = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.attributeName === 'aria-live') {
                    _customizeButtons();
                }
            }
        });
        observer.observe(tabPanel, {attributes: true});
    }
}

function themeOnNavbarReady(d2lNavigation) {
    d2lNavigation.setAttribute('data-theme-navbar-init', '');
    // css
    injectCSSShadow(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/shadow_navbar.css',
        $(d2lNavigation), 'file', true);
    // full width
    if (getCustomThemeOption('fullWidthLayout')) {
        injectCSS('.d2l-navigation-centerer{max-width:none!important}',
            $(d2lNavigation.querySelector('d2l-navigation-main-header').shadowRoot), 'text');
        injectCSS('.d2l-navigation-centerer{max-width:none!important}',
            $(d2lNavigation.querySelector('d2l-navigation-main-footer').shadowRoot), 'text');
    }
    // logo
    var logoPath = '', logoFile = '';
    if (getCustomThemeOption('useThemeLogo')) {
        logoPath = baseURL + 'theme/theme_' + options.GLB_ThemeID + '/';
        logoFile = 'uwaterloo_logo.svg';
    } else {
        logoPath = baseURL + 'img/';
        logoFile = 'waterloo_learn_logo.png';
    }
    if (isWLU()) {
        logoPath = baseURL + 'img/';
        logoFile = 'laurier_learn_logo.png';
    }
    replaceLogo(logoPath, logoFile);
    // color band
    $('<div class="darklight-navbar-color-band"><div></div><div></div><div></div><div></div></div>').insertAfter($('d2l-navigation-main-header'));
}

function themeOnCourseTileLoaded(elem) {
    var colorScheme = getCustomThemeOption('colorScheme');
    // course tile box shadow on active
    if (colorScheme === 'default') {
        injectCSS(':host([active]), :host([subtle][active]){' +
            'box-shadow:0 0 0 4px var(--dlight-btn-default-hover-box-shadow-color)!important;' +
            'border-color:var(--dlight-btn-default-hover-box-shadow-color)!important;' +
            '}',
            $(elem.shadowRoot), 'text');
    } else {
        injectCSS(':host([active]), :host([subtle][active]){' +
            'box-shadow:0 0 0 4px var(--dlight-band-color-1)!important;' +
            'border-color:var(--dlight-band-color-2)!important;' +
            '}',
            $(elem.shadowRoot), 'text');
    }
}

function themeOnCourseTabAvailable(d2lTabs) {
    d2lTabs.shadowRoot.querySelectorAll(':host > .d2l-tabs-layout > .d2l-tabs-container > .d2l-tabs-container-list > d2l-tab').forEach(function (el) {
        if (el.shadowRoot !== null) {
            injectCSS(':host([aria-selected="true"]:focus) .d2l-tab-selected-indicator{box-shadow:0 0 0 3px var(--dlight-btn-default-hover-box-shadow-color)}',
                $(el.shadowRoot), 'text');
        }
    });
}

// initTheme();