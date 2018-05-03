function injectCSS(url, tag, type) {

    var style;

    if (type === 'text') {

        style = $('<style/>');

        style.text(url);

    } else {

        style = $('<link/>', {
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': url
        });

    }

    $(tag).append(style);

}

function injectJS(url, tag, type) {

    var script = $('<script/>', {
        'type': 'text/javascript'
    });

    if (type === 'text') {
        script.text(url);
    } else {
        script.attr('src', url);
    }

    $(tag).append(script);

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

    if ($.type(element) === 'object')
        return ($('html').scrollTop() < element.offset().top);
    else if ($.type(element) === 'number')
        return ($('html').scrollTop() < element);

    return true;
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
        scrollToUtil(0, 400);
    }).appendTo('body');

    _addBackToTopButton();
    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function fixNavigation() {
    function _fixNavigation() {

        if ($(window).width() < 768)
            return;

        if ($('html').scrollTop() < offset) {
            // is on screen
            nav.removeClass('darklight-navbar-fixed');
            header.css('margin-bottom', '0px');
        } else {
            // not on screen
            nav.addClass('darklight-navbar-fixed');
            header.css('margin-bottom', navHeight + 'px');
        }
    }

    var nav = $('.d2l-navigation-s-main');
    var navHeight = nav.height();
    var header = $('.d2l-navigation-s-header');
    var offset = header.height();

    _fixNavigation();
    $(window).on('scroll', function () {
        _fixNavigation();
    });

    $(window).on('resize', function () {
        if ($(window).width() < 768) {
            header.css('margin-bottom', '0px');
        } else {
            navHeight = nav.height();
            offset = header.height();
            _fixNavigation();
        }
    });
}

function isWLU() {
    return currURL.includes('mylearningspace.wlu.ca');
}

function hideHeaderBtn() {
    var hideBtn = $('<a href="#" data-hidden="0" class="darklight-hide-header-btn">Hide Header</a>');
    var pageHeader = $('body').children('header').first();
    var iframe = $('#d_content').find('iframe').first();

    iframe.attr('data-original-height', iframe.css('height'));

    hideBtn.on('click', function (e) {
        e.preventDefault();
        if ($(this).attr('data-hidden') == '0') {
            $(this).attr('data-hidden', '1').text('Show Header');
            pageHeader.hide();
            iframe.css('height', '100vh');
        } else {
            $(this).attr('data-hidden', '0').text('Hide Header');
            pageHeader.show();
            iframe.css('height', iframe.attr('data-original-height'));
        }
    });

    hideBtn.appendTo($('body'));
}

function listMembersBtn() {
    $('table.d_g.d_gn').removeClass('d_g d_gn').addClass('d2l-table d2l-grid d_gl group-list');
    // .removeClass('d_g d_gn')
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
        var theForm = $('form[id="d2l_form"][action^="user_available_group_list.d2l"]');
        theForm.find('tr').each(function (i, elem) {
            var firstTD = $(elem).find('td:first-child');
            if (firstTD.text().match(/Group \d+/g)) {
                var memLink = $(elem).find('td:nth-last-child(2) a.d2l-link');
                if (memLink.length) {
                    groupID.push(memLink.attr('onclick').match(/\d+/g).join(''));
                    groupNum.push(firstTD.text().trim());
                }
            }
        });

        // ajax requests
        var finalList = [];
        var counter = 0;
        var url = new URL(currURL);
        var ou = url.searchParams.get('ou');

        function showAllGroupMembers() {

            // var target = $('.d2l-action-buttons').first();
            // var tablePlaceholder = $('<div id="darklight-all-group-members"></div>');
            // tablePlaceholder.append($('<h2 class="vui-heading-2">All Group Members</h2>'));
            // var table = $('<table class="d2l-table"></table>');
            // table.append('<thead><tr><th>Group</th><th>Name</th></tr></thead>');
            //
            // var tbody = $('<tbody></tbody>');
            // for (var i = 0, len = finalList.length; i < len; i++) {
            //     tbody.append('<tr><td>' + finalList[i]['group'] + '</td><td>' + finalList[i]['name'] + '</td></tr>');
            // }
            // tbody.appendTo(table);
            // table.appendTo(tablePlaceholder);
            // tablePlaceholder.append('<hr>');
            // tablePlaceholder.insertAfter(target);

            counter = 0;
            theForm.find('tr').each(function (idx, elem) {
                var firstTD = $(elem).find('td:first-child');
                if (firstTD.text().match(/Group \d+/g)) {
                    var memLink = $(elem).find('td:nth-last-child(2) a.d2l-link');
                    if (memLink.length) {
                        for (var i = counter, len = finalList.length; i < len; i++) {
                            if (firstTD.text().trim() == finalList[i].group) {
                                memLink.after(finalList[i].names);
                                memLink.hide();
                                break;
                            }
                            counter++;
                        }
                    }
                }
            });

            $('#darklight-all-group-members-btn').attr('data-shown', '1');
        }

        function getGroupMemberAjax() {
            blockPageMsg('Retrieving data - ' + groupNum[counter]);
            $.get('/d2l/lms/group/group_member_list.d2l?ou=' + ou + '&groupId=' + groupID[counter] + '&d2l_body_type=2', function (data) {
                var html = $($.parseHTML(data));
                var table = html.find('.d2l-grid-container .d2l-table.d2l-grid');
                var names = [];
                table.find('tr').each(function (idx, elem) {
                    var name = $(elem).text().trim();
                    if (!name.match(/Members/g)) {
                        names.push(name);
                    }
                });
                names = names.join('<br>');
                finalList.push({
                    'group': groupNum[counter],
                    'names': names
                });
                counter++;
                if (counter >= groupID.length) {
                    blockPageMsg('Done');
                    unblockPage();
                    showAllGroupMembers();
                } else {
                    // wait 100ms till next request (don't wanna blow up the server)
                    // setTimeout(getGroupMemberAjax,100);

                    // whatever
                    getGroupMemberAjax();
                }
            });
        }

        getGroupMemberAjax();

    });
}

function homepageFunc() {
    $('.d2l-homepage-header-wrapper').each(function (i, e) {
        var headText = $(e).text();
        if (headText.match(/SYSTEM ALERT/g) || headText.match(/News/g)) {
            if (options.HOME_AutoHideSysAlert) {
                // remove sys alert if empty
                var alertHtml = $(e).parent('div.d2l-widget-header').next('div.d2l-widget-content').children('div.d2l-htmlblock').first();
                var _alertHtml = alertHtml.clone();
                _alertHtml.find('a').remove();
                _alertHtml.find('script').remove();
                if (_alertHtml.text().trim() == '') {
                    $(e).parents('div.d2l-widget').remove();
                }
            }
        } else if (headText.match(/Check My System/g)) {
            if (options.HOME_HideCheckMySys) {
                $(e).parents('div.d2l-widget').remove();
            }
        }

    });
}

function init() {

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    // fix navigation
    if (options.GLB_FixNavigation) {
        fixNavigation();
    }

    // hide header
    if (currURL.match(/\/quizzing\//g) && options.QUIZ_HideHeaderBtn) {
        hideHeaderBtn();
    }

    // display group members
    if (currURL.match(/\/d2l\/lms\/group\/user_available_group_list\.d2l/g) && options.GROUP_ListMembersBtn) {
        listMembersBtn();
    }

    // hide widget homepage
    if (currURL.endsWith('/d2l/home')) {
        homepageFunc();
    }

}

init();