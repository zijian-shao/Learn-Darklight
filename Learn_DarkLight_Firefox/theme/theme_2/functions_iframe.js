if (window.top != window.self) {
    var styleTxt = 'body{background:#fff!important}.page{border:1px solid #aaa!important;margin:15px auto!important;}';
    var node = document.createElement('style');
    node.innerHTML = styleTxt;
    document.body.appendChild(node);
}