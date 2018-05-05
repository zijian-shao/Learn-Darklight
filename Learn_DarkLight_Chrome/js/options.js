function initOptions() {

    function restoreOptions() {

        var configs = getOptionListDefault();

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
                                    hasFound = true;
                                }
                            });
                        }
                        if (!hasFound) {
                            optionElem.first().prop('checked', true);
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
            var themeConfigs = getThemeConfigs();
            if (themeConfigs['theme_' + items.GLB_ThemeID]['nightMode']) {
                $('body').addClass('dark-mode');
            }

            bindEvents();
        });

    }

    function saveOption(obj, callback) {

        chrome.storage.sync.set(obj, function () {

            $('#darklight-toast').removeClass('darklight-toast-hidden');

            window.clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $('#darklight-toast').addClass('darklight-toast-hidden');
            }, 1000);

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

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (!hash.length) hash = 'global';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function bindEvents() {
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

            $('#opt-tab-' + prevTabID).fadeOut(200, function () {
                $('#opt-tab-' + prevTabID).addClass('hidden');
                $('#opt-tab-' + thisTabID).fadeIn(200).removeClass('hidden');
            });


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
        $('#custom-css, #custom-js').bind('keydown', function (event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        $('#custom-save').trigger('click');
                        break;
                }
            }
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

            $('<div class="color-scheme"><span style="background:' + val['previewColor'] + '"></span></div>').appendTo(list);
            $('<p><input type="radio" id="opt-global-2-' + index + '" name="GLB_ThemeID" value="' + val['id'] + '" data-option-name="GLB_ThemeID" data-option-type="enum"><label for="opt-global-2-' + index + '">' + val['name'] + nightModeStr + '</label></p>').appendTo(list);

            $('#opt-global-2-' + index).on('change', function () {
                if (themes['theme_' + $(this).attr('value')]['nightMode']) {
                    $('body').addClass('dark-mode');
                } else {
                    $('body').removeClass('dark-mode');
                }
            });

            index++;
        });
    }

    $(window).load(function () {

        loadThemes();

        restoreOptions();

        // version #
        $('#darklight-version').text(chrome.runtime.getManifest().version);

        // clipboard input
        var clipBoardInput = $('<div class="width-0"><input type="text" id="clipboard-input"></div>');
        $('body').append(clipBoardInput);
    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();

