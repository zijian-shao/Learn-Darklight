function initOptions() {

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
        if (type === 1)
            content2 = content.clone();
        else
            content2 = content.next('.popup-template').first().children().clone();
        if (extraClass === undefined) extraClass = '';

        var template = $('<div class="popup popup-' + rnd + ' ' + extraClass + '">' +
            '<div class="popup-layer"></div>' +
            '<div class="popup-container">' +
            '<div class="popup-frame">' +
            '<div class="popup-title"></div>' +
            '<div class="popup-content"></div>' +
            '</div>' +
            '</div>' +
            '</div>');
        template.find('.popup-title').html(title);
        template.find('.popup-content').html(content2);
        template.appendTo('body');
        template.addClass('popup-show');
        template.find('.popup-layer').addClass('fadeIn animated');
        template.find('.popup-frame').addClass('bounceIn animated');
        return 'popup-' + rnd;
    }

    function removePopup(cls) {
        $('.' + cls).remove();
        if (!$('.popup').length) $('body').removeClass('lock-scroll');
    }

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (!hash.length) hash = 'global';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function refreshThumbList() {

        chrome.runtime.sendMessage({action: 'getCourseThumbs'});

    }

    function restoreOptions() {

        var configs = getOptionListDefault();

        // synced
        chrome.storage.sync.get(configs, function (items) {

            var optionElem;

            for (var key in items) {

                optionElem = $('input[data-option-name="' + key + '"]');

                switch (key) {

                    case 'GLB_ThemeID':
                    case 'GLB_CustomFontInfo':
                        var hasFound = false;
                        if (items[key] === true) {
                            optionElem.first().prop('checked', true);
                            hasFound = true;
                        } else {
                            if (key == 'GLB_CustomFontInfo') {
                                items[key] = items[key].split('||');
                                items[key] = items[key][0];
                            }
                            optionElem.each(function (index, element) {
                                if ($(element).attr('value') == items[key]) {
                                    $(element).prop('checked', true);
                                    if (key == 'GLB_ThemeID')
                                        $(element).parent('.theme-item').addClass('selected');
                                    if (key == 'GLB_CustomFontInfo')
                                        $(element).parent('.font-item').addClass('selected');
                                    hasFound = true;
                                }
                            });
                        }
                        if (!hasFound) {
                            optionElem.first().prop('checked', true);
                            optionElem.first().parent('.theme-item').addClass('selected');
                        }
                        break;

                    case 'GLB_CustomCSS':
                    case 'GLB_CustomJS':
                        optionElem = $('textarea[data-option-name="' + key + '"]');
                        optionElem.val(items[key]);
                        break;

                    default:
                        optionElem.prop('checked', items[key]);
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
                    $('#add-course-thumbnail').removeAttr('disabled');
                    clearInterval(interval);
                }
            }, 500);
        }, 1000);

    }

    function saveOption(obj, callback) {

        chrome.storage.sync.set(obj, function () {

            showToast();

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    }

    function onOptionChange(elem) {

        if (typeof elem.attr('data-option-type') === typeof undefined)
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
            $(this).parents('div.option-group').children('div.option-tip').toggleClass('hidden');
        });

        // share
        $('.share-link').on('click', function (e) {
            e.preventDefault();
            var openIn = $(this).attr('data-open-in');
            var href = $(this).attr('data-href');
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
                $('#clipboard-input').val('https://www.zijianshao.com/dlight/sharelink/?platform=chrome').select();
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
                if (r) removePopup(popupCls);
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

                chrome.runtime.sendMessage({
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
        $('input[id^="opt-themes-0-"]').on('change', function () {
            $('.theme-item').removeClass('selected');
            $(this).parent('.theme-item').addClass('selected');
        });

        // fonts
        $('input[id^="opt-themes-2-"]').on('change', function () {
            $('.font-item').removeClass('selected');
            $(this).parent('.font-item').addClass('selected');
        });

        // scroll
        $(window).on('scroll', function () {
            if (!allowHashChange)
                return;

            var top = $(window).scrollTop();
            var currID = 0;
            $('.section').each(function (index, elem) {
                if ($(elem).offset().top + $(elem).outerHeight() > top) {
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
                window.location.href = removeSearchParameters('whatsnew');
            });
        }

        // welcome
        if (params.hasOwnProperty('welcome')) {
            var welcome = $('#welcome-content').clone();
            welcome.removeAttr('id').removeClass('hidden');
            var popupCls = initPopup('Learn Darklight', welcome, '', 1);
            $('.' + popupCls).find('.popup-btn').on('click', function (e) {
                e.preventDefault();
                window.location.href = removeSearchParameters('welcome');
            });
        }

        // message listener
        chrome.runtime.onMessage.addListener(
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
                                chrome.runtime.sendMessage({
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
                var nightModeStr = '';
                if (val['nightMode'])
                    nightModeStr = ' <small>(Night Mode)</small>';

                var elem_img = '<img src="../theme/theme_' + val['id'] + '/preview.png">',
                    elem_input = '<input type="radio" ' +
                        'id="opt-themes-0-' + index + '" ' +
                        'name="GLB_ThemeID" ' +
                        'value="' + val['id'] + '" ' +
                        'data-option-name="GLB_ThemeID" ' +
                        'data-option-type="enum">',
                    elem_label = '<label for="opt-themes-0-' + index + '">' +
                        '<div class="theme-name">' + val['name'] + nightModeStr + '</div>' +
                        '<div class="theme-info">Author: ' + val['author'] + '</div>' +
                        '</label>';

                $('<div class="theme-item">' + elem_img + elem_input + elem_label + '</div>').appendTo(list);
            }

            index++;
        });
        $('<div class="theme-item theme-item-more"><img src="../img/theme-coming-soon.png"></div>').appendTo(list);
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

    function removeSearchParameters(sParam) {
        var url = window.location.href.split('?')[0] + '?';
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] != sParam) {
                url = url + sParameterName[0] + '=' + sParameterName[1] + '&'
            }
        }
        return url.substring(0, url.length - 1);
    }

    $(window).on('load', function (e) {

        loadThemes();

        restoreOptions();

        // version #
        $('#darklight-version').text(chrome.runtime.getManifest().version);

        // clipboard input
        var clipBoardInput = $('<div class="width-0 fixed"><input type="text" id="clipboard-input"></div>');
        $('body').append(clipBoardInput);

    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {
    }, 0);

}

initOptions();

