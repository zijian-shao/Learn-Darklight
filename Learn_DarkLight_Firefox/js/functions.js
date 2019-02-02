function getCustomThemeOption(name) {
    return themeCustomConfigs['THEME_ID_' + options.GLB_ThemeID + '_OPT_' + name];
}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    var html = null;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    html.animate({scrollTop: pos - offset}, time);

}

function blockPage(color) {
    if ($('#darklight-block-page').length)
        return;

    var elem = $('<div/>', {
        'id': 'darklight-block-page',
        'class': 'darklight-block-page'
    });

    if (color !== undefined)
        elem.css('background-color', color);


    elem.append($('<div class="darklight-block-page-wrapper"><div class="darklight-block-page-loader"></div><div class="darklight-block-page-message">Loading</div></div>')).hide().appendTo('body').fadeIn(300);

}

function blockPageMsg(msg) {
    $('#darklight-block-page').find('.darklight-block-page-message').text(msg);
}

function unblockPage() {

    $('#darklight-block-page').fadeOut(300, function () {
        $(this).remove();
    });

}

function isOnScreen(element) {

    var html = null;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    if ($.type(element) === 'object')
        return (html.scrollTop() < element.offset().top);
    else if ($.type(element) === 'number')
        return (html.scrollTop() < element);

    return true;
}

function detectExtConflict() {

    if ($('#darklight-extension').length) {
        alert("You have multiple versions of Learn Darklight installed. Please disable one of them to avoid unexpected behaviors.");
    } else {
        $('<div id="darklight-extension"></div>').appendTo('body');
    }

}

function customFont() {

    var fontConf = options.GLB_CustomFontInfo.split('||');

    if (fontConf[0].match(/Default/i)) return;

    // fontName||weights||fontSize||source
    if (fontConf.length == 4) {

        // name, weights, size, source
        if (fontConf[3] == 'google') {
            injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');
        } else if (fontConf[3] == 'none') {

        } else {
            injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');
        }

    } else if (fontConf.length == 3) {

        // name, weights, size
        injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');

    } else {

        // name only
        injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':200,400,600,800', 'head');

    }

    injectCSS('body, strong, p, a, h1, h2, h3, h4, h5, h6, input, button, select, div {font-family: "'
        + fontConf[0] + '", "Microsoft YaHei", sans-serif!important;}', 'head', 'text');
}

function addBackToTopButton() {
    function _addBackToTopButton() {
        if ($(window).scrollTop() < 100)
            $('#darklight-back-to-top').addClass('darklight-back-to-top-hidden').delay(200);
        else
            $('#darklight-back-to-top').removeClass('darklight-back-to-top-hidden');
    }

    $('<div class="darklight-back-to-top darklight-back-to-top-hidden" id="darklight-back-to-top"><i class="arrow up"></i></div>').on('click', function (e) {
        e.preventDefault();
        scrollToUtil(0, 300);
    }).appendTo('body');

    _addBackToTopButton();
    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function addBackToTopButtonNavbar() {

    function _addBackToTopButton() {
        if ($(window).scrollTop() < 100)
            $('#darklight-navbar-back-to-top').addClass('darklight-navbar-back-to-top-hidden').delay(200);
        else
            $('#darklight-navbar-back-to-top').removeClass('darklight-navbar-back-to-top-hidden');
    }

    var navWrapper = undefined;
    var interval = setInterval(function () {
        if (typeof navWrapper === typeof undefined || !navWrapper.length) {
            navWrapper = $('d2l-navigation d2l-navigation-main-footer .d2l-navigation-centerer .d2l-navigation-gutters .d2l-navigation-s-main-wrapper');
        } else {
            $('<div class="darklight-navbar-back-to-top" id="darklight-navbar-back-to-top">' +
                '<a href="#"><i class="arrow up"></i></a></div>')
                .on('click', function (e) {
                    e.preventDefault();
                    scrollToUtil(0, 300);
                })
                .appendTo(navWrapper);
            _addBackToTopButton();
            clearInterval(interval);
        }
    }, 500);

    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function fixNavigation() {
    function _fixNavigation() {

        if ($(window).width() < 768)
            return;

        var html = null;
        if (isBrowser('safari'))
            html = $('body');
        else
            html = $('html');

        if (html.scrollTop() < offset) {
            // is on screen
            nav.removeClass('darklight-navbar-fixed');
            header.css('margin-bottom', '0px');
        } else {
            // not on screen
            nav.addClass('darklight-navbar-fixed');
            header.css('margin-bottom', navHeight + 'px');
        }
    }

    var nav = $('d2l-navigation-main-footer');
    var header = $('d2l-navigation-main-header');
    if (!nav.length || !header.length) return;

    var navHeight = nav.outerHeight();
    var offset = header.outerHeight() + header.offset().top;

    if (isBrowser('firefox')) {
        $(window).on('load', function () {
            navHeight = nav.outerHeight();
            offset = header.outerHeight() + header.offset().top;
            _fixNavigation();
        });
    } else {
        _fixNavigation();
    }

    $(window).on('scroll', function () {
        _fixNavigation();
    });

    $(window).on('resize', function () {
        if ($(window).width() < 768) {
            header.css('margin-bottom', '0px');
        } else {
            navHeight = nav.outerHeight();
            offset = header.outerHeight() + header.offset().top;
            _fixNavigation();
        }
    });
}

function resizeContentBtn(page) {

    function _getFloatButton(iconSrc, text, id) {
        if (typeof id === typeof undefined) id = '';
        else id = ' id="' + id + '"';
        return '<a href="#" class="darklight-fixed-right-button"' + id + '><div class="darklight-fixed-right-button-icon"><img src="' + iconSrc + '"></div><div class="darklight-fixed-right-button-text">' + text + '</div></a>';
    }

    function _resizeContentBtn() {
        var body = $('body');

        var wrapper = $('<div class="darklight-fixed-right-wrapper"></div>');

        // inc iframe
        var sizeInc = $(_getFloatButton(baseURL + 'img/button-icon-plus.png', 'Content Height <strong>+</strong>'));
        sizeInc.on('click', function (e) {
            e.preventDefault();
            var currH = iframe.attr('data-current-height');
            if (typeof currH === 'undefined')
                currH = iframe.height();
            currH = parseInt(currH);
            currH += 50;
            iframe.css('height', currH + 'px');
            iframe.attr('data-current-height', currH);
        });
        sizeInc.appendTo(wrapper);

        // dec iframe
        var sizeDec = $(_getFloatButton(baseURL + 'img/button-icon-minus.png', 'Content Height <strong>-</strong>'));
        sizeDec.on('click', function (e) {
            e.preventDefault();
            var currH = iframe.attr('data-current-height');
            if (typeof currH === 'undefined')
                currH = iframe.height();
            currH = parseInt(currH);
            if (currH >= 300) {
                currH -= 50;
                iframe.css('height', currH + 'px');
                iframe.attr('data-current-height', currH);
            }
        });
        sizeDec.appendTo(wrapper);


        $(window).on('resize', function () {
            setTimeout(function () {
                iframe.css('height', iframe.attr('data-current-height') + 'px');
            }, 10);
        });

        function _fullScreenBtn() {
            var fullScreenBtn = iframe.contents().find('#fullscreenMode');
            if (fullScreenBtn.length && !$('#darklight-full-screen-mode').length) {

                var fullScr = $(_getFloatButton(
                    baseURL + 'img/button-icon-expand.png',
                    'Full Screen Mode',
                    'darklight-full-screen-mode')
                );
                fullScr.on('click', function (e) {
                    e.preventDefault();
                    fullScreenBtn.trigger('click');
                });

                fullScr.appendTo(wrapper);
                clearInterval(fullSrcInterval);

            } else {
                fullSrcCounter++;
                if (fullSrcCounter > 10) {
                    clearInterval(fullSrcInterval);
                }
            }
        }

        var fullSrcCounter = 0;
        var fullSrcInterval = setInterval(function () {
            _fullScreenBtn();
        }, 1000);

        // unlock body
        function _unlockBody() {
            if (body.css('overflow') == 'hidden') {
                var unlockScroll = $('<a href="#" class="darklight-fixed-right-button"><div class="darklight-fixed-right-button-icon"><img src="' + baseURL + 'img/button-icon-unlock.png"></div><div class="darklight-fixed-right-button-text">Unlock Page Scroll</div></a>');
                unlockScroll.on('click', function (e) {
                    e.preventDefault();
                    body.css('overflow', 'auto');
                    $(this).hide();
                });
                unlockScroll.appendTo(wrapper);
            }
        }

        setTimeout(_unlockBody, 1000);

        wrapper.appendTo(body);
    }

    var iframe = null;

    function _getIframe() {
        if (page == 'content')
            iframe = $('#ContentView').find('iframe');
        else if (page == 'quiz')
            iframe = $('.d2l-page-main').find('iframe');
    }

    var interval = setInterval(function () {
        _getIframe();
        iframe.each(function (idx, elem) {
            if ($(elem).attr('src').trim() != '') {
                iframe = $(elem);
                clearInterval(interval);
                _resizeContentBtn();
                return false;
            }
        });

    }, 200);
}

function listMembersBtn() {

    var theForm = $('form[id="d2l_form"][action^="user_available_group_list.d2l"]');
    if (theForm.find('table').first().text().match(/No items found/g))
        return;

    $('table.d_g.d_gn').removeClass('d_g d_gn').addClass('d2l-table d2l-grid d_gl group-list');
    injectCSS('.group-list th, .group-list td {border-width: 1px; border-style: solid; padding: 5px 15px;}', 'head', 'text');

    var targetBtn = $('button[class="d2l-button"][data-location^="user_group_list.d2l"]');
    if (!targetBtn.length) return;

    var newBtn = $('<button class="d2l-button" id="darklight-all-group-members-btn">Display Group Members</button>');
    newBtn.insertAfter(targetBtn);

    newBtn.on('click', function (e) {
        e.preventDefault();

        if ($('#darklight-all-group-members').length || $('#darklight-all-group-members-btn').attr('data-shown') == '1') {
            alert('All group members have already been listed. Please refresh page if you want to try again.');
            return;
        }

        blockPage();

        var groupID = [];
        var groupNum = [];

        theForm.find('table tbody tr').each(function (i, elem) {

            var lastTDLink = $(elem).find('td:last-child a.d2l-link');
            var lastTD2Link = $(elem).find('td:nth-last-child(2) a.d2l-link');

            if ((lastTD2Link.length && lastTDLink.length && lastTDLink.text().match(/Join Group/gi))
                || (lastTD2Link.length && lastTD2Link.text().match(/\(Full\)/gi))) {
                var theID = lastTD2Link.attr('onclick').match(/\d+/g).join('');
                $(elem).attr('data-group-id', theID);
                groupID.push(theID);
                groupNum.push($(elem).find('td:first-child').text().trim());
            }

        });

        // ajax requests
        var finalList = {};
        var counter = 0;
        var url = new URL(currURL);
        var ou = url.searchParams.get('ou');

        function _showAllGroupMembers() {

            theForm.find('table tbody tr').each(function (idx, elem) {
                var trID = $(elem).attr('data-group-id');
                if (typeof trID !== typeof undefined) {
                    $(elem).find('td:nth-last-child(2)').html(finalList['ID_' + trID].names);
                }
            });

            $('#darklight-all-group-members-btn').attr('data-shown', '1');
        }

        function _getGroupMemberAjax() {

            if (!groupID.length) {
                unblockPage();
                return;
            }

            blockPageMsg('Retrieving data - ' + groupNum[counter]);
            $.ajax({
                type: 'get',
                url: currURLHost + '/d2l/lms/group/group_member_list.d2l?ou=' + ou + '&groupId=' + groupID[counter] + '&d2l_body_type=2',
                success: function (data) {
                    var html = $($.parseHTML(data));
                    var table = html.find('.d2l-grid-container .d2l-table.d2l-grid');
                    var names = [];
                    table.find('tr').each(function (idx, elem) {
                        if (idx > 0) {
                            var name = $(elem).text().trim();
                            names.push(name);
                        }
                    });
                    names = names.join('<br>');
                    finalList['ID_' + groupID[counter]] = {
                        'group': groupNum[counter],
                        'names': names
                    };
                    counter++;
                    if (counter >= groupID.length) {
                        blockPageMsg('Done');
                        unblockPage();
                        _showAllGroupMembers();
                    } else {
                        // wait 100ms till next request (don't wanna blow up the server)
                        // setTimeout(_getGroupMemberAjax,100);

                        // whatever
                        _getGroupMemberAjax();
                    }
                }
            });

        }

        _getGroupMemberAjax();

    });
}

function homepageFunc() {

    var courseWidget = null, announcementWidget = null;

    $('.d2l-homepage-header-wrapper').each(function (i, e) {
        var headText = $(e).text();
        if (headText.match(/SYSTEM ALERT/) || headText.match(/News/)) {
            if (options.HOME_AutoHideSysAlert) {
                if (!isWLU()) {
                    // remove sys alert if empty
                    var alertHtml = $(e).parent('div.d2l-widget-header').next('div.d2l-widget-content').children('div.d2l-htmlblock').first();
                    var _alertHtml = alertHtml.clone();
                    _alertHtml.find('a').remove();
                    _alertHtml.find('script').remove();
                    if (_alertHtml.text().trim() == '') {
                        $(e).parents('div.d2l-widget').remove();
                    }
                } else {
                    // remove news if empty
                    if ($(e).parent('div.d2l-widget-header').next('div.d2l-widget-content').text().match(/There are no/)) {
                        $(e).parents('div.d2l-widget').remove();
                    }
                }
            }
        } else if (headText.match(/Check My System/) && !isWLU()) {
            if (options.HOME_HideCheckMySys) {
                $(e).parents('div.d2l-widget').remove();
            }
        } else if (headText.match(/Courses and Communities/) && !isWLU()) {

            courseWidget = $(e).parents('div.d2l-widget');


            if (options.HOME_AddCalendar) {
                // insert after courses
                var calendarWidget = $('<div role="region" class="d2l-widget darklight-homepage-calendar-widget d2l-tile"><div class="d2l-widget-header"><div class="d2l-homepage-header-wrapper"><h2 class="d2l-heading vui-heading-4">Upcoming Events</h2></div></div><div class="d2l-widget-content darklight-homepage-calendar" id="darklight-homepage-calendar"><div class="darklight-homepage-calendar-loading"><div class="darklight-block-page-loader"></div> Loading calendar, please wait...</div></div></div>');

                calendarWidget.insertAfter(courseWidget);
            }

            function _waitForCourseLoad(isTabSwitch) {

                var loadSpinner = courseWidget.find('d2l-my-courses d2l-tabs d2l-tab-panel[selected] d2l-my-courses-content div.spinner-container d2l-loading-spinner');
                var intervalVal = 0, delayVal = 0;
                if (isBrowser('firefox')) {
                    intervalVal = 300;
                    delayVal = 500;
                } else {
                    intervalVal = 200;
                    delayVal = 200;
                }

                var intervalId = setInterval(function () {
                    if (!loadSpinner.length) {
                        loadSpinner = courseWidget.find('d2l-my-courses d2l-tabs d2l-tab-panel[selected] d2l-my-courses-content div.spinner-container d2l-loading-spinner');
                    }
                    else if (typeof loadSpinner.attr('hidden') === typeof undefined
                        || (!courseWidget.find('d2l-my-courses d2l-tabs d2l-tab-panel[selected] d2l-my-courses-content d2l-enrollment-card d2l-card div.d2l-card-container').length
                            && typeof courseWidget.find('d2l-my-courses d2l-tabs d2l-tab-panel[selected] d2l-my-courses-content d2l-alert').attr('hidden') === typeof undefined)
                    ) {
                        // not loaded yet
                    } else {

                        // test if course tiles are loaded
                        var courseWidgetTabPanel = courseWidget.find('d2l-my-courses d2l-tabs d2l-tab-panel[selected]');
                        var courseTileLoaded = true;

                        courseWidgetTabPanel.find('d2l-my-courses-content d2l-enrollment-card').each(function (idx, elem) {
                            if (typeof $(elem).find('d2l-card d2l-course-image img').attr('src') === typeof undefined
                                || $(elem).find('d2l-card d2l-organization-name').text().trim() == '')
                                courseTileLoaded = false;
                        });

                        if (courseTileLoaded) {

                            clearInterval(intervalId);

                            var times = isTabSwitch ? 4 : 1;

                            setTimeout(function () {
                                // calendar
                                homepageCalendar(courseWidgetTabPanel);
                                // custom course thumb
                                customCourseThumbs(courseWidgetTabPanel);
                                // direct to content
                                courseDirectToContent(courseWidgetTabPanel);
                            }, delayVal * times);

                            // tab change
                            if (isTabSwitch !== true) {
                                courseWidget.find('d2l-my-courses d2l-tabs d2l-tab').on('click', function (e) {
                                    $('#darklight-homepage-calendar').removeClass('darklight-homepage-calendar-empty').html('<div class="darklight-homepage-calendar-loading"><div class="darklight-block-page-loader"></div> Loading calendar, please wait...</div>');
                                    _waitForCourseLoad(true);
                                });
                            }
                        }
                    }
                }, intervalVal);

            }

            _waitForCourseLoad();


        } else if (headText.match(/Calendar/) && isWLU()) {
            // for WLU homepage calendar
            $(e).parents('div.d2l-widget').addClass('darklight-course-home-calendar');
        } else if (headText.match(/Announcements/) && !isWLU()) {
            announcementWidget = $(e).parents('div.d2l-widget');
        }
    });

    // switch calendar and announce
    if (options.HOME_SwitchAnnounceAndCalendar && options.HOME_AddCalendar) {
        $('.darklight-homepage-calendar-widget').insertBefore(announcementWidget);
        announcementWidget.insertAfter(courseWidget);
    }

    // remove homepage privacy notice
    if (options.HOME_HidePrivacy) {
        var heading = $('.homepage-col-12 .d2l-heading');
        heading.each(function () {
            if ($(this).text().match(/Privacy/)) {
                $(this).parents('div.homepage-col-12').remove();
            }
        });
    }

    // course tile meta
    var style = '';
    if (options.HOME_HideMetaTerm)
        style += 'd2l-organization-info {display: none!important}';
    if (options.HOME_HideMetaEndDate)
        style += 'd2l-user-activity-usage {display: none!important}';
    injectCSS(style, 'head', 'text');

    // course tile thumb
    if (options.COURSE_CustomThumb) {
        injectCSS('.shown.d2l-course-image{opacity:0}.d2l-enrollment-card-image-container{opacity:0}', 'body', 'text');
    }
}

function homepageCalendar(courseWidget) {
    if (isWLU()) return;

    if (!options.HOME_AddCalendar) return;

    var links = [];
    courseWidget.find('d2l-my-courses-content d2l-enrollment-card d2l-card').each(function (i, e) {
        if ($(e).find('d2l-course-image img.d2l-course-image').is(':visible')) {
            var link = $(e).children('div.d2l-card-container').children('a.d2l-focusable').first().attr('href');
            if (link !== undefined)
                links.push(link);
        }
    });

    var counter = 0;
    var placeHolder = $('#darklight-homepage-calendar');
    var finalList = [];

    function _sortEvents(a, b) {
        if (a.timestamp < b.timestamp)
            return -1;
        if (a.timestamp > b.timestamp)
            return 1;
        return 0;
    }

    function _displayEvents() {
        if (finalList.length == 0) {
            placeHolder.html($('<div class="d2l-msg-container d2l-datalist-empty"><div class="d2l-msg-container-inner"><div class="d2l-msg-container-text d2l_1_70_508">There are no events to display.</div><div class="d2l-clear"></div></div></div>'));
            placeHolder.addClass('darklight-homepage-calendar-empty');
            return;
        } else {
            placeHolder.removeClass('darklight-homepage-calendar-empty');
        }

        finalList.sort(_sortEvents);
        placeHolder.html('');

        var todayTag = '';
        var today = new Date();
        var targetDay = null;
        for (var i = 0, len = finalList.length; i < len; i++) {
            targetDay = new Date(finalList[i].timestamp * 1000);
            if (targetDay.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
                todayTag = '<div class="tag">TODAY</div>';
            } else {
                todayTag = '';
            }
            $('<a href="' + finalList[i].link + '" target="_blank" class="darklight-homepage-calendar-item"><div class="darklight-homepage-calendar-date"><span class="month">' + finalList[i].month + '</span><span class="day">' + finalList[i].day + '</span></div><div class="darklight-homepage-calendar-content">' + todayTag + '<div><span class="time">' + finalList[i].time + '</span><span class="course">' + finalList[i].course + '</span></div><div class="title d2l-typography">' + finalList[i].title + '</div></div></a>').appendTo(placeHolder);
        }
    }

    function _getCoursePageAjax() {

        if (!links.length) {
            _displayEvents();
            return;
        }

        $.ajax({
            type: 'get',
            url: currURLHost + links[counter],
            success: function (data) {
                var html = $($.parseHTML(data));
                var calendar = null;
                var courseCode = html.find('.d2l-navigation-s-link').first().text();
                courseCode = courseCode.split(' - ');
                courseCode.pop();
                courseCode = courseCode.join(' - ');

                // get widget header
                html.find('.d2l-homepage .d2l-widget .d2l-widget-header').each(function (i, e) {
                    if ($(e).text().match(/Calendar/g)) {

                        // get calendar header
                        $(e).next('.d2l-widget-content').find('.d2l-collapsepane-header').each(function (i2, e2) {
                            if ($(e2).text().match(/Upcoming events/g)) {

                                // get calendar list content
                                calendar = $(e2).next('.d2l-collapsepane-content').find('ul.d2l-datalist');
                                if (calendar.children('li.d2l-datalist-item').length > 0) {

                                    // if found event
                                    calendar.children('li.d2l-datalist-item').each(function (i3, e3) {

                                        var dataContent = $(e3).children('div.d2l-datalist-item-content').first();
                                        dataContent.find('div.d2l-clear').remove();

                                        var date = dataContent.children('div').first().children('div').first();
                                        var month = date.children('div').first().text().trim();
                                        var day = date.children('div').last().text().trim();
                                        var time = dataContent.children('div').first().children('div').last().children('span').first().text().trim();
                                        var title = dataContent.children('div').first().children('div').last().children('div').last().text().trim();
                                        var link = $(e3).find('#' + $(e3).attr('data-d2l-actionid')).attr('href');
                                        link = link.substring(0, link.indexOf('#'));
                                        var timestamp = '';
                                        var currYear = (new Date()).getFullYear();

                                        if (!time.match(/\d+:\d+ [APM]{2}/g)) {
                                            // 'all day' events have highest priority
                                            timestamp = new Date(month + ' ' + day + ', ' + currYear + ' 00:00:00').getTime() / 1000;
                                        } else {
                                            timestamp = new Date(month + ' ' + day + ', ' + currYear + ' ' + time).getTime() / 1000;
                                        }

                                        finalList.push({
                                            'course': courseCode,
                                            'timestamp': timestamp,
                                            'month': month,
                                            'day': day,
                                            'time': time,
                                            'title': title,
                                            'link': link
                                        });
                                    });

                                }
                            }
                        });
                    }
                });

                counter++;
                if (counter >= links.length) {
                    _displayEvents();
                } else {
                    _getCoursePageAjax();
                }
            }
        });

    }

    _getCoursePageAjax();

}

function customCourseThumbs(courseWidget) {

    if (!options.COURSE_CustomThumb) return;

    if (typeof courseWidget !== typeof undefined) {
        var cards = courseWidget.find('d2l-my-courses-content d2l-enrollment-card d2l-card div.d2l-card-container');
        cards.each(function (idx, elem) {
            var link = $(elem).children('a.d2l-focusable').first().attr('href');
            var code = link.split('/');
            code = code[code.length - 1];
            var img = $(elem).find('.d2l-card-link-container .d2l-card-header .d2l-enrollment-card-image-container').first();
            img.addClass('darklight-course-thumb darklight-course-thumb-' + code);
        });

        injectCSS('.shown.d2l-course-image{opacity:1}', 'body', 'text');
        $('.darklight-course-thumb').addClass('shown');

    }

    else {
        var code = currURL.split('/');
        code = code[code.length - 1];
        $('.d2l-course-banner').addClass('darklight-course-thumb darklight-course-thumb-' + code);
    }
}

function courseDirectToContent(courseWidget) {

    if (!options.COURSE_DirectToContent) return;

    // homepage
    if (typeof courseWidget !== typeof undefined) {
        var cards = courseWidget.find('d2l-my-courses-content d2l-enrollment-card');
        cards.each(function (idx, elem) {
            var el = $(elem).find('d2l-card div.d2l-card-container a.d2l-focusable').first();
            var link = el.attr('href');
            link = link.replace('/d2l/home/', '/d2l/le/content/');
            link += '/Home';
            el.attr('href', link);
        });
    }
    // navbar
    else {
        var courseBtn = undefined;
        var interval = setInterval(function () {
            if (typeof courseBtn === typeof undefined || !courseBtn.length) {
                courseBtn = $('.d2l-navigation-s-course-menu d2l-dropdown button');
            } else {
                courseBtn.on('click', function () {
                    var d2lBtn = courseBtn.closest('d2l-navigation-button');
                    var interval2 = setInterval(function () {
                        if (d2lBtn.attr('aria-expanded') === 'true') {
                            var links = $('#courseSelectorId').find('ul.d2l-datalist.vui-list li');
                            links.each(function (idx, elem) {
                                var el = $(elem).find('a.d2l-link.d2l-datalist-item-actioncontrol');
                                var link = el.attr('href');
                                if (!link.match(/\/content\//)) {
                                    link = link.replace('/d2l/home/', '/d2l/le/content/');
                                    link += '/Home';
                                    el.attr('href', link);
                                }
                            });
                            clearInterval(interval2);
                        }
                    }, 200);
                });
                clearInterval(interval);
            }
        }, 500);
    }
}

function initDarklightFunc() {

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

    // conflict detect
    detectExtConflict();

    // custom font
    if (options.GLB_CustomFont) {
        customFont();
    }

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    if (options.GLB_FixNavigation && options.GLB_BackToTopButtonNavbar) {
        addBackToTopButtonNavbar();
    }

    // fix navigation
    if (options.GLB_FixNavigation) {
        fixNavigation();
    }

    // display group members
    if (currURL.match(/\/d2l\/lms\/group\/user_available_group_list\.d2l/g) && options.GROUP_ListMembersBtn) {
        listMembersBtn();
    }

    // content resize
    if (currURL.match(/\/d2l\/le\/content\/\d+\/viewContent\/\d+\/View/g) && options.COURSE_ContentResizeBtn) {
        resizeContentBtn('content');
    }

    // quiz & survey resize
    if ((currURL.match(/\/quizzing\/user\/attempt\//g) || currURL.match(/\/survey\/user\/attempt\//g)) && options.QUIZ_ContentResizeBtn) {
        resizeContentBtn('quiz');
    }

    // homepage
    if (currURL2.match(/\/d2l\/home$/)) {
        homepageFunc();
    }

    // course home
    if (currURL2.match(/\/d2l\/home\/\d+$/)) {
        customCourseThumbs();
    }

    courseDirectToContent();

    // overlay
    $('#darklight-load-overlay').delay(400).fadeOut(400, function () {
        $(this).remove();
    });

}
