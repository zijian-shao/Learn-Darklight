if (window.top != window.self) {
    var url = window.location.href;
    if (url.match(/\/d2l\/lp\/homepage\/LegacyWidgetViewer\.d2l/gi)) {
        var styleTxt = 'body{background:none!important;color:#ddd;}'
            + '.d2l-typography{color:#ddd!important;}'
            + 'div.dco div.dco_c, div.dco_f div.dco_c{background:none!important}'
            + '.d2l-link, .d2l-link:active, .d2l-link:link, .d2l-link:visited{color:#09b1b9!important}'
            + 'div.dco div.dco_c ul li{filter:brightness(3);opacity: 0.7;}'
            + '.vui-list>li{border:none}'
            + '.vui-list>.vui-active{background:rgba(255,255,255,0.1)}';
        var node = document.createElement('style');
        node.textContent = styleTxt;
        document.body.appendChild(node);
    }
}