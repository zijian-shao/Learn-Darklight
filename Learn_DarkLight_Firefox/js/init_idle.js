$.fn.sRoot = function () {
    // require jquery object
    if (!this instanceof jQuery) {
        console.log('sRoot requires jQuery object.');
        return this;
    }
    if (this[0].shadowRoot === null) {
        return null;
    } else {
        return $(this[0].shadowRoot);
    }
};

$.fn.uwCalendar = function (action, data) {
    // e.g. $('<div/>').uwCalendar('init');

    // param
    if (typeof action === typeof undefined) action = 'init';

    // require jquery object
    if (!this instanceof jQuery) {
        console.log('uwCalendar requires jQuery object.');
        return this;
    }
    // require div tag
    else if (this.prop('tagName').toLowerCase() !== 'div') {
        console.log('uwCalendar requires div tag.');
        return this;
    }
    // require init first
    else if (action !== 'init' && !this.hasClass('darklight-homepage-calendar-widget')) {
        console.log('uwCalendar has not been initialized.');
        return this;
    }

    // init calendar widget
    if (action == 'init') {
        this.attr({
            id: 'darklight-homepage-calendar-widget',
            role: 'region',
            class: 'd2l-widget darklight-homepage-calendar-widget d2l-tile'
        });
        this.html('<div class="d2l-widget-header"><div class="d2l-homepage-header-wrapper"><h2 class="d2l-heading vui-heading-4">Upcoming Events</h2></div></div>' +
            '<div class="d2l-widget-content darklight-homepage-calendar" id="darklight-homepage-calendar"></div>' +
            '<div class="darklight-homepage-calendar-saved hidden" hidden></div>');
    }

    // loading
    else if (action == 'loading') {
        this.find('.darklight-homepage-calendar')
            .html('<div class="darklight-homepage-calendar-loading">' +
                '<div class="darklight-block-page-loader darklight-block-page-loader-d2l"></div>' +
                '<div class="darklight-homepage-calendar-loading-msg">Loading calendar (0%)</div></div>');
    }

    // loading msg
    else if (action == 'loadingMsg') {
        this.find('.darklight-homepage-calendar-loading-msg').html(data);
    }

    // list empty
    else if (action == 'empty') {
        this.find('.darklight-homepage-calendar')
            .html('<div class="d2l-msg-container d2l-datalist-empty"><div class="d2l-msg-container-inner"><div class="d2l-msg-container-text">There are no events to display.</div><div class="d2l-clear"></div></div></div>');
    }

    // show saved
    else if (action == 'switchTo') {
        var savedCal = this.find('.darklight-homepage-calendar-saved').children('div[data-panel="' + data.id + '"]');
        if (savedCal.length) {
            this.find('.darklight-homepage-calendar').html('').append(savedCal.clone());
        } else {
            console.log('No saved calendar with input panel ID ' + data.id);
            this.uwCalendar('empty');
            return this;
        }
    }

    // new list
    else if (action == 'new') {
        // data = {id: panelID, list: array}
        if (typeof data === typeof undefined) {
            console.log('uwCalendar new requires data parameter.');
            return this;
        }

        var weekdayTxt = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthTxt = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var todayTag = '', dateElem = '', dateCls = '', weekdayElem = '';
        var today = new Date();
        var targetDay = null;
        var appendText = '';

        for (var i = 0, len = data.list.length; i < len; i++) {

            targetDay = new Date(data.list[i].timestamp * 1000);
            if (targetDay.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
                todayTag = '<div class="tag">TODAY</div>';
            } else {
                todayTag = '';
            }

            if (options.HOME_ShowWeekDayOnCalendar) {
                dateCls = ' darklight-homepage-calendar-date-ani';
                weekdayElem = '<span class="weekday">' + weekdayTxt[data.list[i].weekDay].substring(0, 3).toUpperCase() + '</span>';
            } else {
                dateCls = '';
                weekdayElem = '';
            }

            dateElem = '<div class="darklight-homepage-calendar-date' + dateCls + '" title="' +
                weekdayTxt[data.list[i].weekDay] + ', ' + monthTxt[data.list[i].month] + ' ' + data.list[i].day + ', ' + data.list[i].year + '">' +
                '<span class="month">' + monthTxt[data.list[i].month].substring(0, 3).toUpperCase() + '</span>' +
                '<span class="day">' + data.list[i].day + '</span>' +
                weekdayElem +
                '</div>';

            appendText += '<a href="' + data.list[i].link + '" target="_blank" class="darklight-homepage-calendar-item">' +
                dateElem +
                '<div class="darklight-homepage-calendar-content">' +
                todayTag +
                '<div><span class="time">' + data.list[i].time + '</span>' +
                '<span class="course">' + data.list[i].course + '</span></div>' +
                '<div class="title d2l-typography">' + data.list[i].title + '</div></div></a>';
        }

        // show
        appendText = '<div data-panel="' + data.id + '">' + appendText + '</div>';
        this.find('.darklight-homepage-calendar').html(appendText);

        // save
        var savedList = this.find('.darklight-homepage-calendar-saved');
        savedList.children('div[data-panel="' + data.id + '"]').remove();
        savedList.append(appendText);
    }
    return this;
};

function injectCSS(src, tag, type) {

    var style;
    var id = 'darklight-css-' + Math.floor(Math.random() * 90000 + 10000);
    if (type === 'text') {
        style = $('<style/>', {
            id: id
        });
        style.text(src);
    } else {
        style = $('<link/>', {
            id: id,
            rel: 'stylesheet',
            type: 'text/css',
            href: src
        });
    }

    if (typeof tag === typeof {})
        tag.append(style);
    else
        $(tag).append(style);

    return id;
}

function injectJS(src, tag, type, allFrames) {

    var id = 'darklight-js-' + Math.floor(Math.random() * 90000 + 10000);
    var script = $('<script/>', {
        id: id,
        type: 'text/javascript'
    });

    if (type === 'text') {
        script.text(src);
    } else {
        script.attr('src', src);
    }

    if (typeof tag === typeof {})
        tag.append(script);
    else
        $(tag).append(script);

    if (allFrames === true) {
        $('iframe').each(function () {
            var iframeDocument = this.contentDocument || this.contentWindow.document;
            if (typeof tag !== typeof {})
                $(iframeDocument).find(tag).append(script);
            else
                console.log('Cannot inject JS to object in iframe');
        });
    }
    return id;
}

function injectCSSShadow(src, tag, type, allDom) {
    tag.each(function () {
        if (this.shadowRoot !== null) {
            injectCSS(src, $(this.shadowRoot), type);
            if (allDom === true) {
                injectCSSShadow(src, $(this.shadowRoot), type, allDom);
            }
        }
    });
    if (allDom === true) {
        tag.children('*').each(function () {
            injectCSSShadow(src, $(this), type, allDom);
        });
    }
}

function injectJSShadow(src, tag, type, allDom) {
    tag.each(function () {
        if (this.shadowRoot !== null) {
            injectJS(src, $(this.shadowRoot), type);
            if (allDom === true) {
                injectJSShadow(src, $(this.shadowRoot), type, allDom);
            }
        }
    });
    if (allDom === true) {
        tag.children('*').each(function () {
            injectJSShadow(src, $(this), type, allDom);
        });
    }
}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    html.animate({scrollTop: pos - offset}, time);

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
        '</div>')).hide().appendTo(body).fadeIn(time);

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

function isOnScreen(element) {

    if ($.type(element) === 'object')
        return (window.scrollY < element.offset().top);
    else if ($.type(element) === 'number')
        return (window.scrollY < element);

    return true;
}

function removeOverlay(forcible) {
    // if (currURL2.match(/\/d2l\/home$/)) {
    //     $('#darklight-load-overlay').delay(300).fadeOut(300, function () {
    //         $(this).remove();
    //     });
    // } else {
    //     setTimeout(function () {
    //         $('#darklight-load-overlay').on('webkitTransitionEnd transitionend', function (e) {
    //             $(this).remove();
    //         }).addClass('darklight-load-overlay-hide');
    //     }, 300);
    // }

    if (forcible === true) {
        $('.darklight-load-overlay').remove();
        $('.darklight-init-style').remove();
    } else {
        setTimeout(function () {
            $('#darklight-init-style').remove();
            $('#darklight-load-overlay').on('webkitTransitionEnd transitionend', function (e) {
                $(this).remove();
            }).addClass('darklight-load-overlay-hide');
        }, 300);
    }
}

function detectExtConflict() {

    if ($('#darklight-extension').length) {
        alert("You have multiple versions of Learn Darklight installed. Please disable one of them to avoid unexpected behaviors.");
    } else {
        $('<div id="darklight-extension"></div>').appendTo(body);
    }

}

function customFont() {

    var fontConf = options.GLB_CustomFontInfo.split('||');

    if (fontConf[0].match(/Default/i) || fontConf[0].match(/^Lato$/i)) return;

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

    var fontCssText = 'body, strong, p, a, h1, h2, h3, h4, h5, h6, input, button, select, div {font-family: "'
        + fontConf[0] + '", "Microsoft YaHei", sans-serif!important;}';
    browser.runtime.sendMessage({
        action: 'insertCSS',
        data: {code: fontCssText}
    });
}

function addBackToTopButton() {
    function _addBackToTopButton() {
        if (window.scrollY < 100)
            btn.addClass('darklight-back-to-top-hidden');
        else
            btn.removeClass('darklight-back-to-top-hidden');
    }

    var btn = $('<div/>', {
        id: 'darklight-back-to-top',
        class: 'darklight-back-to-top darklight-back-to-top-hidden'
    });
    btn.append('<i class="arrow up"></i>');
    btn.on('click', function (e) {
        e.preventDefault();
        scrollToUtil(0, 300);
    });
    btn.appendTo(body);

    _addBackToTopButton();
    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function addBackToTopButtonNavbar() {

    function _addBackToTopButton() {
        if (window.scrollY < 100)
            btn.addClass('darklight-navbar-back-to-top-hidden');
        else
            btn.removeClass('darklight-navbar-back-to-top-hidden');
    }

    var navWrapper = undefined;
    var btn = $('<div/>', {
        id: 'darklight-navbar-back-to-top',
        class: 'darklight-navbar-back-to-top'
    });
    btn.append('<a href="#"><i class="arrow up"></i></a>');
    btn.on('click', function (e) {
        e.preventDefault();
        scrollToUtil(0, 300);
    });

    navWrapper = $('d2l-navigation d2l-navigation-main-footer .d2l-navigation-s-main-wrapper');
    btn.appendTo(navWrapper);
    _addBackToTopButton();

    // var intervalCnt = 0;
    // var interval = setInterval(function () {
    //     if (typeof navWrapper === typeof undefined || !navWrapper.length) {
    //         navWrapper = $('d2l-navigation d2l-navigation-main-footer .d2l-navigation-s-main-wrapper');
    //     } else {
    //         clearInterval(interval);
    //         btn.appendTo(navWrapper);
    //         _addBackToTopButton();
    //     }
    //     intervalCnt++;
    //     if (intervalCnt > 10) {
    //         clearInterval(interval);
    //     }
    // }, 800);

    $(window).on('scroll', function () {
        _addBackToTopButton();
    });
}

function fixNavigation() {
    function _fixNavigation() {

        if (windowW < 768) return;

        if (window.scrollY < headerH) {
            // is on screen
            footer.removeClass('darklight-navbar-fixed');
            d2lnav.css('padding-bottom', '0px');
        } else {
            // not on screen
            footer.addClass('darklight-navbar-fixed');
            d2lnav.css('padding-bottom', footerH + 'px');
        }
    }

    function _initVars() {
        footerH = footer.outerHeight();
        headerH = header.outerHeight() + header.offset().top;
        d2lnavH = d2lnav.outerHeight();
        windowW = window.innerWidth;
    }

    var footer = $('d2l-navigation-main-footer');
    var header = $('d2l-navigation-main-header');
    var d2lnav = $('d2l-navigation');
    if (!footer.length || !header.length || !d2lnav.length) return;

    var footerH, headerH, d2lnavH, windowW;
    _initVars();
    _fixNavigation();

    setTimeout(function () {
        _initVars();
    }, 2000);

    $(window).on('load', function () {
        _initVars();
        _fixNavigation();
    }).on('scroll', function () {
        _fixNavigation();
    }).on('resize', function () {
        _initVars();
        if (window.innerWidth < 768) {
            d2lnav.css('padding-bottom', '0px');
        } else {
            _fixNavigation();
        }
    });
}

function fixNavigationSticky() {

    function _testIsOnScr() {
        if (window.scrollY < offset) {
            // is on screen
            pageHeader.removeClass('darklight-navbar-sticky-on');
        } else {
            // not on screen
            pageHeader.addClass('darklight-navbar-sticky-on');
        }
    }

    var header = $('d2l-navigation-main-header');
    var footer = $('d2l-navigation-main-footer');
    if (!header.length || !footer.length) return;

    var offset = themeConfigs.headerHeight;
    var pageHeader = footer.closest('header');

    pageHeader.addClass('darklight-navbar-sticky');
    pageHeader.css('top', '-' + offset + 'px');

    $(window).on('load scroll', _testIsOnScr);
}

function quizPageFunc() {

    function _getFloatButton(iconSrc, text, id) {
        if (typeof id === typeof undefined) id = '';
        else id = ' id="' + id + '"';
        return '<a href="#" class="darklight-fixed-right-button"' + id + '><div class="darklight-fixed-right-button-icon"><img src="' + iconSrc + '"></div><div class="darklight-fixed-right-button-text">' + text + '</div></a>';
    }

    function _pageFunc() {

        var wrapper = $('<div class="darklight-fixed-right-wrapper"></div>');
        wrapper.appendTo(body);

        var sizeStep = 200;

        // inc iframe
        var sizeInc = $(_getFloatButton(baseURL + 'img/button-icon-plus.png', 'Content Height <strong>+</strong>'));
        sizeInc.on('click', function (e) {
            e.preventDefault();
            var currH = iframe.attr('data-current-height');
            if (typeof currH === 'undefined')
                currH = iframe.height();
            currH = parseInt(currH);
            currH += sizeStep;
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
                currH -= sizeStep;
                iframe.css('height', currH + 'px');
                iframe.attr('data-current-height', currH);
            }
        });
        sizeDec.appendTo(wrapper);

        $(window).on('resize', function () {
            setTimeout(function () {
                if (typeof iframe.attr('data-current-height') !== typeof undefined)
                    iframe.css('height', iframe.attr('data-current-height') + 'px');
            }, 10);
        });

        // unlock body
        function _unlockBody() {
            if (body.css('overflow') == 'hidden') {
                var unlockScroll = $(_getFloatButton(baseURL + 'img/button-icon-unlock.png', 'Unlock Page Scroll'));
                unlockScroll.on('click', function (e) {
                    e.preventDefault();
                    body.css('overflow', 'auto');
                    $(this).remove();
                });
                unlockScroll.appendTo(wrapper);
            }
        }

        setTimeout(_unlockBody, 2000);
    }

    if (!options.QUIZ_ContentResizeBtn) return;

    var iframe = null;
    var getIframeCounter = 0;

    var interval = setInterval(function () {
        iframe = $('.d2l-page-main').find('iframe');
        iframe.each(function (idx, elem) {
            if ($(elem).attr('src').trim() != '') {
                iframe = $(elem);
                clearInterval(interval);
                _pageFunc();
                return false;
            }
        });
        getIframeCounter++;
        if (getIframeCounter > 20) {
            clearInterval(interval);
        }
    }, 300);

}

function contentPageFunc() {

    function _getFloatButton(iconSrc, text, id) {
        if (typeof id === typeof undefined) id = '';
        else id = ' id="' + id + '"';
        return '<a href="#" class="darklight-fixed-right-button"' + id + '><div class="darklight-fixed-right-button-icon"><img src="' + iconSrc + '"></div><div class="darklight-fixed-right-button-text">' + text + '</div></a>';
    }

    function _pageFunc() {

        var wrapper = $('<div class="darklight-fixed-right-wrapper"></div>');
        wrapper.appendTo(body);

        var sizeStep = 50;

        // inc iframe
        if (options.COURSE_ContentResizeBtn) {
            var sizeInc = $(_getFloatButton(baseURL + 'img/button-icon-plus.png', 'Content Height <strong>+</strong>'));
            sizeInc.on('click', function (e) {
                e.preventDefault();
                var currH = iframe.attr('data-current-height');
                if (typeof currH === 'undefined')
                    currH = iframe.height();
                currH = parseInt(currH);
                currH += sizeStep;
                iframe.css('height', currH + 'px');
                iframe.attr('data-current-height', currH);
            });
            sizeInc.appendTo(wrapper);
        }

        // dec iframe
        if (options.COURSE_ContentResizeBtn) {
            var sizeDec = $(_getFloatButton(baseURL + 'img/button-icon-minus.png', 'Content Height <strong>-</strong>'));
            sizeDec.on('click', function (e) {
                e.preventDefault();
                var currH = iframe.attr('data-current-height');
                if (typeof currH === 'undefined')
                    currH = iframe.height();
                currH = parseInt(currH);
                if (currH >= 300) {
                    currH -= sizeStep;
                    iframe.css('height', currH + 'px');
                    iframe.attr('data-current-height', currH);
                }
            });
            sizeDec.appendTo(wrapper);
        }

        // full height
        // if (options.COURSE_ContentResizeBtn && iframe.hasClass('d2l-iframe-fit-user-content')) {
        //     // skip if cross domain
        //     if (extractHostname(iframe.attr('src')) == window.location.hostname) {
        //         var sizeFull = $(_getFloatButton(baseURL + 'img/button-icon-arrows-alt-v.png', 'Full height (beta)'));
        //         sizeFull.on('click', function (e) {
        //             e.preventDefault();
        //             iframe.css('height', iframe.contents().height() + 'px');
        //             iframe.attr('data-full-height', 'true');
        //             $(this).hide();
        //         });
        //         sizeFull.appendTo(wrapper);
        //     }
        // }

        $(window).on('resize', function () {
            setTimeout(function () {
                if (typeof iframe.attr('data-full-height') !== typeof undefined) {
                    // sizeFull.trigger('click');
                } else if (typeof iframe.attr('data-current-height') !== typeof undefined) {
                    iframe.css('height', iframe.attr('data-current-height') + 'px');
                }
            }, 10);
        });

        function _fullScreenBtn() {
            var fullScreenBtn = iframe.contents().find('#fullscreenMode');
            if (fullScreenBtn.length && !$('#darklight-full-screen-mode').length) {

                // test is pdf or ppt
                var isPDF = false;
                if (iframe.closest('div.d2l-fileviewer').children('div.d2l-fileviewer-pdf-pdfjs').length)
                    isPDF = true;

                // org full scr btn
                fullScreenBtn.on('click', function () {
                    if (isPDF) {
                        setTimeout(function () {
                            if (!iframe.hasClass('d2l-fileviewer-rendered-pdf-dialog')) {
                                // fix for sticky navbar
                                body.css('overflow', '');
                                html.css('overflow', '');
                            }
                        }, 10);
                    }
                });

                // sidebar full scr btn
                var fullScr = $(_getFloatButton(
                    baseURL + 'img/button-icon-expand.png',
                    'Full Screen Mode',
                    'darklight-full-screen-mode')
                );
                fullScr.on('click', function (e) {
                    e.preventDefault();
                    fullScreenBtn.trigger('click');
                });
                if (options.COURSE_ContentResizeBtn)
                    fullScr.appendTo(wrapper);

                // scroll to content
                if (options.COURSE_AutoScrollToContent && window.innerWidth >= 768) {
                    var currH = 0;
                    if (options.GLB_FixNavigation) {
                        scrollToUtil(iframe, 0, $('d2l-navigation-main-footer').height());
                        currH = parseInt(window.innerHeight - $('d2l-navigation-main-footer').height());
                    } else {
                        currH = parseInt(window.innerHeight);
                    }
                    iframe.css('height', currH + 'px');
                }

                if (options.COURSE_AutoEnterFullScreen) {
                    fullScreenBtn.trigger('click');
                }

                clearInterval(fullSrcInterval);

            }
            fullSrcCounter++;
            if (fullSrcCounter > 10) {
                clearInterval(fullSrcInterval);
            }
        }

        var fullSrcInterval = null;
        var fullSrcCounter = 0;
        if (iframe.hasClass('d2l-fileviewer-rendered-pdf')) {
            fullSrcInterval = setInterval(function () {
                _fullScreenBtn();
            }, 1000);
        }

        // unlock body
        function _unlockBody() {
            if (body.css('overflow') == 'hidden') {
                var unlockScroll = $(_getFloatButton(baseURL + 'img/button-icon-unlock.png', 'Unlock Page Scroll'));
                unlockScroll.on('click', function (e) {
                    e.preventDefault();
                    body.css('overflow', 'auto');
                    $(this).hide();
                });
                unlockScroll.appendTo(wrapper);
            }
        }

        if (options.COURSE_ContentResizeBtn)
            setTimeout(_unlockBody, 2000);

    }

    // if (page == 'content' && !options.COURSE_ContentResizeBtn) return;

    var iframe = null;
    var getIframeCounter = 0;

    var interval = setInterval(function () {
        iframe = $('#ContentView').find('iframe');
        iframe.each(function (idx, elem) {
            if ($(elem).attr('src').trim() != '') {
                iframe = $(elem);
                clearInterval(interval);
                _pageFunc();

                if (iframe.hasClass('d2l-fileviewer-rendered-pdf')
                    && options.COURSE_AutoScrollToContent && window.innerWidth >= 768) {
                    if (options.GLB_FixNavigation) {
                        scrollToUtil(iframe, 100, $('d2l-navigation-main-footer').height());
                    } else {
                        scrollToUtil(iframe, 100, 0);
                    }
                }

                return false;
            }
        });
        getIframeCounter++;
        if (getIframeCounter > 20) {
            clearInterval(interval);
        }
    }, 300);

}

function fixSidePanelSelector() {

    function _initPanelSidePos() {
        // reset on mobile layout
        if (window.innerWidth <= 1000) {
            panelWrap.removeClass('fix-side-panel');
            panelSide.attr('style');
            return;
        } else {
            panelWrap.addClass('fix-side-panel');
        }
        // change height
        footerH = footer.outerHeight();
        fixNavParam1 = (options.GLB_FixNavigation) ? footerH : 0;
        fixNavParam2 = (options.GLB_FixNavigation) ? 0 : footerH;
        if (window.scrollY < themeConfigs.headerHeight + fixNavParam2) {
            panelSide.css('top', (footerH + themeConfigs.headerHeight - window.scrollY) + 'px');
            panelSide.css('height', 'calc(100vh - ' + (footerH + themeConfigs.headerHeight + panelSidePadTop - window.scrollY) + 'px)');
        } else {
            panelSide.css('top', fixNavParam1 + 'px');
            panelSide.css('height', 'calc(100vh - ' + (footerH + panelSidePadTop) + 'px)');
        }
    }

    function _initfixSidePanelSelector() {
        _initPanelSidePos();
        $(window).on('load', function () {
            _initPanelSidePos();
            setTimeout(function () {
                _initPanelSidePos();
            }, 200);
        }).on('scroll', function () {
            _initPanelSidePos();
        }).on('resize', function () {
            _initPanelSidePos();
        });
    }

    if (!options.COURSE_FixSidePanelSelector) return;

    var panelWrap = $('.d2l-twopanelselector-wrapper');
    var panelSide = $('.d2l-twopanelselector-side');
    if (!panelWrap.length || !panelSide.length) return;
    var panelSidePadTop = Number(panelSide.css('padding-top').match(/\d+/g)[0]);
    var footerH = 0;
    var footer = $('d2l-navigation-main-footer');
    var fixNavParam1 = (options.GLB_FixNavigation) ? footerH : 0;
    var fixNavParam2 = (options.GLB_FixNavigation) ? 0 : footerH;

    // wait for footer
    if (footer.length) {
        _initfixSidePanelSelector();
    } else {
        var waitNavIntCnt = 0;
        var waitNavInt = setInterval(function () {
            if (footer.length) {
                clearInterval(waitNavInt);
                _initfixSidePanelSelector();
            } else {
                footer = $('d2l-navigation-main-footer');
            }
            waitNavIntCnt++;
            if (waitNavIntCnt > 50) {
                clearInterval(waitNavInt);
            }
        }, 200);
    }
}

function openContentInNewTab() {

    if (!options.COURSE_OpenContentInNewTab) return;

    function _openContentInNewTab() {
        tabPanel.querySelectorAll('.d2l-datalist-container .d2l-datalist .d2l-datalist-item .d2l-inline .d2l-link').forEach(function (el) {
            el.setAttribute('target', '_blank');
        });
    }

    var tabPanel = document.getElementById('d2l_two_panel_selector_main');
    if (tabPanel !== null) {
        _openContentInNewTab();
        var observer = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.attributeName === 'aria-live') {
                    _openContentInNewTab();
                }
            }
        });
        observer.observe(tabPanel, {attributes: true});
    }
}

function listMembersBtn() {

    var theForm = $('form[id="d2l_form"][action^="user_available_group_list.d2l"]');
    if (theForm.find('table').first().text().match(/No items found/g))
        return;

    $('table.d_g.d_gn').removeClass('d_g d_gn').addClass('d2l-table d2l-grid d_gl group-list');
    browser.runtime.sendMessage({
        action: 'insertCSS',
        data: {
            code: '.group-list th,.group-list td{border-width:1px!important;border-style:solid!important;padding:5px 15px!important;}'
        }
    });

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
        var headSelf = $(e), headText = headSelf.text();
        if (headText.match(/SYSTEM ALERT/) || headText.match(/News/)) {
            if (options.HOME_AutoHideSysAlert) {
                if (!isWLU()) {
                    // remove sys alert if empty
                    var alertHtmlDom = headSelf.closest('.d2l-widget').find('.d2l-widget-content .d2l-htmlblock').first();
                    var _alertHtml = alertHtmlDom.clone();
                    _alertHtml.find('a').remove();
                    _alertHtml.find('script').remove();
                    if (_alertHtml.text().trim() === '') {
                        headSelf.closest('.d2l-widget').addClass('hidden');
                    } else if (typeof (Storage) !== typeof undefined) {
                        // hide for 24 hours
                        var hideSysTime = window.localStorage.getItem('Darklight.Timestamp.HideSystemAlert');
                        if (hideSysTime !== null && Math.floor(Date.now() / 1000) - hideSysTime < 86400) {
                            headSelf.closest('.d2l-widget').addClass('hidden');
                        } else {
                            var moreLink = alertHtmlDom.find("p a:contains('Alert History')");
                            var hideLink = $('<a href="#" style="float:right">Hide For 24 Hours</a>');
                            hideLink.insertBefore(moreLink);
                            hideLink.on('click', function (e) {
                                e.preventDefault();
                                headSelf.closest('.d2l-widget').addClass('hidden');
                                window.localStorage.setItem('Darklight.Timestamp.HideSystemAlert', Math.floor(Date.now() / 1000).toString());
                            });
                        }
                    }
                } else {
                    // remove news if empty
                    var _content = headSelf.closest('.d2l-widget').find('.d2l-widget-content');
                    if (_content.find('.d2l-msg-container').length && _content.find('.d2l-msg-container').text().match(/There are no/)) {
                        headSelf.closest('.d2l-widget').addClass('hidden');
                    }
                }
            }
        } else if (headText.match(/Check My System/) && !isWLU()) {
            if (options.HOME_HideCheckMySys) {
                headSelf.closest('div.d2l-widget').addClass('hidden');
            }
        } else if (headText.match(/Courses and Communities/) && !isWLU()) {

            courseWidget = headSelf.closest('div.d2l-widget');
            // courseWidget.addClass('darklight-homepage-courses-widget');

            if (options.HOME_AddCalendar) {
                var calendarWidget = $('<div/>');
                calendarWidget.uwCalendar('init').uwCalendar('loading').insertAfter(courseWidget);
            }

            function _waitForCourseLoad(isTabSwitch) {

                function _getPanelSelected() {
                    return d2lMyCourses.shadowRoot.querySelector('d2l-tabs > d2l-tab-panel[selected]');
                }

                function _getSpinner() {
                    var pn = _getPanelSelected();
                    if (pn !== null) {
                        return _getPanelSelected().querySelector('d2l-my-courses-content').shadowRoot
                            .querySelector('div.spinner-container > d2l-loading-spinner');
                    } else {
                        return null;
                    }
                }

                var d2lMyCourses = courseWidget[0].querySelector('.d2l-widget-content > .d2l-widget-content-padding > d2l-my-courses');

                // if (isTabSwitch !== true) {
                //     var d2lMyCoursesLoading = document.createElement('div');
                //     d2lMyCoursesLoading.className = 'darklight-homepage-courses-loading';
                //     d2lMyCoursesLoading.id = 'darklight-homepage-courses-loading';
                //     d2lMyCoursesLoading.innerHTML = '<div class="darklight-block-page-loader darklight-block-page-loader-d2l"></div>';
                //     d2lMyCourses.parentNode.append(d2lMyCoursesLoading);
                // }

                var waitCourseLoadingInt = setTimeout(function () {
                    $('#darklight-homepage-courses-loading').hide();
                    courseWidget.addClass('darklight-homepage-courses-widget-complete');
                }, 5000);

                if (options.HOME_HideCourseTabSelector)
                    injectCSS('d2l-tab-panel {margin: 0!important;}', $(d2lMyCourses.shadowRoot), 'text');

                var loadSpinner = _getSpinner();

                var intervalVal = 0, delayVal = 0, intervalCounter = 0;

                if (isBrowser('firefox')) {
                    intervalVal = 300;
                    delayVal = 500;
                } else {
                    intervalVal = 200;
                    delayVal = 200;
                }

                var intervalId = setInterval(function () {
                    if (loadSpinner === null) {
                        loadSpinner = _getSpinner();
                    } else if (!loadSpinner.hasAttribute('hidden')
                        || (_getPanelSelected().querySelector('d2l-my-courses-content').shadowRoot
                                .querySelector('.my-courses-content > .course-tile-grid > d2l-enrollment-card') === null
                            && !_getPanelSelected().querySelector('d2l-my-courses-content').shadowRoot.querySelector('.my-courses-content > d2l-alert').hasAttribute('hidden'))
                    ) {
                        // not loaded yet
                    } else {

                        var myPanel = _getPanelSelected();
                        var myPanelID = myPanel.id;
                        var myEnrollCards = myPanel.querySelector('d2l-my-courses-content').shadowRoot
                            .querySelectorAll('.my-courses-content > .course-card-grid > d2l-enrollment-card');
                        var myCards = [];

                        var courseTileLoaded = true;

                        myEnrollCards.forEach(function (el) {
                            if (!el.shadowRoot.querySelector('d2l-card > div[slot="header"] > div.d2l-enrollment-card-image-container > d2l-course-image').shadowRoot.querySelector('img').hasAttribute('src')
                                || el.shadowRoot.querySelector('d2l-card > div.d2l-enrollment-card-content-flex > d2l-organization-name').shadowRoot.textContent.trim() === '')
                                courseTileLoaded = false;
                        });

                        if (courseTileLoaded) {
                            // loaded
                            clearInterval(intervalId);
                            clearTimeout(waitCourseLoadingInt);

                            var hideStyle = '';
                            if (options.HOME_HideCoverPic)
                                hideStyle += 'd2l-card .d2l-enrollment-card-image-container {padding-top:0%!important}';
                            if (options.HOME_HideMetaTerm)
                                hideStyle += 'd2l-card d2l-organization-info {display: none!important}';
                            if (options.HOME_HideMetaEndDate)
                                hideStyle += 'd2l-card d2l-user-activity-usage {display: none!important}';
                            if (options.HOME_HidePinnedIcon)
                                hideStyle += 'd2l-card d2l-button-icon[icon="d2l-tier1:pin-filled"] {display: none!important}';

                            var times = isTabSwitch ? 4 : 1;

                            setTimeout(function () {

                                // on tabs available
                                if (isTabSwitch !== true) {
                                    injectCSS(baseURL + 'css/shadow_course_tab.css', $(d2lMyCourses.shadowRoot.querySelector(':host > d2l-tabs').shadowRoot), 'file');
                                    if (typeof themeOnCourseTabAvailable === 'function') {
                                        themeOnCourseTabAvailable(d2lMyCourses.shadowRoot.querySelector(':host > d2l-tabs'));
                                    }
                                }

                                // init cards
                                myEnrollCards.forEach(function (el) {

                                    // find elements
                                    var theCard = el.shadowRoot.querySelector('d2l-card'),
                                        id = theCard.shadowRoot.querySelector('div.d2l-card-container a.d2l-focusable').getAttribute('href').match(/\/\d+/)[0].substring(1),
                                        title = theCard.querySelector('div.d2l-enrollment-card-content-flex d2l-organization-name').shadowRoot.textContent,
                                        linkElem = theCard.shadowRoot.querySelector('div.d2l-card-container > a.d2l-focusable'),
                                        link = linkElem.getAttribute('href');
                                    title = title.trim().split(' - ')[0];

                                    // css
                                    injectCSS(hideStyle, $(el.shadowRoot), 'text');
                                    injectCSS(baseURL + 'css/shadow_course_tile.css', $(el.shadowRoot), 'file');

                                    // inner css
                                    injectCSS(baseURL + 'css/shadow_course_tile_inner.css', $(theCard.shadowRoot), 'file');

                                    // dropdown
                                    theCard.querySelector('d2l-dropdown-more').addEventListener('click', function () {
                                        if (!this.hasAttribute('data-dropdown-init')) {
                                            this.setAttribute('data-dropdown-init', '');
                                            injectCSS(baseURL + 'css/shadow_dropdown.css', $(this.querySelector('d2l-dropdown-menu').shadowRoot), 'file');
                                        }
                                        if (typeof themeOnCourseDropdownClick === 'function') {
                                            themeOnCourseDropdownClick(this);
                                        }
                                    });

                                    myCards.push({
                                        id: id,
                                        title: title,
                                        link: link,
                                        linkElem: linkElem,
                                        cardRoot: theCard
                                    });

                                    if (typeof themeOnCourseTileLoaded === 'function') {
                                        themeOnCourseTileLoaded(theCard);
                                    }
                                });

                                setTimeout(function () {
                                    $('#darklight-homepage-courses-loading').hide();
                                    courseWidget.addClass('darklight-homepage-courses-widget-complete');
                                }, 100);

                                // calendar
                                homepageCalendar(myCards, myPanelID);
                                // custom course thumb
                                customCourseThumbs(myCards);
                                // direct to content
                                courseDirectToContent(myCards);
                                // quick access
                                courseTileContextMenu(myPanel, myCards);

                            }, delayVal * times);

                            // tab change
                            if (isTabSwitch !== true) {

                                d2lMyCourses.shadowRoot.querySelector('d2l-tabs').shadowRoot
                                    .querySelectorAll('div.d2l-tabs-layout > div.d2l-tabs-container > div.d2l-tabs-container-list > d2l-tab')
                                    .forEach(function (el) {
                                        $(el).on('click', function (e) {

                                            // if ($(this).attr('aria-selected') === 'true') return;

                                            $('#darklight-homepage-calendar-widget').uwCalendar('loading');

                                            $('#darklight-homepage-courses-loading').show();
                                            courseWidget.removeClass('darklight-homepage-courses-widget-complete');

                                            setTimeout(function () {
                                                _waitForCourseLoad(true);
                                            }, 100);
                                        });
                                    });
                                if (options.HOME_HideCourseTabSelector) {
                                    injectCSS('.d2l-tabs-layout {height:0!important; border:none!important;}',
                                        $(d2lMyCourses.shadowRoot.querySelector('d2l-tabs').shadowRoot), 'text');
                                }
                            }

                        }
                    }

                    intervalCounter++;
                    if (intervalCounter > 50) {
                        clearInterval(intervalId);
                    }

                }, intervalVal);

            }

            setTimeout(function () {
                _waitForCourseLoad();
            }, 800);

        } else if (headText.match(/Calendar/) && isWLU()) {
            // for WLU homepage calendar
            headSelf.closest('div.d2l-widget').addClass('darklight-course-home-calendar');
        } else if (headText.match(/Announcements/) && !isWLU()) {
            announcementWidget = headSelf.closest('div.d2l-widget');
        }
    });

    // switch calendar and announce
    if (options.HOME_SwitchAnnounceAndCalendar && options.HOME_AddCalendar) {
        if (announcementWidget != null) {
            $('.darklight-homepage-calendar-widget').insertBefore(announcementWidget);
            announcementWidget.insertAfter(courseWidget);
        }
    }

    // remove homepage privacy notice
    if (options.HOME_HidePrivacy) {
        $('.homepage-col-12 .d2l-heading').each(function () {
            if ($(this).text().match(/Privacy/)) {
                $(this).closest('div.homepage-col-12').addClass('hidden');
            }
        });
    }

    // remove announcement inline styles
    if (announcementWidget != null) {
        removeAnnouncePageFormat(true, announcementWidget);
    }
}

function homepageCalendar(cards, panelID) {
    if (isWLU()) return;

    if (!options.HOME_AddCalendar) return;

    var tabsRoot = document.getElementsByTagName('d2l-my-courses')[0].shadowRoot.querySelector('d2l-tabs');

    if (tabsRoot.querySelector('#' + panelID).hasAttribute('data-calendar-init')) {
        $('#darklight-homepage-calendar-widget').uwCalendar('switchTo', {
            id: panelID
        });
        return;
    }

    var links = [];

    cards.forEach(function (e) {
        if (e.linkElem.hasAttribute('data-home-href')) {
            links.push({
                url: e.linkElem.getAttribute('data-home-href'),
                name: e.title
            });
        } else if (e.linkElem.hasAttribute('href')) {
            links.push({
                url: e.linkElem.getAttribute('href'),
                name: e.title
            });
        }
    });

    var counter = 0;
    var finalList = [];
    var uwCal = $('#darklight-homepage-calendar-widget');

    function _sortEvents(a, b) {
        if (a.timestamp < b.timestamp)
            return -1;
        if (a.timestamp > b.timestamp)
            return 1;
        return 0;
    }

    function _displayEvents() {
        if (finalList.length === 0) {
            uwCal.uwCalendar('empty');
        } else {
            finalList.sort(_sortEvents);
            uwCal.uwCalendar('new', {
                id: panelID,
                list: finalList
            });
        }
        tabsRoot.querySelector('#' + panelID).setAttribute('data-calendar-init', '1');
    }

    function _getCoursePageAjax() {

        if (!links.length) {
            _displayEvents();
            return;
        }

        $.ajax({
            type: 'get',
            url: currURLHost + links[counter].url,
            success: function (data) {
                var _html = $($.parseHTML(data));
                var calendar = null;

                // get widget header
                _html.find('.d2l-homepage .d2l-widget .d2l-widget-header').each(function (i, e) {
                    var headerSelf = $(e);
                    if (headerSelf.text().match(/Calendar/g)) {

                        // get calendar header
                        headerSelf.next('.d2l-widget-content').find('.d2l-collapsepane-header').each(function (i2, e2) {
                            var paneHeaderSelf = $(e2);
                            if (paneHeaderSelf.text().match(/Upcoming events/g)) {

                                // get calendar list content
                                calendar = paneHeaderSelf.next('.d2l-collapsepane-content').find('ul.d2l-datalist');
                                if (calendar.children('li.d2l-datalist-item').length > 0) {

                                    // if found event
                                    calendar.children('li.d2l-datalist-item').each(function (i3, e3) {
                                        var calendarItemSelf = $(e3);

                                        var dataContent = calendarItemSelf.children('div.d2l-datalist-item-content').first();
                                        dataContent.find('div.d2l-clear').remove();

                                        var date = dataContent.children('div').first().children('div').first();
                                        var month = date.children('div').first().text().trim();
                                        var day = date.children('div').last().text().trim();
                                        var time = dataContent.children('div').first().children('div').last().children('span').first().text().trim();
                                        var title = dataContent.children('div').first().children('div').last().children('div').last().text().trim();
                                        var link = calendarItemSelf.find('#' + calendarItemSelf.attr('data-d2l-actionid')).attr('href');
                                        link = link.substring(0, link.indexOf('#'));
                                        var currYear = (new Date()).getFullYear();
                                        var theDate;

                                        if (!time.match(/\d+:\d+ [APM]{2}/g)) {
                                            // 'all day' events have highest priority
                                            theDate = new Date(month + ' ' + day + ', ' + currYear + ' 00:00:00');
                                        } else {
                                            theDate = new Date(month + ' ' + day + ', ' + currYear + ' ' + time);
                                        }

                                        finalList.push({
                                            'course': links[counter].name,
                                            'timestamp': theDate.getTime() / 1000,
                                            'year': theDate.getFullYear(),
                                            'month': theDate.getMonth(),
                                            'day': day,
                                            'weekDay': theDate.getDay(),
                                            'time': time,
                                            'title': title,
                                            'link': link
                                        });
                                    });

                                }
                                return false;
                            }
                        });
                        return false;
                    }

                });

                counter++;
                uwCal.uwCalendar('loadingMsg', 'Loading calendar (' + Math.ceil(counter / links.length * 100) + '%)');
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

function customCourseThumbs(cards) {

    if (!options.COURSE_CustomThumb || isWLU()) return;

    // homepage tiles
    if (typeof cards !== typeof undefined) {
        cards.forEach(function (el) {
            el.cardRoot.classList.add('darklight-course-thumb');
            if (thumbData.hasOwnProperty('ID_' + el.id)) {
                var enrollCardImg = el.cardRoot.querySelector('div[slot="header"] > div.d2l-enrollment-card-image-container');
                enrollCardImg.style.backgroundImage = 'url(' + thumbData['ID_' + el.id]['thumb_image'] + ')';
                enrollCardImg.querySelector('d2l-course-image').style.opacity = '0';
                thumbData['ID_' + el.id]['exists'] = true;
            }

            var moreBtn = el.cardRoot.querySelector('d2l-dropdown-more');
            $(moreBtn).on('click', function (e) {
                var dropDownMenu = moreBtn.querySelector('d2l-dropdown-menu');
                if (dropDownMenu.querySelector('d2l-menu > d2l-menu-item[darklight-custom-course-pic]') === null) {
                    var menuLink = document.createElement('d2l-menu-item');
                    menuLink.setAttribute('darklight-custom-course-pic', '');
                    // var menuLink = $('<d2l-menu-item darklight-custom-course-pic><span class="style-scope d2l-menu-item darklight-custom-course-pic-text">Customize</span></d2l-menu-item>');
                    menuLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        browser.runtime.sendMessage({
                            action: 'createTab',
                            data: {
                                url: baseURL + 'html/options.html?action=add-custom-cover&course-id=' + el.id + '&course-name=' + encodeURIComponent(el.title)
                            }
                        });
                    });

                    dropDownMenu.querySelector('d2l-menu').appendChild(menuLink);
                    menuLink.shadowRoot.querySelector('span').textContent = 'Customize';
                }
            });
        });

        // var hasUnused = false;
        // for (var k in thumbData) {
        //     if (!thumbData[k].hasOwnProperty('exists')) {
        //         // console.log(thumbData[k]['course_id'] + ' does not exists');
        //         hasUnused = true;
        //     }
        // }
        // if (hasUnused) {
        //     alert('[LEARN DARKLIGHT]\n' +
        //         'You have unused custom course cover picture. ' +
        //         'Please remember to remove them to improve extension performance.');
        // }
    }

    // course home banner
    else {
        var code = currURL.split('/');
        code = code[code.length - 1].match(/\d+/);
        $('.d2l-course-banner').addClass('darklight-course-thumb-one darklight-course-thumb-' + code);
    }
}

function courseDirectToContent(cards) {

    if (!options.COURSE_DirectToContent) return;

    // homepage
    if (typeof cards !== typeof undefined) {
        cards.forEach(function (e) {
            if (!e.linkElem.hasAttribute('data-home-href')) {
                e.linkElem.setAttribute('data-home-href', e.link);
                e.linkElem.setAttribute('href', e.link.replace('/d2l/home/', '/d2l/le/content/') + '/Home');
            }
        });
    }
    // navbar
    else {

        var d2lNavigation = document.querySelector('d2l-navigation');
        if (d2lNavigation === null) return;
        if (document.querySelector('.d2l-navigation-s-course-menu') === null) return;

        var courseBtn = undefined;
        var intervalCnt = 0, intervalCnt2 = 0;

        // wait for course selector button
        var interval = setInterval(function () {

            if (typeof courseBtn === typeof undefined || !courseBtn.length) {
                courseBtn = $(document.querySelector('.d2l-navigation-s-course-menu d2l-dropdown d2l-navigation-button-notification-icon')
                    .shadowRoot.querySelector(':host > d2l-navigation-button')
                    .shadowRoot.querySelector(':host > button'));
            } else {
                clearInterval(interval);

                courseBtn.on('click', function () {

                    var d2lBtn = $(document.querySelector('.d2l-navigation-s-course-menu d2l-dropdown d2l-navigation-button-notification-icon')
                        .shadowRoot.querySelector(':host > d2l-navigation-button'));

                    // wait for dropdown menu
                    var interval2 = setInterval(function () {

                        if (d2lBtn.attr('aria-expanded') === 'true') {
                            clearInterval(interval2);

                            var links = $('#courseSelectorId').find('ul.d2l-datalist.vui-list li a.d2l-link.d2l-datalist-item-actioncontrol');
                            links.each(function (idx, elem) {
                                var el = $(elem);
                                if (typeof el.attr('data-home-href') === typeof undefined) {
                                    el.attr('data-home-href', el.attr('href'));
                                    el.attr('href', el.attr('href').replace('/d2l/home/', '/d2l/le/content/') + '/Home');
                                }
                            });
                        }

                        intervalCnt2++;
                        if (intervalCnt2 > 40) {
                            clearInterval(interval2);
                        }

                    }, 200);

                });
            }

            intervalCnt++;
            if (intervalCnt > 20) {
                clearInterval(interval);
            }

        }, 500);
    }
}

function courseTileContextMenu(panel, cards) {

    if (!options.HOME_CourseTileContextMenu) return;

    function _showContextMenu(id, contentList, pos, courseName) {
        $('#darklight-context-menu').remove();
        var menu = '';

        if (courseName !== undefined) {
            menu += '<li class="d2l-contextmenu-item-header"><div>' + courseName + '</div></li>';
        }
        contentList.forEach(function (cl) {
            var menuTmp = '', cntTmp = 0;

            cl.list.forEach(function (c) {
                if (c.visible) {
                    menuTmp += '<li class="d2l-contextmenu-item" role="presentation">' +
                        '<a class="vui-dropdown-menu-item-link" tabindex="-1" role="menuitem" href="';
                    if (c.name == 'Course Home') {
                        menuTmp += '/d2l/home/' + id;
                    } else if (c.name == 'Content') {
                        menuTmp += '/d2l/le/content/' + id + '/Home';
                    } else if (c.name == 'Grades') {
                        menuTmp += '/d2l/lms/grades/my_grades/main.d2l?ou=' + id;
                    } else if (c.name == 'Dropbox') {
                        menuTmp += '/d2l/lms/dropbox/dropbox.d2l?ou=' + id;
                    } else if (c.name == 'Quizzes') {
                        menuTmp += '/d2l/lms/quizzing/quizzing.d2l?ou=' + id;
                    } else if (c.name == 'Surveys') {
                        menuTmp += '/d2l/lms/survey/surveys.d2l?ou=' + id;
                    } else if (c.name == 'Classlist') {
                        menuTmp += '/d2l/lms/classlist/classlist.d2l?ou=' + id;
                    } else if (c.name == 'Discussions') {
                        menuTmp += '/d2l/le/' + id + '/discussions/List';
                    } else if (c.name == 'Groups') {
                        menuTmp += '/d2l/lms/group/group_list.d2l?ou=' + id;
                    } else if (c.name == 'Online Rooms') {
                        menuTmp += '/d2l/im/onlinerooms/roomlist.d2l?ou=' + id;
                    } else if (c.name == 'Checklist') {
                        menuTmp += '/d2l/lms/checklist/checklists.d2l?ou=' + id;
                    } else if (c.name == 'Rubrics') {
                        menuTmp += '/d2l/lp/rubrics/list.d2l?ou=' + id;
                    }
                    menuTmp += '"><span>' + c.name + '</span></a></li>';
                    cntTmp++;
                }
            });


            if (cl.name !== undefined && cntTmp > 0) {
                var extra = '';
                if (cl.name == '') extra = ' empty';
                menuTmp = '<li class="d2l-contextmenu-item-title' + extra + '"><div>' + cl.name + '</div></li>' + menuTmp;
            }

            menu += menuTmp;

        });

        menu = $(menu);
        menu.find('li').first().addClass('d2l-first-visible-item');
        menu.find('li').last().addClass('d2l-last-visible-item');
        var ul = $('<ul class="d2l-contextmenu-daylightoff" ' +
            'data-floatingcontainerid="darklight-context-menu" ' +
            'role="presentation"></ul>');
        menu.appendTo(ul);
        var contain = $('<div id="darklight-context-menu" ' +
            'class="d2l-floating-container vui-dropdown-menu d2l-floating-container-autoclose darklight-context-menu" role="menu" ' +
            'tabindex="0"></div>');
        ul.appendTo(contain);
        var zindex = 90;
        if (panel === undefined) zindex = 1500;
        contain.css({
            left: pos.x,
            top: pos.y,
            'z-index': zindex
        });
        contain.appendTo(body);

        if (contain.height() + (pos.y - window.scrollY + 20) > window.innerHeight
            && contain.height() < window.innerHeight - 100
            && contain.height() < pos.y - $('body header').height()) {
            contain.css({
                top: pos.y - contain.height()
            });
        }

        contain.find('li.d2l-contextmenu-item').hover(function () {
            $(this).addClass('d2l-contextmenu-item-hover vui-dropdown-menu-item-focus');
        }, function () {
            $(this).removeClass('d2l-contextmenu-item-hover vui-dropdown-menu-item-focus');
        });

        html.on('click', function (e) {
            // if (!$(e.target).closest('#darklight-context-menu').length) {
            //     $('#darklight-context-menu').remove();
            // }
            if (!$('#darklight-context-menu').has(e.target).length) {
                $('#darklight-context-menu').remove();
            }
            // if (!e.target.matches('#darklight-context-menu')) {
            //     $('#darklight-context-menu').remove();
            // }
        });

    }

    // homepage
    if (typeof panel !== typeof undefined) {
        if (panel.hasAttribute('data-context-menu-init')) return;
        panel.setAttribute('data-context-menu-init', 'true');

        var contentList = options.HOME_CourseTileContextMenuData;

        cards.forEach(function (el) {
            $(el.linkElem).contextmenu(function (e) {
                e.preventDefault();
                _showContextMenu(el.id, contentList, {
                    x: e.pageX,
                    y: e.pageY
                });
            });
        });
    }
    // course selector
    else {

        var d2lNavigation = document.querySelector('d2l-navigation');
        if (d2lNavigation === null) return;
        if (document.querySelector('.d2l-navigation-s-course-menu') === null) return;

        var courseBtn = undefined;
        var intervalCnt = 0, intervalCnt2 = 0;
        var contentList = options.HOME_CourseTileContextMenuData;

        // wait for course selector button
        var interval = setInterval(function () {

            if (typeof courseBtn === typeof undefined || !courseBtn.length) {
                courseBtn = $(document.querySelector('.d2l-navigation-s-course-menu d2l-dropdown d2l-navigation-button-notification-icon')
                    .shadowRoot.querySelector(':host > d2l-navigation-button')
                    .shadowRoot.querySelector(':host > button'));
            } else {
                clearInterval(interval);

                courseBtn.on('click', function () {

                    var d2lBtn = $(document.querySelector('.d2l-navigation-s-course-menu d2l-dropdown d2l-navigation-button-notification-icon')
                        .shadowRoot.querySelector(':host > d2l-navigation-button'));

                    // wait for dropdown menu
                    var interval2 = setInterval(function () {

                        if (d2lBtn.attr('aria-expanded') === 'true') {
                            clearInterval(interval2);

                            var linksLi = $('#courseSelectorId').find('ul.d2l-datalist.vui-list li');
                            linksLi.each(function (idx, elem) {
                                var el = $(elem).find('a.d2l-link.d2l-datalist-item-actioncontrol');
                                if (typeof el.attr('data-context-menu-init') === typeof undefined) {
                                    el.attr('data-context-menu-init', 'true');
                                    var code = el.attr('href').match(/\/\d+/)[0].substring(1);
                                    var name = el.text().trim().split(' - ')[0];
                                    $(elem).contextmenu(function (e) {
                                        e.preventDefault();
                                        _showContextMenu(code, contentList, {
                                            x: e.pageX,
                                            y: e.pageY
                                        }, name);
                                    });
                                }
                            });
                        }

                        intervalCnt2++;
                        if (intervalCnt2 > 40) {
                            clearInterval(interval2);
                        }

                    }, 200);

                });
            }

            intervalCnt++;
            if (intervalCnt > 20) {
                clearInterval(interval);
            }

        }, 500);

    }
}

function dropboxMarkFunc() {
    var header = $('div.sticky-assessment-navigation');
    if (!header.length) return;

    var hideBtn = $('<div class="dropbox-header-toggle">Toggle Header</div>');
    hideBtn.on('click', function (e) {
        e.preventDefault();
        header.toggle();
    });
    hideBtn.insertAfter(header);
}

function removeAnnouncePageFormat(isHomepage, announcementWidget, counter) {
    function _removeCSS(elem) {
        elem.css({
            'font-size': '',
            'line-height': '',
            'margin': '',
            'padding': '',
            'font-family': ''
        });

        // remove invisible color under dark theme
        if (themeConfigs.brightness === 'dark') {
            $.each(elem, function (i, e) {
                var self = $(e);
                var orgSty = self.attr('style');
                if (typeof orgSty !== typeof undefined) {
                    var hex = rgb2hex(self.css('color'));
                    if (orgSty.match(/color\:/g) && !orgSty.match(/-color\:/g) && invertColor(hex, true).toLowerCase() === '#ffffff') {
                        self.css('color', invertColor(hex));
                    }
                }
            });
        }

    }

    if (!options.HOME_RemoveAnnounceFormat) return;

    if (counter === undefined) {
        counter = 0;
    } else if (counter > 20) {
        return;
    }

    if (isHomepage === true) {

        if (announcementWidget.find('ul.d2l-datalist li.d2l-datalist-item div.d2l-htmlblock template').length) {
            setTimeout(function () {
                removeAnnouncePageFormat(true, announcementWidget, ++counter);
            }, 500);
            return;
        }

        announcementWidget.find('div.d2l-widget-content ul.d2l-datalist').children('li').each(function (i, e) {
            _removeCSS($(e).find('div.d2l-htmlblock').find('p, span, ul, ol, li, table, tr, th, td'));
        });

    } else {
        var announceTable = $('d2l-table-wrapper');

        if (!announceTable.length || announceTable.find('ul.d2l-datalist li.d2l-datalist-item div.d2l-htmlblock template').length) {
            setTimeout(function () {
                removeAnnouncePageFormat(false, null, ++counter);
            }, 500);
            return;
        }

        setTimeout(function () {
            announceTable.find('table.d2l-table tr.d_detailsRow').each(function (i, e) {
                _removeCSS($(e).find('td div.d2l-htmlblock').find('p, span, ul, ol, li, table, tr, th, td'));
            });
        }, 500);

    }

}

function waitForNavbarReady() {

    function onNavbarReady() {
        if (options.GLB_FixNavigation && options.GLB_BackToTopButtonNavbar) {
            addBackToTopButtonNavbar();
        }

        // fix navigation
        if (options.GLB_FixNavigation) {
            // fixNavigation();
            fixNavigationSticky();
        }

        if (typeof themeOnNavbarReady === 'function') {
            themeOnNavbarReady(d2lNavigation);
        }

        setTimeout(function () {
            $('d2l-navigation').removeClass('darklight-navigation-hidden');
        }, 0);
    }

    function testNavbarReady() {
        if (d2lNavigation.shadowRoot === null) return false;
        if (d2lNavigationMainHeader === null || d2lNavigationMainHeader.shadowRoot === null) return false;
        if (d2lNavigationMainFooter !== null && d2lNavigationMainFooter.shadowRoot === null) return false;

        var d2lNavigationButtonNotificationIconReady = true;
        d2lNavigationButtonNotificationIcon.forEach(function (el) {
            if (el.shadowRoot === null) d2lNavigationButtonNotificationIconReady = false;
        });
        if (!d2lNavigationButtonNotificationIconReady) return false;

        if (d2lNavigationButtonNotificationIcon === null || d2lNavigationButtonNotificationIcon.shadowRoot === null) return false;
        if (d2lNavigationSeparator === null || d2lNavigationSeparator.shadowRoot === null) return false;
        if (d2lNavigationLinkImage === null || d2lNavigationLinkImage.shadowRoot === null) return false;
        if (d2lNavigationBandMobile === null || d2lNavigationBandMobile.shadowRoot === null) return false;
        if (d2lNavigationLinkImageMobile === null || d2lNavigationLinkImageMobile.shadowRoot === null) return false;

        return true;
    }

    var d2lNavigation = document.querySelector('d2l-navigation');
    if (d2lNavigation === null) {
        $('d2l-navigation').removeClass('darklight-navigation-hidden');
        return;
    }

    var d2lNavigationMainHeader = d2lNavigation.querySelector('d2l-navigation-main-header'),
        d2lNavigationMainFooter = d2lNavigation.querySelector('d2l-navigation-main-footer');
    if (d2lNavigationMainHeader !== null && d2lNavigationMainFooter === null) {
        if (typeof themeOnNavbarReady === 'function')
            themeOnNavbarReady(d2lNavigation);
        $('d2l-navigation').removeClass('darklight-navigation-hidden');
        return;
    }

    var d2lNavigationSMobileMenu = d2lNavigation.querySelector('.d2l-navigation-s-mobile-menu'),
        d2lNavigationButtonNotificationIcon = d2lNavigationMainHeader.querySelectorAll('d2l-navigation-button-notification-icon'),
        d2lNavigationSeparator = d2lNavigationMainHeader.querySelector('d2l-navigation-separator'),
        d2lNavigationLinkImage = d2lNavigationMainHeader.querySelector('d2l-navigation-link-image'),
        d2lNavigationBandMobile = d2lNavigationSMobileMenu.querySelector('d2l-navigation-band'),
        d2lNavigationLinkImageMobile = d2lNavigationSMobileMenu.querySelector('d2l-navigation-band');

    var waitIntCnt = 0;
    var waitInt = setInterval(function () {
        if (testNavbarReady()) {
            clearInterval(waitInt);
            onNavbarReady();
        } else {
            waitIntCnt++;
            if (waitIntCnt > 100) {
                clearInterval(waitInt);
                onNavbarReady();
            }
        }
    }, 200);

}

function replaceLogo(logoPath, logoFile) {
    var logoImg = $('d2l-navigation-link-image');
    logoImg.each(function () {
        $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', logoPath + logoFile);
    });

    var themeInvCnt = 0;
    var dlightThemeInterval = setInterval(function () {
        if (!logoImg.length) {
            logoImg = $('d2l-navigation-link-image');
        } else if (!logoImg.attr('src').includes(logoPath + logoFile)) {
            logoImg.each(function () {
                $(this.shadowRoot).find('.d2l-navigation-link-image-container img').attr('src', logoPath + logoFile);
            });
        } else {
            clearInterval(dlightThemeInterval);
        }
        themeInvCnt++;
        if (themeInvCnt > 20) {
            clearInterval(dlightThemeInterval);
        }
    }, 200);
}

function initDarklightFunc() {

    // js
    var jsText = 'var dlightData = {';
    jsText += 'baseURL : "' + baseURL + '",';
    jsText += 'currURL : "' + currURL + '",';
    jsText += 'currURL2 : "' + currURL2 + '",';
    jsText += 'currURLHost : "' + currURLHost + '",';
    jsText += 'options : ' + JSON.stringify(options) + ',';
    jsText += 'themeConfigs : ' + JSON.stringify(themeConfigs) + '';
    jsText += '}';
    // var params = document.createElement("script");
    // params.textContent = jsText;
    // document.head.appendChild(params);
    injectJS(jsText, 'head', 'text');

    injectJS(baseURL + 'js/inject.js', 'head');

    // theme js
    initTheme();

    var scriptArr = [];
    // scriptArr.push({
    //     file: 'theme/theme_' + options.GLB_ThemeID + '/functions.js'
    // });
    if (options.GLB_EnableCustomStyle) {
        scriptArr.push({
            code: options.GLB_CustomJS
        });
    }
    browser.runtime.sendMessage({
        action: 'executeScript',
        data: scriptArr
    });

    // drop down
    $(document).on('mouseup', 'd2l-dropdown', function () {
        var self = $(this);

        function _injectDropdownCSS() {
            if (self[0].querySelectorAll('d2l-dropdown-menu, d2l-dropdown-content').length > 0
                && self[0].querySelectorAll('d2l-dropdown-menu, d2l-dropdown-content')[0].shadowRoot !== null) {
                setTimeout(function () {
                    if (self.data('dropdown-init') !== 'true') {
                        self.data('dropdown-init', 'true');
                        injectCSSShadow(baseURL + 'css/shadow_dropdown.css', self, 'file', true);
                    } else if (typeof self.children('d2l-dropdown-menu').attr('render-content') === typeof undefined) {
                        injectCSSShadow(baseURL + 'css/shadow_dropdown.css', self.children('d2l-dropdown-menu'), 'file', true);
                    }
                    if (typeof themeOnDropdownClick === 'function') {
                        themeOnDropdownClick(self);
                    }
                }, 1);
                return true;
            }
            return false;
        }

        _injectDropdownCSS();
        var intervCount = 0;
        var interv = setInterval(function () {
            if (_injectDropdownCSS() === true)
                clearInterval(interv);
            intervCount++;
            if (intervCount > 100)
                clearInterval(interv);
        }, 100);
    });

    // floating buttons
    if (document.querySelector('d2l-floating-buttons') !== null && document.querySelector('d2l-floating-buttons').shadowRoot !== null) {
        injectCSS(baseURL + 'css/shadow_float_button.css',
            $(document.querySelector('d2l-floating-buttons').shadowRoot), 'file');
    }

    // custom font
    if (options.GLB_CustomFont) {
        customFont();
    }

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    setTimeout(function () {
        waitForNavbarReady();
    }, 0);

    // display group members
    if (currURL.match(/\/d2l\/lms\/group\/user_available_group_list\.d2l/g) && options.GROUP_ListMembersBtn) {
        listMembersBtn();
    }

    // content index page func
    if (currURL2.match(/\/d2l\/le\/content\/\d+\/Home/g)) {
        fixSidePanelSelector();
        openContentInNewTab();
    }

    // content viewer page func
    if (currURL.match(/\/d2l\/le\/content\/\d+\/viewContent\/\d+\/View/g)) {
        contentPageFunc();
    }

    // quiz & survey resize
    if (currURL.match(/\/quizzing\/user\/attempt\//g) || currURL.match(/\/survey\/user\/attempt\//g)) {
        quizPageFunc();
    }

    // homepage
    if (currURL2.match(/\/d2l\/home$/)) {
        homepageFunc();
    }

    // course home
    if (currURL2.match(/\/d2l\/home\/\d+$/)) {
        customCourseThumbs();

        $('.d2l-widget-header').each(function (i, e) {
            var headText = $(e).text();
            if (headText.match(/Calendar/i)) {
                $(e).closest('div.d2l-widget').addClass('darklight-course-home-calendar');
            } else if (headText.match(/Announcements/i)) {
                removeAnnouncePageFormat(true, $(e).closest('div.d2l-widget'));
            }
        });

        if (options.COURSE_HideCourseHomeBanner) {
            $('#CourseImageBannerPlaceholderId').hide();
        }
    }

    courseDirectToContent();
    courseTileContextMenu();

    // dropbox mark
    if (currURL.match(/\/d2l\/lms\/dropbox\/admin\/mark\/folder_user_mark\.d2l/i)) {
        // dropboxMarkFunc();
    }

    // announcement page
    if (currURL.match(/\/d2l\/lms\/news\/main\.d2l/i)) {
        removeAnnouncePageFormat();
    }

    // popup page
    if (window.opener && window.opener !== window) {
        if (currURL.match(/\/d2l\/le\/content\/\d+\/fullscreen\/\d+\/View/i)) {
            var cssText = '.d2l-popup-page .d2l-popup-body::-webkit-scrollbar{width:0!important}' +
                '.d2l-popup-page .d2l-popup-body{scrollbar-width:none}';
            if ($('.d2l-popup-title').length)
                cssText += 'iframe.d2l-fileviewer-rendered-pdf{height:calc(100vh - 60px)!important;}';
            browser.runtime.sendMessage({
                action: 'insertCSS',
                data: {code: cssText}
            });
            injectCSS('iframe.d2l-fileviewer-rendered-pdf-dialog{height:calc(100vh - 60px)!important;}', 'body', 'text');
        }
    }

    // overlay
    removeOverlay();
    setTimeout(function () {
        removeOverlay(true);
    }, 3000);

}

function initDarklightIdle() {

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

    if (!head.length || !body.length || typeof body.attr('class') === typeof undefined) {
        removeOverlay(true);
        return;
    }

    // conflict detect
    detectExtConflict();

    // favicon
    if (options.GLB_DarklightFavicon) {
        head.find('link[rel="icon"]').remove();
        if (options.GLB_DarklightFaviconInvert)
            head.append($('<link rel="icon" type="image/png" href="' + baseURL + 'icon/icon32-invert.png' + '">'));
        else
            head.append($('<link rel="icon" type="image/png" href="' + baseURL + 'icon/icon32.png' + '">'));
    }

    // css
    // injectCSS('html{font-size:' + options.GLB_BasicFontSize + 'px}', 'head', 'text');
    injectCSS(baseURL + 'css/common.css', 'head');
    injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');
    if (options.GLB_EnableCustomStyle)
        injectCSS(options.GLB_CustomCSS, 'head', 'text');

    // init homepage course widget even document hidden
    $('d2l-navigation').addClass('darklight-navigation-hidden darklight-navigation-transition');
    if (currURL2.match(/\/d2l\/home$/) && !isWLU()) {
        var d2lMyCourses = $('d2l-my-courses');
        var courseWidget = d2lMyCourses.closest('div.d2l-widget');
        courseWidget.addClass('darklight-homepage-courses-widget');

        var d2lMyCoursesLoading = document.createElement('div');
        d2lMyCoursesLoading.className = 'darklight-homepage-courses-loading';
        d2lMyCoursesLoading.id = 'darklight-homepage-courses-loading';
        d2lMyCoursesLoading.innerHTML = '<div class="darklight-block-page-loader darklight-block-page-loader-d2l"></div>';
        d2lMyCourses[0].parentNode.append(d2lMyCoursesLoading);

        if (d2lMyCourses.hasClass('darklight-homepage-courses-widget-complete')) {
            $(d2lMyCoursesLoading).hide();
        }
    }

    if (!document.hidden) {
        // initDarklightFunc();

        document.querySelector('#darklight-load-overlay > div').innerHTML = '<p><strong>Extension didn\'t work?</strong></p>' +
            '<p>Please click the extension icon in toolbar and report this issue. Thank you.</p>';

        initDarklightIdle.initialized = true;
        setTimeout(function () {
            initDarklightFunc();
        }, 50);

    } else {

        document.addEventListener("visibilitychange", function () {
            if (!document.hidden && initDarklightIdle.initialized !== true) {
                initDarklightIdle.initialized = true;
                setTimeout(function () {
                    initDarklightFunc();
                }, 50);
            }
        }, false);

    }

}

var html = $('html'), head = $('head'), body = $('body');

try {
    if (initReady && typeof initTheme === 'function') {
        initDarklightIdle();
    } else {
        var initIntvCnt = 0;
        var initIntv = setInterval(function () {
            if (initReady && typeof initTheme === 'function') {
                clearInterval(initIntv);
                initDarklightIdle();
            } else {
                initIntvCnt++;
                if (initIntvCnt > 50) {
                    clearInterval(initIntv);
                    removeOverlay(true);
                }
            }
        }, 100);
    }
} catch (err) {
    console.log('Learn Darklight Error Message: ' + err.message);
}
