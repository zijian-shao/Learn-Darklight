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
        }, 2000);
    }

    function initPopup(title, content, extraClass) {
        $('body').addClass('lock-scroll');
        var rnd = Math.floor(Math.random() * 90000) + 10000;
        var content2 = content.next('.popup-template').first().children().clone();
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

    // db
    function getDatabase(ready, error) {
        if (!window.indexedDB) {
            alert("Your browser doesn't support IndexedDB. Custom course cover picture is not available.");
            return;
        }
        var dbOpenRequest = window.indexedDB.open("darklight", 1);
        dbOpenRequest.onsuccess = function (e) {
            ready(e.target.result);
        };
        dbOpenRequest.onerror = function (event) {
            console.log(event.target.errorCode);
            if (error) {
                error(event);
            }
        };
        dbOpenRequest.onupgradeneeded = function (event) {
            if (event.oldVersion === 0) {
                var os = event.target.result.createObjectStore('course_thumbs', {keyPath: 'course_id'});
                os.createIndex('course_code', 'course_code', {unique: false});
                os.createIndex('thumb_image', 'thumb_image', {unique: false});
            }
        }
    };

    // db
    function getCourseThumbs(callback) {
        getDatabase(function (db) {
            var tx = db.transaction(['course_thumbs'], 'readonly');
            var os = tx.objectStore('course_thumbs');
            var all = [];
            os.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var s = {
                        course_id: cursor.key,
                        course_code: cursor.value.course_code,
                        thumb_image: cursor.value.thumb_image
                    };
                    all.push(s);
                    cursor.continue();
                } else {
                    try {
                        callback(all);
                    } catch (e) {

                    }
                }
            };
        }, null);
    }

    // db
    function addCourseThumbs(o, callback) {
        getDatabase(function (db) {
            var tx = db.transaction(['course_thumbs'], 'readwrite');
            var os = tx.objectStore('course_thumbs');

            // test existence
            var request1 = os.get(o.course_id);
            request1.onsuccess = function (event) {
                if (request1.result) {
                    // found in db
                    callback({
                        err_code: 1,
                        err_msg: 'Custom cover picture with this course ID already exists. ' +
                            'You may edit saved picture or delete it before adding.'
                    })
                } else {
                    // add to db
                    var request = os.add({
                        course_id: o.course_id,
                        course_code: o.course_code,
                        thumb_image: o.thumb_image
                    });
                    request.onsuccess = function (event) {
                        callback({
                            err_code: 0,
                            data: {
                                msg: 'New Custom Cover Picture Added'
                            }
                        });
                    };
                    request.onerror = function (event) {
                        callback({
                            err_code: 2,
                            err_msg: event.target.error.name + ': ' + event.target.error.message
                        });
                    };
                }
            };
        }, null);
    }

    // db
    function deleteCourseThumbs(course_id, callback) {
        getDatabase(function (db) {
            var tx = db.transaction(['course_thumbs'], 'readwrite');
            var os = tx.objectStore('course_thumbs');
            var request = os.delete(course_id);
            request.onsuccess = function (event) {
                callback({
                    err_code: 0,
                    data: {
                        msg: 'Custom cover picture deleted successfully'
                    }
                });
            };
            request.onerror = function (event) {
                callback({
                    err_code: 2,
                    err_msg: event.target.error.name + ': ' + event.target.error.message
                });
            };
        }, null);
    }

    function refreshThumbList() {
        var thumbList = $('#saved-thumb-list');
        thumbList.html('');
        getCourseThumbs(function (e) {
            if (!e.length) {
                thumbList.html('None');
            } else {

                function sortCourse(a, b) {
                    if (a.course_code < b.course_code)
                        return -1;
                    if (a.course_code > b.course_code)
                        return 1;
                    return 0;
                }

                e.sort(sortCourse);

                e.forEach(function (item, index) {
                    $('<div class="saved-thumb-item" data-course-id="' + item.course_id + '" style="background-image: url(' + item.thumb_image + ')">' +
                        '<div class="saved-thumb-item-tip">Delete</div>' +
                        '<div class="saved-thumb-item-title">' + item.course_code +
                        '<small>( ID: ' + item.course_id + ' )</small></div>' +
                        '<div>').appendTo(thumbList);
                });

                $('.saved-thumb-item-tip').on('click', function (e) {
                    var r = confirm('Are you sure you want to delete this custom cover picture?');
                    if (r) {
                        deleteCourseThumbs($(this).parent('.saved-thumb-item').attr('data-course-id'), function (e) {
                            showToast(e.data.msg);
                            refreshThumbList();
                        });
                    }
                });
            }
        });
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
                        var hasFound = false;
                        if (items[key] === true) {
                            optionElem.first().prop('checked', true);
                            hasFound = true;
                        } else {
                            optionElem.each(function (index, element) {
                                if ($(element).attr('value') == items[key]) {
                                    $(element).prop('checked', true);
                                    $(element).parent('.theme-item').addClass('selected');
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

            // night mode
            // var themeConfigs = getThemeConfigs();
            // if (themeConfigs['theme_' + items.GLB_ThemeID]['nightMode']) {
            //     $('body').addClass('dark-mode');
            // }

            bindEvents();
        });

        // local
        refreshThumbList();
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
            var popupCls = initPopup('Add Custom Cover Picture', $(this));
            var popup = $('.' + popupCls);
            var reader = new FileReader(),
                imgL = popup.find('.cthumb-prev-1'),
                imgR = popup.find('.cthumb-prev-2'),
                prevBlk = popup.find('.course-thumb-preview'),
                fileNm = popup.find('.input-file-name'),
                container = popup.find('.popup-content');
            var thumbBase64 = '';
            // file
            popup.find('.thumb-image-file').on('change', function () {

                container.find('.alert-file-size').addClass('hidden');
                thumbBase64 = '';
                fileNm.text('Choose an image...');
                imgL.css('background-image', '');
                imgR.css('background-image', '');
                prevBlk.addClass('hidden');

                if (this.files && this.files[0]) {
                    if (this.files[0].size > 200 * 1024) {
                        container.find('.alert-file-size').removeClass('hidden');
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
                    errMsg += 'Course ID should be an integer.\n';
                }
                if (courseCode.length === 0) {
                    errMsg += 'Course Code cannot be empty.\n';
                }
                if (thumbBase64.length === 0) {
                    errMsg += 'Image file cannot be empty.\n';
                }
                if (errMsg.length !== 0) {
                    alert(errMsg);
                    return;
                }
                addCourseThumbs({course_id: courseID, course_code: courseCode, thumb_image: thumbBase64}, function (e) {
                    if (e.err_code === 0) {
                        showToast(e.data.msg);
                        refreshThumbList();
                        removePopup(popupCls);
                    } else {
                        alert(e.err_msg);
                    }
                });


            });
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
    }

    function loadThemes() {
        var themes = getThemeConfigs();
        var list = $('#theme-list');
        var index = 0;
        $.each(themes, function (i, val) {

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

            $('#opt-themes-0-' + index).on('change', function () {
                $('.theme-item').removeClass('selected');
                $(this).parent('.theme-item').addClass('selected');
            });

            index++;
        });
        $('<div class="theme-item theme-item-more">coming soon</div>').appendTo(list);
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

