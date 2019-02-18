function initPopup() {

    function getFeedbackLink() {
        function _getOS() {
            var OSName = "Unknown";
            if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
            if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
            return OSName;
        }

        function _getBrowser() {
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

        var urlTpl = getLink('feedback');
        urlTpl = urlTpl.replace('@@extVersion@@', encodeURI(browser.runtime.getManifest().version));
        urlTpl = urlTpl.replace('@@browser@@', encodeURI(_getBrowser().name + ' ' + _getBrowser().version));
        urlTpl = urlTpl.replace('@@os@@', encodeURI(_getOS()));

        return urlTpl;
    }

    browser.storage.sync.get(getOptionListDefault(), function (items) {
        $('#enable-darklight').prop('checked', items.GLB_Enabled);

        var quickLinks = $('#quick-access-links');
        if (items.GLB_PopupAccessForWaterloo) {
            $('<div class="btn btn-yellow">' +
                '<div class="btn-icon"><img src="../img/popup-icon-waterloo.png" alt="Waterloo"></div>' +
                '<div class="btn-text">Waterloo Learn</div></div>').on('click', function () {
                browser.tabs.create({
                    url: 'https://learn.uwaterloo.ca/'
                });
            }).appendTo(quickLinks);
        }
        if (items.GLB_PopupAccessForLaurier) {
            $('<div class="btn btn-purple">' +
                '<div class="btn-icon"><img src="../img/popup-icon-laurier.png" alt="Laurier"></div>' +
                '<div class="btn-text">Laurier MyLearningSpace</div></div>').on('click', function () {
                browser.tabs.create({
                    url: 'https://mylearningspace.wlu.ca/'
                });
            }).appendTo(quickLinks);
        }
    });

    $('#report-bug').on('click', function (e) {
        e.preventDefault();
        browser.tabs.create({
            url: getFeedbackLink()
        });
    });

    $('#enable-darklight').on('change', function () {

        browser.storage.sync.set({

            GLB_Enabled: $(this).is(':checked')

        }, function () {

            $('#darklight-toast').removeClass('darklight-toast-hidden');
            setTimeout(function () {
                $('#darklight-toast').addClass('darklight-toast-hidden');
            }, 2000);

        });

    });

    $('#more-options').on('click', function () {
        browser.tabs.create({
            url: browser.runtime.getURL('/html/options.html#themes')
        });
    });

}

initPopup();