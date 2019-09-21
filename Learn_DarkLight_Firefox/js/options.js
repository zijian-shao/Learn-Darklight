function initOptions() {

    var options;

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

    function blockPage(color, msg, time) {
        if ($('#darklight-block-page').length)
            return;

        if (time === undefined || !Number.isInteger(time) || time == null || time === false)
            time = 300;

        var elem = $('<div/>', {
            'id': 'darklight-block-page',
            'class': 'darklight-block-page'
        });

        if (color !== undefined && color !== '')
            elem.css('background-color', color);
        if (msg === undefined)
            msg = 'Loading';

        elem.append($('<div class="darklight-block-page-wrapper">' +
            '<div class="darklight-block-page-loader"></div>' +
            '<div class="darklight-block-page-message">' + msg + '</div>' +
            '</div>')).hide().appendTo('body').fadeIn(time);

    }

    function blockPageMsg(msg) {
        $('#darklight-block-page').find('.darklight-block-page-message').text(msg);
    }

    function unblockPage(time) {

        if (time === undefined || !Number.isInteger(time) || time == null || time === false)
            time = 300;

        $('#darklight-block-page').fadeOut(time, function () {
            $(this).remove();
        });

    }

    function scrollToUtil(pos, time, offset, callback) {

        if ($.type(offset) !== 'number')
            offset = 0;

        if ($.type(pos) === 'object')
            pos = pos.offset().top;
        else if ($.type(pos) === 'string')
            pos = $(pos).first().offset().top;

        $('html').animate({scrollTop: pos - offset}, time, function () {
            if (typeof callback === 'function') {
                callback();
            }
        });

    }

    function showToast(content) {
        var tst = $('#darklight-toast');
        if (content !== undefined) {
            tst.html(content);
        } else {
            tst.html('Options Saved');
        }

        tst.removeClass('darklight-toast-hidden');

        window.clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(function () {
            tst.addClass('darklight-toast-hidden');
            tst.html('');
        }, 2000);
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

    function initPopup(title, content, extraClass, type) {

        $('body').addClass('lock-scroll');

        var rnd = Math.floor(Math.random() * 90000) + 10000;
        var content2;

        if (typeof type === typeof undefined) type = 0;

        if (type === 1) {
            // clone content
            content2 = content.clone();
        } else if (type === 2) {
            // use content directly, place back to original place when removePopup
            content2 = content;
            $('<div id="popup-' + rnd + '-content-placeholder"></div>').insertBefore(content2);
        } else {
            // find element with '.popup-template' next to content
            content2 = content.next('.popup-template').first().children().clone();
        }
        if (extraClass === undefined) extraClass = '';

        var template = $('<div class="popup popup-' + rnd + ' ' + extraClass + '" data-popup-type="' + type + '">' +
            '<div class="popup-layer"></div>' +
            '<div class="popup-container">' +
            '<div class="popup-frame">' +
            '<div class="popup-title"></div>' +
            '<div class="popup-content"></div>' +
            '</div>' +
            '</div>' +
            '</div>');
        template.find('.popup-title').html(title);
        template.find('.popup-content').append(content2);
        template.appendTo('body');
        template.addClass('popup-show');
        template.find('.popup-layer').addClass('fadeIn animated');
        template.find('.popup-frame').addClass('fadeInDown animated');
        return 'popup-' + rnd;
    }

    function removePopup(cls) {

        var popup = $('.' + cls);

        if (popup.attr('data-popup-type') != '2') {
            popup.remove();
        } else {
            var popupPlaceholder = $('#' + cls + '-content-placeholder');
            popup.find('.popup-content').children().insertAfter(popupPlaceholder);
            popupPlaceholder.remove();
            popup.remove();
        }

        if (!$('.popup').length) $('body').removeClass('lock-scroll');
    }

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (welcomeMode) {
            if (!hash.length) hash = 'home';
            if (hash === 'home')
                renderStars.aniPlay = true;
            else
                renderStars.aniPlay = false;
            return;
        }
        if (!hash.length) hash = 'global';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function refreshThumbList() {

        browser.runtime.sendMessage({action: 'getCourseThumbs'});

    }

    function restoreOptions() {

        var configs = getOptionListDefault();

        // synced
        browser.storage.sync.get(configs, function (items) {

            var optionElem;
            options = items;

            for (var key in items) {

                optionElem = $('input[data-option-name="' + key + '"], ' +
                    'textarea[data-option-name="' + key + '"]');

                switch (key) {

                    case 'GLB_ThemeID':
                    case 'GLB_CustomFontInfo':
                        var hasFound = false;
                        if (key == 'GLB_CustomFontInfo') {
                            items[key] = items[key].split('||');
                            items[key] = items[key][0];
                        }
                        optionElem.each(function (index, element) {
                            if ($(element).attr('value') == items[key]) {
                                $(element).prop('checked', true);
                                if (key == 'GLB_ThemeID')
                                    $(element).closest('.theme-item').addClass('selected');
                                if (key == 'GLB_CustomFontInfo')
                                    $(element).closest('.font-item').addClass('selected');
                                hasFound = true;
                            }
                        });

                        if (!hasFound) {
                            optionElem.first().prop('checked', true).trigger('change');
                            optionElem.first().closest('.theme-item').addClass('selected');
                            optionElem.first().closest('.font-item').addClass('selected');
                        }

                        if (welcomeMode && key === 'GLB_ThemeID')
                            optionElem.first().closest('.container').addClass('theme-container-' + items[key]);
                        break;

                    case 'HOME_CourseTileContextMenuData':
                        var contentList = items[key];
                        contentList.forEach(function (cl) {
                            cl.list.forEach(function (c) {
                                $('input[data-option-name="' + key + '"][data-menu-group="' + cl.name + '"][data-menu-name="' + c.name + '"]').first().prop('checked', c.visible);
                            });
                        });
                        break;

                    case 'GLB_BasicFontSize':
                        optionElem.val(items[key]);
                        $('.font-size-tags span[data-size="' + items[key] + '"]').addClass('selected');
                        break;

                    case 'GLB_DarklightFaviconInvert':
                        if (items[key] === true)
                            $('<link rel="icon" type="image/png" href="/icon/icon32-invert.png">').appendTo('head');
                        else
                            $('<link rel="icon" type="image/png" href="/icon/icon32.png">').appendTo('head');
                        optionElem.prop('checked', items[key]);
                        break;
                    default:
                        if (items[key] === true)
                            optionElem.prop('checked', items[key]);
                        else
                            optionElem.val(items[key]);
                }

            }

            bindEvents();
        });

        // local
        var timeOut = 500, timeIntv = 200;
        if (isBrowser('firefox')) {
            timeOut = 1000;
            timeIntv = 200;
        }
        setTimeout(function () {
            if (welcomeMode) return;
            if (params['whatsnew'] !== undefined) return;

            var thumbList = $('#saved-thumb-list');
            var intCnt = 0;
            var interval = setInterval(function () {
                if (typeof thumbList.attr('data-list-init') === typeof undefined) {
                    refreshThumbList();
                } else {
                    clearInterval(interval);
                    $('#add-course-thumbnail').removeAttr('disabled');
                    if (params['action'] === 'add-custom-cover') {
                        unblockPage(0);
                        scrollToUtil($('#opt-courses-0-0').closest('div.group'), 0, 30);
                        $('#add-course-thumbnail').trigger('click');
                    }
                }
                intCnt++;
                if (intCnt > 10) {
                    clearInterval(interval);
                    if (params['action'] === 'add-custom-cover') unblockPage(0);
                    alert('IndexedDB initialization failed. It seems like your browser does not support IndexedDB. Some features may not work properly.');
                }
            }, timeIntv);
        }, timeOut);

    }

    function saveOption(obj, callback) {

        browser.storage.sync.set(obj, function () {

            showToast();

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    }

    function onOptionChange(elem) {

        if (typeof elem.attr('data-option-type') === typeof undefined
            || typeof elem.attr('data-option-name') === typeof undefined)
            return;

        var inputType = elem.attr('type');
        var optType = elem.attr('data-option-type');
        var optName = elem.attr('data-option-name');
        var optVal = elem.attr('data-option-value');

        if (inputType == 'checkbox') {

            switch (optType) {

                // simple switch, save as boolean
                case 'switch':

                    var obj = {};
                    obj[optName] = elem.is(':checked');
                    // white icon
                    if (optName == 'GLB_DarklightFaviconInvert') {
                        if (obj[optName]) {
                            browser.browserAction.setIcon({
                                path: {
                                    "16": "/icon/icon16-invert.png",
                                    "24": "/icon/icon24-invert.png",
                                    "32": "/icon/icon32-invert.png"
                                }
                            });
                            $('head link[rel="icon"]').attr('href', '/icon/icon32-invert.png');
                        } else {
                            browser.browserAction.setIcon({
                                path: {
                                    "16": "/icon/icon16.png",
                                    "24": "/icon/icon24.png",
                                    "32": "/icon/icon32.png"
                                }
                            });
                            $('head link[rel="icon"]').attr('href', '/icon/icon32.png');
                        }
                    }
                    saveOption(obj);

                    break;

                // list of items, save as array string
                case 'item':

                    var contentArr = [];

                    $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                        if ($(element).is(':checked')) {
                            contentArr.push($(element).attr('name'));
                        }
                    });

                    var obj = {};
                    obj[optName] = contentArr;
                    saveOption(obj);

                    break;

                case 'item2':

                    var contentObj = {};
                    $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                        contentObj['row_' + index] = {
                            'name': $(element).attr('data-option-value'),
                            'display': $(element).is(':checked')
                        };
                    });

                    var obj = {};
                    obj[optName] = contentObj;
                    saveOption(obj);

                    break;

                // course tile context menu
                case 'item-tile-context-menu':

                    var contentList = getOptionListDefault()[optName];
                    var i, j;

                    for (i = 0; i < contentList.length; i++) {
                        for (j = 0; j < contentList[i].list.length; j++) {
                            var targetElem = $('input[data-option-name="' + optName + '"][data-menu-group="' + contentList[i].name + '"][data-menu-name="' + contentList[i].list[j].name + '"]').first();
                            contentList[i].list[j].visible = targetElem.length ? targetElem.is(':checked') : false;
                        }
                    }

                    var obj = {};
                    obj[optName] = contentList;
                    saveOption(obj);

                    break;

                default:

            }
        } else if (inputType == 'radio') {

            switch (optType) {
                // save "value" attr of the radio
                case 'enum':

                    var obj = {};
                    obj[optName] = elem.attr('value');
                    saveOption(obj);

                    break;
                // font
                case 'enum-font':
                    var obj = {};
                    obj[optName] = elem.attr('value') + '||' + elem.attr('data-font-weight') + '||' + elem.attr('data-font-size');
                    var fontSrc = elem.attr('data-font-source');
                    if (typeof fontSrc !== typeof undefined && fontSrc !== false) {
                        obj[optName] = obj[optName] + '||' + fontSrc;
                    }
                    updateFontPreview('family', obj[optName]);
                    saveOption(obj);
                    break;
            }
        } else if (inputType == 'text') {

            switch (optType) {
                // color
                case 'color':
                    if (elem.attr('data-save-on-blur') == 'true') {
                        var obj = {};
                        var colorVal = elem.val().trim();
                        if (colorVal.match(/^#[0-9a-f]{3,6}$/i)
                            || colorVal.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i)) {
                            obj[optName] = colorVal;
                            saveOption(obj);
                        } else if (colorVal == '') {
                            elem.val(elem.attr('data-default-value'));
                            colorVal = elem.val().trim();
                            obj[optName] = colorVal;
                            saveOption(obj);
                        } else {
                            alert('Save failed:\n- Invalid color syntax. Please use RGB or HEX.');
                        }
                    }

                    break;

                default:
            }
        } else if (inputType == 'range') {

            switch (optType) {

                case 'slider':

                    var obj = {};
                    obj[optName] = elem.val();
                    updateFontPreview('size', obj[optName]);
                    saveOption(obj);

                    break;

                default:
            }
        }
    }

    function bindEvents() {

        var allowHashChange = true;

        // event
        $('input').on('change', function () {
            onOptionChange($(this));
        });

        // switch between tabs
        $('.nav-tab').on('click', function () {

            if ($(this).hasClass('active'))
                return;

            if (typeof $(this).attr('data-option-tab-index') === typeof undefined)
                return;

            var prevTabID = $('li.nav-tab.active').attr('data-option-tab-index');
            var thisTabID = $(this).attr('data-option-tab-index');

            $('#nav-tab-' + prevTabID).removeClass('active');
            $(this).addClass('active');


            allowHashChange = false;
            window.scrollTo(0, $('#opt-tab-' + thisTabID).offset().top);
            setTimeout(function () {
                allowHashChange = true;
            }, 200);

            window.location.hash = $(this).attr('data-option-tab-name');

        });

        // auto switch tab
        onHashChange();

        // toggle tips
        $('.option-tip-toggle').on('click', function () {
            $(this).closest('div.option-group').find('div.option-tip').toggleClass('hidden');
        });

        // share
        $('.share-link').on('click', function (e) {
            e.preventDefault();
            var openIn = $(this).attr('data-open-in');
            var href = $(this).attr('href');
            if (openIn == 'popup') {
                var width = $(this).attr('data-width');
                var height = screen.height * 0.6;
                var left = (screen.width - width) / 2;
                var top = screen.height * 0.1;
                window.open(href, '',
                    'menubar=0, toolbar=0, resizable=1, location=0, scrollbars=1, status=1, ' +
                    'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top);
            } else if (openIn == 'newtab') {
                window.open(href, '_blank');
            } else if (openIn == 'copy') {
                $('#clipboard-input').val(href).select();
                document.execCommand('Copy');
                alert('Copied to Clipboard~');
            }
        });

        // custom styles
        $('#advanced-themes-toggle').on('click', function (e) {
            e.preventDefault();
            $('#advanced-themes').toggleClass('hidden');
            $(this).toggleClass('advanced-themes-toggle-on');
        });
        $('#custom-save').on('click', function (e) {
            e.preventDefault();
            var css = $('#custom-css').val().trim();
            var js = $('#custom-js').val().trim();
            var obj = {};
            obj['GLB_CustomCSS'] = css;
            obj['GLB_CustomJS'] = js;
            saveOption(obj);

        });
        $('#custom-clear').on('click', function (e) {
            e.preventDefault();

            var r = confirm('Do you want to clear the custom CSS and JS code above?');
            if (r == false)
                return;

            $('#custom-css').val('');
            $('#custom-js').val('');

            var obj = {};
            obj['GLB_CustomCSS'] = '';
            obj['GLB_CustomJS'] = '';

            saveOption(obj);
        });
        $('#custom-css, #custom-js').on('keydown', function (event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        $('#custom-save').trigger('click');
                        break;
                }
            }
        });

        // course thumbs
        $('#add-course-thumbnail').on('click', function (e) {
            e.preventDefault();
            if (typeof $(this).attr('disabled') !== typeof undefined) {
                alert('IndexedDB has not been initialized yet. Please wait.');
                return;
            }
            var popupCls = initPopup('Add Custom Cover Picture', $(this), 'popup-wide');
            var popup = $('.' + popupCls);
            var reader = new FileReader(),
                imgL = popup.find('.cthumb-prev-1'),
                imgR = popup.find('.cthumb-prev-2'),
                prevBlk = popup.find('.course-thumb-preview'),
                fileNm = popup.find('.input-file-name'),
                container = popup.find('.popup-content'),
                alertBlock = container.find('.alert-file-size'),
                alertContent = alertBlock.find('.alert');
            var thumbBase64 = '';

            // params
            if (params['action'] === 'add-custom-cover') {
                if (params['course-id'] !== undefined) {
                    popup.find('.course-id').val(params['course-id']);
                    popup.find('.course-code').focus();
                }
                if (params['course-name'] !== undefined) {
                    popup.find('.course-code').val(decodeURIComponent(params['course-name']));
                    popup.find('.thumb-image-url').focus();
                }
                popup.find('.btn-add').removeClass('btn-primary').addClass('btn-default');
            } else {
                popup.find('.btn-add-and-close').remove();
            }
            // type
            popup.find('.thumb-image-type').on('click', function (e) {
                e.preventDefault();

                var type = $(this).attr('data-thumb-type');

                if (type == '0') {
                    popup.find('.thumb-image-file').trigger('change');
                } else if (type == '1') {
                    popup.find('.thumb-image-url').trigger('blur');
                }

                popup.find('.thumb-image-type').removeClass('active');
                $(this).addClass('active');

                popup.find('.thumb-image-type-tab').addClass('hidden');
                popup.find('.thumb-image-type-tab-' + type).removeClass('hidden');

                popup.find('.thumb-image-instr').addClass('hidden');
                popup.find('.thumb-image-instr-' + type).removeClass('hidden');
            });
            // url
            popup.find('.thumb-image-url').on('blur', function () {

                alertBlock.addClass('hidden');

                $(this).val($(this).val().trim());
                var url = $(this).val();
                if (url.trim().match(/^https:\/\//) || url.trim().match(/^http:\/\//)) {
                    imgL.css('background-image', 'url("' + url + '")');
                    imgR.css('background-image', 'url("' + url + '")');
                    prevBlk.removeClass('hidden');
                    thumbBase64 = url;
                    if (url.trim().match(/^http:\/\//)) {
                        alertContent
                            .html('It\'s recommended to use image served over a secure connection, ' +
                                'i.e. its URL starts with "https://".<br>' +
                                'Otherwise, insecure content might be blocked by some browsers.');
                        alertBlock.removeClass('hidden');
                    }
                } else {
                    if (url != '') {
                        alertContent.html('Please enter a valid URL.');
                        alertBlock.removeClass('hidden');
                    }
                    imgL.css('background-image', '');
                    imgR.css('background-image', '');
                    prevBlk.addClass('hidden');
                    thumbBase64 = '';
                }
            });
            // file
            popup.find('.thumb-image-file').on('change', function () {

                alertBlock.addClass('hidden');
                thumbBase64 = '';
                fileNm.text('Choose an image...');
                imgL.css('background-image', '');
                imgR.css('background-image', '');
                prevBlk.addClass('hidden');

                if (this.files && this.files[0]) {
                    if (this.files[0].size > 200 * 1024) {
                        alertContent.html('File size exceeds recommended value. Large image affects extension performance. <br>' +
                            'You may visit <a href="https://imageresize.org" target="_blank">ImageResize</a> or <a ' +
                            'href="https://tinypng.com" target="_blank">TinyPNG</a> to crop & compress images.');
                        alertBlock.removeClass('hidden');
                    }
                    fileNm.text('File: ' + this.files[0].name);
                    reader.onload = function (e) {
                        thumbBase64 = e.target.result;
                        imgL.css('background-image', 'url("' + thumbBase64 + '")');
                        imgR.css('background-image', 'url("' + thumbBase64 + '")');
                    };
                    reader.readAsDataURL(this.files[0]);
                    prevBlk.removeClass('hidden');
                }
            });
            // cancel btn
            popup.find('.btn-cancel').on('click', function (e) {
                e.preventDefault();
                var r = confirm('Are you sure you want to cancel?');
                if (r) {
                    if (params['action'] === 'add-custom-cover') {
                        window.location.href = removeSearchParameters(['action', 'course-id', 'course-name'], true);
                    }
                    removePopup(popupCls);
                }
            });
            // add btn
            popup.find('.btn-add, .btn-add-and-close').on('click', function (e) {
                e.preventDefault();
                var errMsg = '';
                var courseID = popup.find('.course-id').val(),
                    courseCode = popup.find('.course-code').val();
                var needClose = !!$(this).hasClass('btn-add-and-close');

                if (!courseID.match(/^\d+$/)) {
                    errMsg += '- [Course ID] should be an integer.\n';
                }
                if (courseCode.length === 0) {
                    errMsg += '- [Course Name] cannot be empty.\n';
                }
                if (thumbBase64.length === 0) {
                    errMsg += '- Please enter a valid image URL or select an image file.\n';
                }
                if (errMsg.length !== 0) {
                    errMsg = 'Failed to add custom cover picture:\n' + errMsg;
                    alert(errMsg);
                    return;
                }

                browser.runtime.sendMessage({
                    action: 'addCourseThumbs',
                    data: {
                        course_id: courseID,
                        course_code: courseCode,
                        thumb_image: thumbBase64,
                        popup_class: popupCls,
                        need_close: needClose
                    }
                });

            });
        });

        // themes
        $('input[id^="opt-theme-item-"]').on('change', function () {
            $('.theme-item').removeClass('selected');
            $(this).closest('.theme-item').addClass('selected');
            if (welcomeMode) {
                $(this).closest('.container').removeClass(function (index, className) {
                    return (className.match(/(^|\s)theme-container-\d+/g) || []).join(' ');
                }).addClass('theme-container-' + $(this).val());
            }
        });
        $('input.jscolor').each(function (idx, el) {
            new jscolor(el, {
                hash: true,
                borderRadius: 0,
                borderWidth: 0,
                shadowBlur: 5,
                shadowColor: 'rgba(0,0,0,0.3)'
            });
        });

        // fonts
        $('input[id^="opt-font-item-"]').on('change', function () {
            $('.font-item').removeClass('selected');
            $(this).closest('.font-item').addClass('selected');
        });

        // font size
        $('input[id="opt-themes-3-0"]').on('change', function () {
            var currVal = $(this).val();
            $('.font-size-tags span').removeClass('selected');
            $('.font-size-tags span[data-size="' + currVal + '"]').addClass('selected');
        });
        $('.font-size-tags span').on('click', function (e) {
            $('input[id="opt-themes-3-0"]').val(parseInt($(this).attr('data-size'), 10)).trigger('change');
        });

        // import & export
        var importContainer = $('#opt-import-0-0');
        var importTextarea = importContainer.children('textarea');
        importContainer.find('a.btn').on('click', function (e) {
            e.preventDefault();
            try {
                importContainer.addClass('wait');
                var value = importTextarea.val();
                if (value.length === 0) {
                    importContainer.removeClass('wait');
                    return;
                }
                if (!value.startsWith('----------- LEARN DARKLIGHT OPTIONS BEGIN -----------')
                    || !value.endsWith('----------- LEARN DARKLIGHT OPTIONS END -----------')) {
                    throw 'Format error';
                } else {
                    value = value.replace(/-----------.*-----------/g, '').trim();
                    value = JSON.parse(window.atob(value));
                    browser.storage.sync.set(value, function () {
                        alert(importContainer.find('.lang .success').text());
                        window.location.hash = '';
                        window.location.reload();
                    });
                }
            } catch (error) {
                importContainer.removeClass('wait');
                importContainer.find('.import-info-container .import-info')
                    .removeClass('success')
                    .addClass('failed')
                    .text(
                        importContainer.find('.lang .failed').text()
                    );
            }
        });

        var exportContainer = $('#opt-import-1-0');
        var exportTextarea = exportContainer.children('textarea');
        exportContainer.find('a.btn').on('click', function (e) {
            e.preventDefault();
            try {
                exportContainer.addClass('wait');
                browser.storage.sync.get(null, function (items) {
                    exportTextarea.val(
                        '----------- LEARN DARKLIGHT OPTIONS BEGIN -----------\n' +
                        window.btoa(JSON.stringify(items)) +
                        '\n----------- LEARN DARKLIGHT OPTIONS END -----------'
                    );
                    exportContainer.removeClass('wait');
                    exportContainer.find('.import-info-container .import-info')
                        .removeClass('failed')
                        .addClass('success')
                        .text(
                            exportContainer.find('.lang .success').text()
                        );
                    exportTextarea.select();
                    document.execCommand('Copy');
                });
            } catch (error) {
                exportContainer.removeClass('wait');
                exportContainer.find('.import-info-container .import-info')
                    .removeClass('success')
                    .addClass('failed')
                    .text(
                        exportContainer.find('.lang .failed').text()
                    );
            }
        });

        // scroll
        $(window).on('scroll', function () {
            // if (welcomeMode) return;

            if (!allowHashChange)
                return;

            var top = $(window).scrollTop();
            var currID = 0;
            var tarElem = (welcomeMode === true) ? '.container' : '.section';
            $(tarElem).each(function (index, elem) {
                if ($(elem).offset().top + $(elem).outerHeight() - $(window).height() / 3 > top) {
                    currID = $(this).attr('data-option-index');
                    return false;
                }
            });

            $('.nav-tab').removeClass('active');
            $('#nav-tab-' + currID).addClass('active');

            window.location.hash = $('#nav-tab-' + currID).attr('data-option-tab-name');

            if (welcomeMode) {
                if (top >= $('#opt-tab-1').offset().top) {
                    renderStars.aniPlay = false;
                } else {
                    renderStars.aniPlay = true;
                }
            }
        });

        // whats new
        if (params.hasOwnProperty('whatsnew')) {
            newFeatureGuide();
        }

        // new welcome page
        if (welcomeMode === true) {
            // home
            window.location.hash = '';
            // start tour
            $('#home-btn').on('click', function (e) {
                e.preventDefault();
                scrollToUtil($('#theme-list').closest('.container'), 600);
            });
            // font preview
            var fontPre = document.getElementById('font-preview');
            fontPre.attachShadow({mode: 'open'});
            fontPre.shadowRoot.innerHTML = '<div>The quick brown fox jumps over the lazy dog.</div>';
            updateFontPreview('common', ':host div{line-height:70px;}');
            updateFontPreview('family', options.GLB_CustomFontInfo);
            updateFontPreview('size', options.GLB_BasicFontSize);
            // homepage / course preview
            var optArr = ['HOME_AddCalendar', 'HOME_SwitchAnnounceAndCalendar', 'HOME_AutoHideSysAlert', 'HOME_HideCheckMySys', 'HOME_HidePrivacy',
                'HOME_HideCoverPic', 'HOME_HideMetaTerm', 'HOME_HideMetaEndDate', 'HOME_HidePinnedIcon', 'HOME_HideCourseTabSelector'];
            for (var idx in optArr) {
                updateWelcomePreview(optArr[idx]);
                $('input[data-option-name="' + optArr[idx] + '"]').on('change', function () {
                    updateWelcomePreview($(this).attr('data-option-name'));
                });
            }
            // finish
            $('#finish-tour').on('click', function (e) {
                e.preventDefault();
                // window.close();
                browser.tabs.getCurrent(function (tab) {
                    browser.tabs.remove(tab.id, function () {
                    });
                });
            });
            // home bg
            renderStars();
        }

        // message listener
        browser.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {

                if (request.action == 'getCourseThumbsResponse') {

                    var thumbList = $('#saved-thumb-list');
                    thumbList.html('').attr('data-list-init', '1');

                    if (!request.data.length) {
                        thumbList.html('None');
                    } else {

                        function sortCourse(a, b) {
                            if (a.course_code < b.course_code)
                                return -1;
                            if (a.course_code > b.course_code)
                                return 1;
                            return 0;
                        }

                        request.data.sort(sortCourse);

                        request.data.forEach(function (item, index) {
                            $('<div class="saved-thumb-item" data-course-id="' + item.course_id + '" style="background-image: url(' + item.thumb_image + ')">' +
                                '<div class="saved-thumb-item-tip">Delete</div>' +
                                '<div class="saved-thumb-item-title">' + item.course_code +
                                '<small>( ID: ' + item.course_id + ' )</small></div>' +
                                '<div>').appendTo(thumbList);
                        });

                        $('.saved-thumb-item-tip').on('click', function (e) {
                            var r = confirm('Are you sure you want to delete this custom cover picture?');
                            if (r) {
                                browser.runtime.sendMessage({
                                    action: 'deleteCourseThumbs',
                                    data: {
                                        course_id: $(this).parent('.saved-thumb-item').attr('data-course-id')
                                    }
                                });
                            }
                        });
                    }
                } else if (request.action == 'addCourseThumbsResponse') {

                    if (request.data.err_code === 0) {
                        if (request.data.data.need_close === true) {
                            alert(request.data.data.msg + '.\nRefresh to apply the changes.');
                            browser.tabs.getCurrent(function (tab) {
                                browser.tabs.remove(tab.id, function () {
                                });
                            });
                            return;
                        } else if (params['action'] === 'add-custom-cover') {
                            alert(request.data.data.msg);
                            window.location.href = removeSearchParameters(['action', 'course-id', 'course-name'], true);
                            return;
                        }
                        showToast(request.data.data.msg);
                        refreshThumbList();
                        removePopup(request.data.data.popup_class);
                    } else {
                        alert(request.data.err_msg);
                    }

                } else if (request.action == 'deleteCourseThumbsResponse') {
                    showToast(request.data.msg);
                    refreshThumbList();
                }

            }
        );

    }

    function loadThemes() {
        var themes = getThemeConfigs();
        var list = $('#theme-list');
        var index = 0;
        $.each(themes, function (i, val) {

            if (val['hidden'] !== true) {
                var elem_img = '<img src="../theme/theme_' + val['id'] + '/preview.png" alt="' + val['name'] + '" title="' + val['name'] + '">',
                    elem_title = '<div class="theme-name" title="' + val['name'] + '">' + val['name'] + '</div>',
                    elem_color = '<div class="theme-color" style="background:' + val['previewColor'] + '"></div>',
                    elem_info = '<div class="theme-info" title="' + val['author'] + '">Author / ' + val['author'] + '</div>',
                    elem_input = '<input type="radio" ' +
                        'id="opt-theme-item-' + index + '" ' +
                        'name="GLB_ThemeID" ' +
                        'value="' + val['id'] + '" ' +
                        'data-option-name="GLB_ThemeID" ' +
                        'data-option-type="enum">',
                    elem_label = '<label for="opt-theme-item-' + index + '" class="btn btn-primary"></label>';

                var elem_content = '<div class="theme-content">' + elem_title + elem_color + elem_info + elem_input + elem_label + '</div>';

                var elem_extra_cls = '';
                var elem_new_tag = '';
                if (val['isNew'] === true) {
                    elem_extra_cls = ' theme-item-new';
                    elem_new_tag = '<div class="theme-item-new-tag">NEW THEME</div>';
                }

                var elem_complete = $('<div class="theme-item theme-item-' + val['id'] + elem_extra_cls + '" id="theme-item-' + val['id'] + '">' +
                    elem_new_tag +
                    '<div class="theme-item-wrapper">' + elem_img + elem_content + '</div></div>');
                if (val['isNew'] === true)
                    elem_complete.prependTo(list);
                else
                    elem_complete.appendTo(list);

                // theme options
                if (val['options'] !== undefined) {
                    var themeCustomConf = {};

                    for (var i in val['options']) {
                        themeCustomConf['THEME_ID_' + val['id'] + '_OPT_' + val['options'][i]['key']] = val['options'][i]['value'];
                    }

                    browser.storage.sync.get(themeCustomConf, function (tConfigs) {

                        // add title
                        var confElems = '<h3>' + val['name'] + ' Addtional Options</h3><div class="margin-y">';

                        // create and add elem for each opt
                        for (var i in val['options']) {

                            var elemID = 'theme-id-' + val['id'] + '-opt-' + val['options'][i]['key'];
                            var optName = 'THEME_ID_' + val['id'] + '_OPT_' + val['options'][i]['key'];

                            if (val['options'][i]['type'] == 'boolean') {

                                var isChecked = tConfigs[optName] ? ' checked' : '';
                                confElems += '<div class="option-group checkbox-group">' +
                                    '<div class="checkbox-slide">' +
                                    '<input type="checkbox" id="' + elemID + '" data-option-name="' + optName + '" data-option-type="switch"' + isChecked + '>' +
                                    '<label for="' + elemID + '"></label></div>' +
                                    '<div class="checkbox-content">' +
                                    '<label for="' + elemID + '" class="checkbox-label">' + val['options'][i]['description'] + '</label>' +
                                    '</div></div>';

                            } else if (val['options'][i]['type'] == 'color') {

                                confElems += '<div class="option-group input-group">'
                                confElems += '<label for="' + elemID + '" class="input-label">' + val['options'][i]['description'] + '<br><small>Leave empty to reset to default</small></label>';
                                confElems += '<input type="text" minlength="4" maxlength="30" class="input-box block width-100 jscolor" id="' + elemID + '" ' +
                                    'data-option-name="' + optName + '" data-option-type="color" data-save-on-blur="true" data-default-value="' + val['options'][i]['value'] + '"' +
                                    'value="' + tConfigs[optName] + '" placeholder="e.g. ' + val['options'][i]['value'] + '">';
                                confElems += '</div>';

                            } else if (val['options'][i]['type'] == 'enum') {

                                var defaultVal = tConfigs[optName];
                                var isChecked = '';
                                confElems += '<div class="option-group radio-group">';
                                confElems += '<div class="radio-title">' + val['options'][i]['description'] + '</div>';
                                val['options'][i]['items'].forEach(function (v, idx) {
                                    isChecked = (v['name'] === defaultVal) ? 'checked' : '';
                                    confElems += '<div class="radio-item">';
                                    confElems += '<input type="radio" id="' + elemID + '-' + idx + '" name="' + optName + '" value="' + v['name'] + '" data-option-name="' + optName + '" data-option-type="enum" ' + isChecked + '>';
                                    confElems += '<label for="' + elemID + '-' + idx + '">' + v['description'] + '</label>';
                                    confElems += '</div>';
                                });
                                confElems += '</div>';

                            } else if (val['options'][i]['type'] == 'text') {

                            } else if (val['options'][i]['type'] == 'separator') {
                                confElems += '<hr>';
                            }
                        }

                        // add close button
                        confElems += '</div><div class="popup-btn-group"><a href="#" class="popup-btn popup-btn-black">Close</a></div>';

                        // create and add opt btn & content to page
                        var tOptElem = $('<div class="theme-options" title="Theme Options"><div></div><div></div><div></div></div>');
                        tOptElem.appendTo('#theme-item-' + val['id']);

                        var tOptContent = $('<div class="theme-options-container hidden"><div class="theme-options-content">' + confElems + '</div></div>');
                        tOptContent.insertAfter(tOptElem);

                        tOptElem.on('click', function (e) {
                            e.preventDefault();
                            var popCls = initPopup('Theme Options', tOptContent.find('.theme-options-content'), '', 2);
                            var popBtn = $('.' + popCls).find('.popup-btn');
                            popBtn.off('click');
                            popBtn.on('click', function (e) {
                                e.preventDefault();
                                removePopup(popCls);
                            });
                        });

                    });
                }
            }

            index++;
        });
    }

    function loadContextMenuList() {
        var key = 'HOME_CourseTileContextMenuData';
        var tplList = getOptionListDefault()[key];
        var el = '';
        var idx = 0;
        tplList.forEach(function (cl) {
            el += '<div class="option-group checkbox-group checkbox-group-square margin-top-10 inline-block width-25 pull-left">';
            el += '<div class="group-title full-width">' + cl.name + '</div>';
            cl.list.forEach(function (c) {

                el += '<div class="checkbox-item"><div class="checkbox-square">' +

                    '<input type="checkbox" id="opt-course-tile-context-menu-items-' + idx + '" ' +
                    'data-option-name="' + key + '" ' +
                    'data-option-type="item-tile-context-menu" ' +
                    'data-menu-group="' + cl.name + '" ' +
                    'data-menu-name="' + c.name + '">' +

                    '<label for="opt-course-tile-context-menu-items-' + idx + '"></label></div>' +
                    '<div class="checkbox-content"><label for="opt-course-tile-context-menu-items-' + idx + '" class="checkbox-label">' + c.name + '</label></div></div>';
                idx++;
            });
            el += '</div>';
        });
        $(el).appendTo($('#course-tile-context-menu-items-container'));
    }

    function loadFontList() {
        var li = getFontConfigs();
        var i;
        var el = '';
        for (i = 0; i < li.length; i++) {
            var weightInfo = '';
            if (li[i].weight !== undefined) weightInfo = ' data-font-weight="' + li[i].weight + '"';
            var sizeInfo = '';
            if (li[i].size !== undefined) sizeInfo = ' data-font-size="' + li[i].size + '"';
            var sourceInfo = '';
            if (li[i].source !== undefined) sourceInfo = ' data-font-source="' + li[i].source + '"';
            el += '<label for="opt-font-item-' + i + '" class="font-item" title="' + li[i].name + '">' +
                '<input type="radio" id="opt-font-item-' + i + '" name="GLB_CustomFontInfo" value="' + li[i].name + '" ' +
                'data-option-name="GLB_CustomFontInfo" data-option-type="enum-font" ' +
                weightInfo + sizeInfo + sourceInfo + '>' +
                '<img src="../img/' + li[i].image + '" alt="' + li[i].name + '"></label>';
        }
        $(el).appendTo($('#font-list'));
    }

    function updateFontPreview(attribute, data) {

        var fontPre = document.getElementById('font-preview');
        if (fontPre === null) return;

        if (attribute === 'family') {

            var styFamLink = document.getElementById('style-family-link');
            if (styFamLink === null) {
                styFamLink = document.createElement('link');
                styFamLink.rel = 'stylesheet';
                styFamLink.id = 'style-family-link';
                document.querySelector('head').append(styFamLink);
            }

            var styFam = fontPre.shadowRoot.getElementById('style-family');
            if (styFam === null) {
                styFam = document.createElement('style');
                styFam.id = 'style-family';
                fontPre.shadowRoot.append(styFam);
            }

            var fontConf = data.split('||');
            var fontURL = '';

            // fontName||weights||fontSize||source
            if (fontConf[0].match(/Default/i) || fontConf[0].match(/^Lato$/i)) {
                fontURL = '//fonts.googleapis.com/css?family=Lato:400,700';
            } else if (fontConf.length == 4) {
                // name, weights, size, source
                if (fontConf[3] == 'google') {
                    fontURL = '//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1];
                } else if (fontConf[3] == 'none') {

                } else {
                    fontURL = '//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1];
                }
            } else if (fontConf.length == 3) {
                // name, weights, size
                fontURL = '//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1];
            } else {
                // name only
                fontURL = '//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':200,400,600,800';
            }

            styFamLink.href = 'https:' + fontURL;
            styFam.textContent = ':host{font-family:"' + fontConf[0] + '"}';

        } else if (attribute === 'size') {

            var styleSize = fontPre.shadowRoot.getElementById('style-size');
            if (styleSize === null) {
                styleSize = document.createElement('style');
                styleSize.id = 'style-size';
                fontPre.shadowRoot.append(styleSize);
            }
            styleSize.textContent = ':host{font-size:' + data + 'px;}';

        } else if (attribute === 'common') {

            var styleCommon = fontPre.shadowRoot.getElementById('style-common');
            if (styleCommon === null) {
                styleCommon = document.createElement('style');
                styleCommon.id = 'style-common';
                fontPre.shadowRoot.append(styleCommon);
            }
            styleCommon.textContent = data;
        }
    }

    function updateWelcomePreview(attribute) {
        var homePre = $('#homepage-preview');
        var coursePre = $('#course-preview');
        var self = $('input[data-option-name="' + attribute + '"]');
        switch (attribute) {
            case 'HOME_AddCalendar':
                if (self.prop('checked')) {
                    homePre.find('.calendar').removeClass('hidden');
                    if ($('input[data-option-name="HOME_SwitchAnnounceAndCalendar"]').prop('checked')) {
                        homePre.find('.calendar').text('Announcements');
                        homePre.find('.announcements').text('Calendar');
                    } else {
                        homePre.find('.calendar').text('Calendar');
                        homePre.find('.announcements').text('Announcements');
                    }
                } else {
                    homePre.find('.calendar').addClass('hidden');
                    homePre.find('.calendar').text('Calendar');
                    homePre.find('.announcements').text('Announcements');
                }
                break;
            case 'HOME_SwitchAnnounceAndCalendar':
                if (self.prop('checked') && $('input[data-option-name="HOME_AddCalendar"]').prop('checked')) {
                    homePre.find('.calendar').text('Announcements');
                    homePre.find('.announcements').text('Calendar');
                } else {
                    homePre.find('.calendar').text('Calendar');
                    homePre.find('.announcements').text('Announcements');
                }
                break;
            case 'HOME_AutoHideSysAlert':
                if (self.prop('checked')) homePre.find('.sys-alert').addClass('hidden');
                else homePre.find('.sys-alert').removeClass('hidden');
                break;
            case 'HOME_HideCheckMySys':
                if (self.prop('checked')) homePre.find('.sys-check').addClass('hidden');
                else homePre.find('.sys-check').removeClass('hidden');
                break;
            case 'HOME_HidePrivacy':
                if (self.prop('checked')) homePre.find('.privacy').addClass('hidden');
                else homePre.find('.privacy').removeClass('hidden');
                break;
            case 'HOME_HideCoverPic':
                if (self.prop('checked')) coursePre.find('.card-thumb').addClass('hidden');
                else coursePre.find('.card-thumb').removeClass('hidden');
                break;
            case 'HOME_HideMetaTerm':
                if (self.prop('checked')) coursePre.find('.card-term').addClass('hidden');
                else coursePre.find('.card-term').removeClass('hidden');
                break;
            case 'HOME_HideMetaEndDate':
                if (self.prop('checked')) coursePre.find('.card-end').addClass('hidden');
                else coursePre.find('.card-end').removeClass('hidden');
                break;
            case 'HOME_HidePinnedIcon':
                if (self.prop('checked')) coursePre.find('.card-pin').addClass('hidden');
                else coursePre.find('.card-pin').removeClass('hidden');
                break;
            case 'HOME_HideCourseTabSelector':
                if (self.prop('checked')) coursePre.find('.tabs').addClass('hidden');
                else coursePre.find('.tabs').removeClass('hidden');
                break;
            default:
                break;
        }
    }

    function renderStars() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight,
            MAX_PARTICLES = WIDTH / 5,
            DRAW_INTERVAL = 60,
            container = document.querySelector('#star-container'),
            canvas = document.querySelector('#star'),
            context = canvas.getContext('2d'),
            gradient = null,
            pixies = new Array();
        renderStars.aniPlay = true;

        function setDimensions() {
            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;
            container.style.width = WIDTH + 'px';
            container.style.height = HEIGHT + 'px';
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
        }

        setDimensions();
        window.addEventListener('resize', setDimensions);

        function Circle() {
            this.settings = {
                ttl: 8000,
                xmax: 5,
                ymax: 2,
                rmax: 12,
                rt: 1,
                xdef: 960,
                ydef: 540,
                xdrift: 4,
                ydrift: 4,
                random: true,
                blink: true
            };

            this.reset = function () {
                this.x = (this.settings.random ? WIDTH * Math.random() : this.settings.xdef);
                this.y = (this.settings.random ? HEIGHT * Math.random() : this.settings.ydef);
                this.r = ((this.settings.rmax - 1) * Math.random()) + 1;
                this.dx = (Math.random() * this.settings.xmax) * (Math.random() < .5 ? -1 : 1);
                this.dy = (Math.random() * this.settings.ymax) * (Math.random() < .5 ? -1 : 1);
                this.hl = (this.settings.ttl / DRAW_INTERVAL) * (this.r / this.settings.rmax);
                this.rt = Math.random() * this.hl;
                this.settings.rt = Math.random() + 1;
                this.stop = Math.random() * .2 + .4;
                this.settings.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
                this.settings.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
            }

            this.fade = function () {
                this.rt += this.settings.rt;
            }

            this.draw = function () {
                if (this.settings.blink && (this.rt <= 0 || this.rt >= this.hl)) {
                    this.settings.rt = this.settings.rt * -1;
                } else if (this.rt >= this.hl) {
                    this.reset();
                }

                var newo = 1 - (this.rt / this.hl);
                context.beginPath();
                context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
                context.closePath();

                var cr = this.r * newo;
                gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
                gradient.addColorStop(0.0, 'rgba(255,255,255,' + newo + ')');
                gradient.addColorStop(this.stop, 'rgba(80,80,80,' + (newo * .6) + ')');
                gradient.addColorStop(1.0, 'rgba(80,80,80,0)');
                context.fillStyle = gradient;
                context.fill();
            }

            this.move = function () {
                this.x += (this.rt / this.hl) * this.dx;
                this.y += (this.rt / this.hl) * this.dy;
                if (this.x > WIDTH || this.x < 0) this.dx *= -1;
                if (this.y > HEIGHT || this.y < 0) this.dy *= -1;
            }

            this.getX = function () {
                return this.x;
            }
            this.getY = function () {
                return this.y;
            }
        }

        for (var i = 0; i < MAX_PARTICLES; i++) {
            pixies.push(new Circle());
            pixies[i].reset();
        }

        function draw() {
            if (renderStars.aniPlay === false) return;
            context.clearRect(0, 0, WIDTH, HEIGHT);
            for (var i = 0; i < pixies.length; i++) {
                pixies[i].fade();
                pixies[i].move();
                pixies[i].draw();
            }
        }

        setInterval(draw, DRAW_INTERVAL);

    }

    function getSearchParameters() {

        // stack overflow 5448545
        function _transformToAssocArray(prmstr) {
            var paramsO = {};
            var prmarr = prmstr.split("&");
            for (var i = 0; i < prmarr.length; i++) {
                var tmparr = prmarr[i].split("=");
                paramsO[tmparr[0]] = tmparr[1];
            }
            return paramsO;
        }

        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? _transformToAssocArray(prmstr) : {};
    }

    function removeSearchParameters(sParam, keepHash, fromString) {

        var hash = window.location.hash;

        var url = window.location.href.split('?')[0] + '?';
        if (typeof fromString !== typeof undefined) url = fromString.split('?')[0] + '?';

        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (Array.isArray(sParam)) {
                var matched = false;
                sParam.forEach(function (pr) {
                    if (sParameterName[0] == pr) {
                        matched = true;
                    }
                });
                if (!matched) {
                    url = url + sParameterName[0] + '=' + sParameterName[1] + '&';
                }
            } else {
                if (sParameterName[0] != sParam) {
                    url = url + sParameterName[0] + '=' + sParameterName[1] + '&';
                }
            }
        }

        if (keepHash !== true) {
            return url.substring(0, url.length - 1);
        } else {
            return url.substring(0, url.length - 1) + hash;
        }
    }

    function processSearchParameters() {
        // jump to
        if (params['section'] !== undefined) {
            window.location.hash = params['section'];
        }

        if (params['action'] !== undefined) {
            var action = params['action'];
            if (action == 'add-custom-cover') {
                blockPage('', 'Just a second', 0);
            }
        }
    }

    function newFeatureGuide(currState) {

        function _focusElement(el, padding, floatDialog) {
            function _setCSS() {
                var elT = el.offset().top - padding[0],
                    elL = el.offset().left - padding[3],
                    elW = el.outerWidth() + padding[3] + padding[1],
                    elH = el.outerHeight() + padding[0] + padding[2],
                    winT = $(window).scrollTop(),
                    winW = $(window).width(),
                    winH = $(window).height(),
                    docH = $(document).height();
                var b1T = 0,
                    b1L = 0,
                    b1W = winW,
                    b1H = elT,
                    b2T = b1H,
                    b2L = elL + elW,
                    b2W = winW - b2L,
                    b2H = docH - b1H,
                    b3T = b1H + elH,
                    b3L = 0,
                    b3W = b2L,
                    b3H = docH - b1H - elH,
                    b4T = b1H,
                    b4L = 0,
                    b4W = elL,
                    b4H = elH,
                    bsT = b1H,
                    bsL = elL,
                    bsW = elW,
                    bsH = elH;
                b1.css({top: b1T + 'px', left: b1L + 'px', width: b1W + 'px', height: b1H + 'px'});
                b2.css({top: b2T + 'px', left: b2L + 'px', width: b2W + 'px', height: b2H + 'px'});
                b3.css({top: b3T + 'px', left: b3L + 'px', width: b3W + 'px', height: b3H + 'px'});
                b4.css({top: b4T + 'px', left: b4L + 'px', width: b4W + 'px', height: b4H + 'px'});
                bs.css({top: bsT + 'px', left: bsL + 'px', width: bsW + 'px', height: bsH + 'px'});
                if (typeof floatDialog !== typeof undefined) {
                    var flW = floatDialog.outerWidth(),
                        flH = flL + floatDialog.outerHeight(),
                        flT = b3T + 20,
                        flL = b4W + (elW / 2) - (flW / 2);
                    if (flL < 0) {
                        flL = 10;
                    } else if (flL + flW > winW) {
                        flL = winW - flW - 10;
                    }
                    if (winW <= 567) {
                        floatDialog.addClass('update-dialog-fixed-bottom').css({top: '', left: ''});
                    } else {
                        floatDialog.removeClass('update-dialog-fixed-bottom').css({top: flT + 'px', left: flL + 'px'});
                    }
                }
            }

            $('#elem-focus-overlay-container').remove();

            if (typeof el === typeof undefined && isFullScr !== true) {
                return;
            } else if (isFullScr === true) {
                $('<div id="elem-focus-overlay-container" class="elem-focus-overlay-container">' +
                    '<div class="elem-focus-overlay elem-focus-overlay-fixed"></div>' +
                    '</div>').appendTo('body');
                floatDialog.addClass('fixed-center');
                scrollToUtil('body', 0);
                return;
            }

            if (padding === undefined || !Array.isArray(padding))
                padding = [0, 0, 0, 0];

            var b, b1, b2, b3, b4, bs;
            b = $('<div id="elem-focus-overlay-container" class="elem-focus-overlay-container"></div>');
            b1 = $('<div class="elem-focus-overlay"></div>');
            b2 = $('<div class="elem-focus-overlay"></div>');
            b3 = $('<div class="elem-focus-overlay"></div>');
            b4 = $('<div class="elem-focus-overlay"></div>');
            bs = $('<div class="elem-focus-overlay-shadow"></div>');

            b1.appendTo(b);
            b2.appendTo(b);
            b3.appendTo(b);
            b4.appendTo(b);
            bs.appendTo(b);

            var offset = $(window).height() * 0.2;
            scrollToUtil(el, 0, offset, function () {
                _setCSS();
                b.appendTo($('body'));
            });

            $(window).on('resize', function () {
                offset = $(window).height() * 0.2;
                scrollToUtil(el, 0, offset, function () {
                    _setCSS();
                });
            });
        }

        function _getDialog(title, content, image) {
            if (typeof image === typeof undefined)
                image = '';
            else
                image = '<div class="dialog-banner"><img src="../img/update/' + image + '" alt="Banner"></div>';

            var extraClass = '';
            if (isFullScr === true) extraClass = ' no-arrow';
            var elem = '<div class="update-dialog' + extraClass + '">' +
                '<div class="tag"></div>' +
                image +
                '<div class="dialog-title">' + title + '</div>' +
                '<div class="dialog-content">' + content + '</div>' +
                '<div class="dialog-action">' +
                '<a href="#" class="btn pull-left btn-prev">Back</a>' +
                '<a href="#" class="btn btn-primary pull-right btn-next">Next</a>' +
                '<div class="page"></div>' +
                '</div></div>';
            elem = $(elem);
            elem.find('.close').on('click', _skipGuide);
            return elem;
        }

        function _nextGuide(e) {
            e.preventDefault();
            $('.update-dialog').remove();
            $('.update-dialog-close').remove();
            newFeatureGuide(++currState);
        }

        function _prevGuide(e) {
            e.preventDefault();
            $('.update-dialog').remove();
            $('.update-dialog-close').remove();
            newFeatureGuide(--currState);
        }

        function _finishGuide(e) {
            e.preventDefault();
            window.location.href = removeSearchParameters('whatsnew');
        }

        function _skipGuide(e) {
            e.preventDefault();
            var r = confirm('Do you want to skip the new feature guide?');
            if (r) {
                window.location.href = removeSearchParameters('whatsnew');
            }
        }

        if (typeof currState === typeof undefined) currState = 0;
        var dialog = null;

        // parse target elem
        var targetElem;
        var targetElemTxt = updateLog[currState].targetElem;
        var isFullScr = false;
        if (targetElemTxt !== null) {
            targetElemTxt = targetElemTxt.split('<');
            if (targetElemTxt.length > 1) {
                var i;
                for (i = 0; i < targetElemTxt.length; i++) {
                    if (i == 0)
                        targetElem = $(targetElemTxt[i].trim());
                    else
                        targetElem = targetElem.closest(targetElemTxt[i].trim());
                }
            } else {
                targetElem = $(targetElemTxt[0].trim());
            }
        } else {
            isFullScr = true;
        }

        // dialog
        var dialog;
        dialog = _getDialog(updateLog[currState].title, updateLog[currState].desc, updateLog[currState].image);
        if (currState == 0) {
            dialog.find('.btn-next').on('click', _nextGuide);
            dialog.find('.btn-prev').remove();
        } else if (currState == updateLog.length - 1) {
            dialog.find('.btn-next').text('Finish').on('click', _finishGuide);
            dialog.find('.btn-prev').on('click', _prevGuide);
        } else {
            dialog.find('.btn-next').on('click', _nextGuide);
            dialog.find('.btn-prev').on('click', _prevGuide);
        }
        dialog.find('.page').text((currState + 1) + ' / ' + updateLog.length);
        dialog.appendTo($('body'));
        if (isFullScr !== true) dialog.addClass('animated fadeInUp');
        dialog.find('.btn-next').focus();

        $('<div class="update-dialog-close">Skip</div>')
            .on('click', _skipGuide).appendTo($('body'));

        // focus elem
        _focusElement(targetElem, updateLog[currState].offset, dialog);

    }

    var params = getSearchParameters();
    var welcomeMode = false;
    if (window.location.href.match(/welcome\.html/)) welcomeMode = true;

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {
    }, 0);

    $(window).on('load', function (e) {

        $('*[data-href]').each(function (idx, elem) {
            $(elem).attr('href', getLink($(elem).attr('data-href')));
        });

        processSearchParameters();

        loadThemes();
        loadFontList();
        loadContextMenuList();

        restoreOptions();

        // version #
        $('#darklight-version').text(browser.runtime.getManifest().version);

        // feedback
        $('#feedback-link').attr('href', getFeedbackLink());

        // clipboard input
        var clipBoardInput = $('<div class="width-0 fixed"><input type="text" id="clipboard-input"></div>');
        if (!welcomeMode) $('body').append(clipBoardInput);

    });

}

var updateLog = [
    {
        targetElem: null,
        image: 'v3.jpg',
        title: 'Learn Darklight Updated',
        desc: 'Click next to view new features in this update.',
        offset: 0
    }, {
        targetElem: '#theme-item-4',
        image: 'theme.png',
        title: 'Modern Waterloo Theme',
        desc: 'Get consistent experiences across sites.<br>' +
            '<span style="color: #f4ad24; font-weight: bold;">Click the 3-dot button to view theme options.</span>',
        offset: 0
    }, {
        targetElem: '#opt-general-1-5 < .option-group',
        image: 'icon.jpg',
        title: 'White / Black icon',
        desc: 'Make Darklight icon visible and easier to find under dark browser themes.',
        offset: [40, 10, 5, 10]
    }, {
        targetElem: '#opt-courses-1-4 < .group-content',
        title: 'Customize course home',
        desc: 'Make it convenient to browse course contents.',
        offset: [10, 10, 0, 10]
    }, {
        targetElem: '#dlight-gallery',
        image: 'pd.jpg',
        title: 'New images added to gallery',
        desc: 'Image sets of multiple themes for course cover pics.<br>And special love for PD (づ￣ 3￣)づ',
        offset: [5, 5, 5, 5]
    }, {
        targetElem: null,
        image: 'dlight.jpg',
        title: 'More Improvements',
        desc: '- Homepage course widget appears more smoothly<br>' +
            '- Minor adjustments to themes<br>' +
            '- Modified keep session alive code<br>' +
            '- Performance improvements<br>' +
            '- If you find any bugs, please click the Darklight icon on browser toolbar and report',
        offset: [5, 5, 5, 5]
    }
];

initOptions();
