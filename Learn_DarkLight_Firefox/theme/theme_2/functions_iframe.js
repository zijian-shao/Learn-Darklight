if (window.top != window.self) {
    var url = window.location.href;
    if (url.match(/pdf/i) && url.match(/viewer/i)) {
        var styleTxt = 'body{background:#fff!important}'
            + '.page{border:1px solid #ccc!important;margin:15px auto!important;}'
            + '#toolbarContainer,.findbar,.secondaryToolbar{background:#eee!important}'
            + '.outlineItem > a,.attachmentsItem > button{color:#000!important}'
            + '.outlineItem > a:hover,.attachmentsItem > button:hover{box-shadow: 0 0 1px #000 inset, 0 0 1px #000!important;}';
        var node = document.createElement('style');
        node.textContent = styleTxt;
        document.body.appendChild(node);
    }
}