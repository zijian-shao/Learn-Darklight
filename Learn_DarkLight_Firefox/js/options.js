function initOptions() {

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

    function scrollToUtil(pos, time, offset) {

        if ($.type(offset) !== 'number')
            offset = 0;

        if ($.type(pos) === 'object')
            pos = pos.offset().top;
        else if ($.type(pos) === 'string')
            pos = $(pos).first().offset().top;

        $('html').animate({scrollTop: pos - offset}, time);

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
        template.find('.popup-frame').addClass('bounceIn animated');
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
                        $('.font-size-tags span:nth-child(' + (items[key] - 10) + ')').addClass('selected');
                        break;

                    default:
                        if (typeof items[key] == typeof true)
                            optionElem.prop('checked', items[key]);
                        else
                            optionElem.val(items[key]);
                }

            }

            bindEvents();
        });

        // local
        setTimeout(function () {
            var interval = setInterval(function () {
                var thumbList = $('#saved-thumb-list');
                if (typeof thumbList.attr('data-list-init') === typeof undefined) {
                    refreshThumbList();
                } else {
                    clearInterval(interval);
                    $('#add-course-thumbnail').removeAttr('disabled');
                    var params = getSearchParameters();
                    if (params['action'] === 'add-custom-cover') {
                        unblockPage(0);
                        scrollToUtil($('#opt-courses-0-0').closest('div.group'), 0, 30);
                        $('#add-course-thumbnail').trigger('click');
                    }
                }
            }, 500);
        }, 1000);

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
        }

        else if (inputType == 'radio') {

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
                    saveOption(obj);
                    break;
            }
        }

        else if (inputType == 'text') {

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
        }

        else if (inputType == 'range') {

            switch (optType) {

                case 'slider':

                    var obj = {};
                    obj[optName] = elem.val();
                    saveOption(obj);

                    break;

                default:
            }
        }
    }

    function bindEvents() {

        var allowHashChange = true;
        var params = getSearchParameters();

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
            var params = getSearchParameters();

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
            popup.find('.btn-add').on('click', function (e) {
                e.preventDefault();
                var errMsg = '';
                var courseID = popup.find('.course-id').val(),
                    courseCode = popup.find('.course-code').val();

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
                        popup_class: popupCls
                    }
                });

            });
        });

        // themes
        $('input[id^="opt-theme-item-"]').on('change', function () {
            $('.theme-item').removeClass('selected');
            $(this).closest('.theme-item').addClass('selected');
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
            $('.font-size-tags span:nth-child(' + (currVal - 10) + ')').addClass('selected');
        });
        $('.font-size-tags span').on('click', function (e) {
            $('input[id="opt-themes-3-0"]').val(parseInt($(this).text(), 10)).trigger('change');
        });

        // scroll
        $(window).on('scroll', function () {
            if (!allowHashChange)
                return;

            var top = $(window).scrollTop();
            var currID = 0;
            $('.section').each(function (index, elem) {
                if ($(elem).offset().top + $(elem).outerHeight() - $(window).height() / 3 > top) {
                    currID = $(this).attr('data-option-index');
                    return false;
                }
            });

            $('.nav-tab').removeClass('active');
            $('#nav-tab-' + currID).addClass('active');

            window.location.hash = $('#nav-tab-' + currID).attr('data-option-tab-name');
        });

        // whats new
        if (params.hasOwnProperty('whatsnew')) {
            var whatsnew = $('#whatsnew-content').clone();
            whatsnew.removeAttr('id').removeClass('hidden');
            var popupCls = initPopup('Learn Darklight', whatsnew, '', 1);
            $('.' + popupCls).find('.popup-btn').on('click', function (e) {
                e.preventDefault();
                window.location.href = removeSearchParameters('whatsnew', true);
            });
        }

        // welcome
        if (params.hasOwnProperty('welcome')) {
            var welcome = $('#welcome-content').clone();
            welcome.removeAttr('id').removeClass('hidden');
            var popupCls = initPopup('Learn Darklight', welcome, '', 1);
            $('.' + popupCls).find('.popup-btn').on('click', function (e) {
                e.preventDefault();
                window.location.href = removeSearchParameters('welcome', true);
            });
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
                }

                else if (request.action == 'addCourseThumbsResponse') {

                    if (request.data.err_code === 0) {
                        if (params['action'] === 'add-custom-cover') {
                            window.location.href = removeSearchParameters(['action', 'course-id', 'course-name'], true);
                        }
                        showToast(request.data.data.msg);
                        refreshThumbList();
                        removePopup(request.data.data.popup_class);
                    } else {
                        alert(request.data.err_msg);
                    }

                }

                else if (request.action == 'deleteCourseThumbsResponse') {
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
                    elem_color = '<div class="theme-color" style="background-color:' + val['previewColor'] + '"></div>',
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
                                confElems += '<label for="' + elemID + '" class="input-label">' + val['options'][i]['description'] + '</label>';
                                confElems += '<input type="text" minlength="4" maxlength="30" class="input-box block width-100" id="' + elemID + '" ' +
                                    'data-option-name="' + optName + '" data-option-type="color" data-save-on-blur="true" data-default-value="' + val['options'][i]['value'] + '"' +
                                    'value="' + tConfigs[optName] + '" placeholder="e.g. ' + val['options'][i]['value'] + '">';
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

    function getSearchParameters() {

        // stack overflow 5448545
        function _transformToAssocArray(prmstr) {
            var params = {};
            var prmarr = prmstr.split("&");
            for (var i = 0; i < prmarr.length; i++) {
                var tmparr = prmarr[i].split("=");
                params[tmparr[0]] = tmparr[1];
            }
            return params;
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
        var params = getSearchParameters();
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
        $('body').append(clipBoardInput);

    });

}

initOptions();
