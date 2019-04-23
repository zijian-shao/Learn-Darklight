var baseURL, currURL, currURL2, currURLHost, options, configs, themeConfigs, thumbData;

var initReady = false;

function getBrowser() {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE ', version: (tem[1] || '')};
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null) return {name: 'Opera', version: tem[1]};
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return {name: M[0], version: M[1]};
}

function isBrowser(name) {
    name = name.toLowerCase();
    if (name == 'opera')
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    else if (name == 'firefox')
        return typeof InstallTrigger !== 'undefined';
    else if (name == 'safari')
        return /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    else if (name == 'ie')
        return /*@cc_on!@*/false || !!document.documentMode;
    else if (name == 'edge')
        return !isIE && !!window.StyleMedia;
    else if (name == 'chrome')
        return /chrome/.test(navigator.userAgent.toLowerCase());
    else
        return false;
}

function isWLU() {
    if (typeof isWLU.isWLUBool === typeof undefined) {
        isWLU.isWLUBool = currURL.includes('mylearningspace.wlu.ca');
    }
    return isWLU.isWLUBool;
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1)
        hostname = url.split('/')[2];
    else
        hostname = url.split('/')[0];
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function getCustomThemeOption(name) {
    return options['THEME_ID_' + options.GLB_ThemeID + '_OPT_' + name];
}

function parseServerCommJson(json) {
    if (typeof (Storage) === typeof undefined) return;
    json.forEach(function (e, i) {
        var md5Str = md5(btoa(JSON.stringify(e)));
        var md5Store = window.localStorage.getItem('Darklight.Server.' + md5Str);
        if (e.action === 'none') {
            // none
            var keys = Object.keys(localStorage);
            keys.forEach(function (e, i) {
                if (e.match(/^Darklight\.Server\./i)) {
                    window.localStorage.removeItem(e);
                }
            });
        } else if (e.action === 'notification') {
            // notification
            if (e.data.frequency === 'once' && md5Store !== null) return;
            if (e.data.type === 'alert') {
                if ((currURL2.match(/\/d2l\/home$/) && e.data.position === 'homepage')
                    || e.data.position !== 'homepage') {
                    window.localStorage.setItem('Darklight.Server.' + md5Str, Math.floor(Date.now() / 1000).toString());
                    alert(e.data.message);
                }
            } else if (e.data.type === 'toast') {

            }
        } else if (e.action === 'upgrade') {

        }
    });
}

function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('Learn Darklight (V' + oldVer + ')');

    browser.runtime.sendMessage({action: 'getDetails'}, function (response) {

        newVer = response.version;

        // update storage
        browser.storage.sync.set({
            'EXT_Version': newVer
        });

        // server communication
        if (options.EXT_ReceiveNotification && typeof (Storage) !== typeof undefined && false) {
            var lastRequest = window.localStorage.getItem('Darklight.Timestamp.ServerCommunication');
            if (lastRequest === null || Math.floor(Date.now() / 1000) - lastRequest > 600) {
                window.localStorage.setItem('Darklight.Timestamp.ServerCommunication', Math.floor(Date.now() / 1000).toString());
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var json = JSON.parse(this.responseText);
                        parseServerCommJson(json);
                        console.log(json);
                    }
                };
                xhttp.open('GET', 'https://www.zijianshao.com/dlight/notification/?version=' + newVer + '&platform=' + getBrowser()['name'].toLowerCase(), true);
                xhttp.send();
            }
        }

        // return on install
        if (oldVer == '0.0.0')
            return;

        if (versionCompare(oldVer, newVer) >= 0)
            return;

        console.log('New version updated (V' + newVer + ')');

        if (newVer.match(/2\.0\./) && !oldVer.match(/2\.0\./)) {
            browser.runtime.sendMessage({
                action: 'createTab',
                data: {url: browser.extension.getURL('/html/options.html') + '?whatsnew=' + newVer}
            });
        }

        console.log('Extension update script executed!');

    });
}

/**
 * Compare Versions
 * @param v1
 * @param v2
 * @param options
 * @returns {*}
 *  0 if the versions are equal
 *  a negative integer iff v1 < v2
 *  a positive integer iff v1 > v2
 * NaN if either version string is in the wrong format
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        } else if (v1parts[i] > v2parts[i]) {
            return 1;
        } else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

function rgb2hex(rgb) {
    // jsfiddle /Mottie/xcqpF/1/light/
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function hex2rgb(hex) {
    // stackoverflow 5623838
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 'rgb(' +
        parseInt(result[1], 16) + ',' +
        parseInt(result[2], 16) + ',' +
        parseInt(result[3], 16) + ')'
        : null;
}

function getContrastColor(hex) {

    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16)
    }

    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16)
    }

    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16)
    }

    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    // codepen /davidhalford/pen/ywEva
    var threshold = 130; // about half of 256. Lower threshold equals more dark text on dark background
    var hRed = hexToR(hex), hGreen = hexToG(hex), hBlue = hexToB(hex);
    var cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold) {
        return "#000000";
    } else {
        return "#ffffff";
    }
}

function invertColor(hex, bw) {
    function _padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    // stackoverflow 35969656
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return null;
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw === true) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + _padZero(r) + _padZero(g) + _padZero(b);
}

function md5(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
        return (x ^ y ^ z);
    }

    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    // http://www.webtoolkit.info/javascript-md5.html
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}

function initDarklight() {

    function init() {
        if (!options.GLB_Enabled)
            return;

        // disable on Waterloo Learn
        if (!options.GLB_EnableForWaterloo && !isWLU())
            return;

        // disable on Laurier MLS
        if (!options.GLB_EnableForLaurier && isWLU())
            return;

        if (currURL.includes('/content/enforced/'))
            return;

        themeConfigs = getThemeConfigs(options.GLB_ThemeID);

        if (options['THEME_ID_' + options.GLB_ThemeID + '_OPT_overrideOverlayColor'] !== undefined)
            themeConfigs.overlayColor = options['THEME_ID_' + options.GLB_ThemeID + '_OPT_overrideOverlayColor'];

        if (themeConfigs.overlayColor !== 'none') {
            var cover = document.createElement("div");
            cover.id = 'darklight-load-overlay';
            cover.className = 'darklight-load-overlay';
            cover.style.background = themeConfigs.overlayColor;
            document.documentElement.appendChild(cover);

            var text = document.createElement("div");
            text.innerHTML = '<p><strong>Extension didn\'t work?</strong></p>' +
                '<p>Please click the extension icon in toolbar and report this issue. Thank you.</p>';
            text.style.color = invertColor(themeConfigs.overlayColor, true);
            cover.appendChild(text);
        }

        var initStyle = document.createElement('style');
        initStyle.textContent = 'html,body{overflow:hidden!important;}';
        initStyle.id = 'darklight-init-style';
        initStyle.className = 'darklight-init-style';
        document.documentElement.appendChild(initStyle);

        // css
        browser.runtime.sendMessage({
            action: 'insertCSS',
            data: [
                // {code: 'html{font-size:' + options.GLB_BasicFontSize + 'px!important}'},
                // {file: 'css/common.css'}
                {code: 'html{font-size:' + options.GLB_BasicFontSize + 'px!important}'}
            ]
        });

        // course thumbs
        if (options.COURSE_CustomThumb && !isWLU()) {
            if (currURL2.match(/\/d2l\/home$/) || currURL2.match(/\/d2l\/home\/\d+$/)) {

                var act = '', extraSel = '';
                if (currURL2.match(/\/d2l\/home$/)) {
                    act = 'getCourseThumbsResponse';
                    extraSel = ' d2l-course-image';
                } else {
                    act = 'getCourseThumbsOneResponse';
                    extraSel = '';
                }

                browser.runtime.onMessage.addListener(
                    function (request, sender, sendResponse) {
                        if (request.action === 'getCourseThumbsResponse') {
                            var obj = {};
                            request.data.forEach(function (e) {
                                obj['ID_' + e.course_id] = e;
                            });
                            thumbData = obj;
                        } else if (request.action === 'getCourseThumbsOneResponse') {
                            var style = '';
                            request.data.forEach(function (item, index) {
                                style += '.darklight-course-thumb-' + item.course_id + extraSel + ' {';
                                style += 'background-image: url("' + item.thumb_image + '");';
                                style += '}';
                                style += '.darklight-course-thumb-' + item.course_id + extraSel + ' img {';
                                style += 'opacity: 0 !important;';
                                style += '}';
                            });
                            var styleElem = document.createElement("style");
                            styleElem.innerText = style;
                            styleElem.id = 'darklight-course-thumbs';
                            document.documentElement.appendChild(styleElem);
                        }
                    }
                );

                if (currURL2.match(/\/d2l\/home$/)) {
                    browser.runtime.sendMessage({action: 'getCourseThumbs'});
                } else {
                    var courseID = currURL2.match(/\/d2l\/home\/\d+$/)[0].split('/')[3];
                    browser.runtime.sendMessage({
                        action: 'getCourseThumbsOne',
                        data: {
                            course_id: courseID
                        }
                    });
                }

            }
        }

        extensionUpdate();

        initReady = true;
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    currURL2 = window.location.href.split('#')[0].split('?')[0];
    currURLHost = window.location.protocol + '//' + window.location.hostname;
    configs = getOptionListDefault();

    // add theme options
    var fullThemeConf = getThemeConfigs();
    for (var key in fullThemeConf) {
        if (Array.isArray(fullThemeConf[key].options)) {
            fullThemeConf[key].options.forEach(function (ob) {
                configs['THEME_ID_' + fullThemeConf[key].id + '_OPT_' + ob.key] = ob.value;
            });
        }
    }

    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });

}

initDarklight();