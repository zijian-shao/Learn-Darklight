/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        browser.tabs.create({
            'url': browser.runtime.getURL('/html/options.html?welcome=show')
        });
    }
}

/**
 * Update option
 * @param oldVer
 * @param newVer
 */
function updateOptions(oldVer, newVer) {

    // update storage
    browser.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

function getUninstallLink() {
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

    var urlText = 'https://www.zijianshao.com/dlight/uninstall/?platform=' + _getBrowser().name.toLowerCase() +
        '&version=' + encodeURI(chrome.runtime.getManifest().version) +
        '&browser=' + encodeURI(_getBrowser().name + ' ' + _getBrowser().version) +
        '&os=' + encodeURI(_getOS());

    return urlText;
}


/**
 * Toolbar context menu
 * @param id
 * @param title
 * @param contexts
 * @param onClick
 */
function createToolbarContextMenu(id, title, contexts, onClick) {

    browser.contextMenus.remove(id, function () {
        browser.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
        if (browser.runtime.lastError) {
        }
    });

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId == id) {
            if (typeof onClick === 'function')
                onClick();
        }
    });
}

/**
 * IndexedDB for course thumbs
 * @param ready function
 * @param error function
 */
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
}

function initBackground() {
    /**
     * Background Started
     */
    console.log('Welcome to Learn Darklight!');
    browser.runtime.onInstalled.addListener(installWelcome);
    browser.runtime.setUninstallURL(getUninstallLink(), function () {
        if (browser.runtime.lastError) {
        }
    });

    var version = getOptionVersion();
    var configs = getOptionListDefault();
    var options;

    /**
     * Check data updates
     */
    browser.storage.sync.get(configs, function (items) {
        options = items;

        // option version
        if (options.OPT_Version < version)
            updateOptions(options.OPT_Version, version);

        // extension version
        // if (versionCompare(options.EXT_Version, browser.app.getDetails().version) < 0)
        //     extensionUpdated(options.EXT_Version, browser.app.getDetails().version);

    });

    /**
     * Firefox API Calls From Content Scripts
     */
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}

        // execute script
        if (request.action == 'executeScript') {

            // request.data = {code:'', allFrames:false, frameId:123};
            function _executeScript(obj, func) {
                if (typeof func === 'function')
                    browser.tabs.executeScript(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    browser.tabs.executeScript(sender.tab.id, obj);
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _executeScript(request.data[i], sendResponse);
                }
            } else {
                _executeScript(request.data, sendResponse);
            }

        }

        // inject css
        else if (request.action == 'insertCSS') {

            function _insertCSS(obj, func) {
                if (typeof func === 'function')
                    browser.tabs.insertCSS(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    browser.tabs.insertCSS(sender.tab.id, obj);
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _insertCSS(request.data[i], sendResponse);
                }
            } else {
                _insertCSS(request.data, sendResponse);
            }

        }

        // webNavigation.getAllFrames
        else if (request.action == 'getAllFrames') {
            // browser.webNavigation.getAllFrames({tabId: sender.tab.id}, function (resp) {
            //     sendResponse(resp);
            // });
        }

        // app.getDetails
        else if (request.action == 'getDetails' || request.action == 'getManifest') {

            var obj = browser.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // open new tab
        else if (request.action == 'createTab') {

            browser.tabs.create({
                'url': request.data.url
            });

        }

        // get course thumbs
        else if (request.action == 'getCourseThumbs') {

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
                            browser.tabs.sendMessage(sender.tab.id, {action: 'getCourseThumbsResponse', data: all});
                        } catch (e) {

                        }
                    }
                };
            }, null);
        }

        // get course thumbs one
        else if (request.action == 'getCourseThumbsOne') {

            getDatabase(function (db) {
                var tx = db.transaction(['course_thumbs'], 'readonly');
                var os = tx.objectStore('course_thumbs');
                var req = os.get(request.data.course_id);

                req.onsuccess = function (event) {
                    if (typeof req.result !== typeof undefined) {
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'getCourseThumbsOneResponse',
                            data: [{
                                course_id: req.result.course_id,
                                course_code: req.result.course_code,
                                thumb_image: req.result.thumb_image
                            }]
                        });
                    }
                };
                req.onerror = function (event) {
                    browser.tabs.sendMessage(sender.tab.id, {
                        action: 'getCourseThumbsOneResponse',
                        data: {
                            err_code: 2,
                            err_msg: event.target.error.name + ': ' + event.target.error.message
                        }
                    });
                };

            }, null);
        }

        // add course thumbs
        else if (request.action == 'addCourseThumbs') {

            getDatabase(function (db) {
                var tx = db.transaction(['course_thumbs'], 'readwrite');
                var os = tx.objectStore('course_thumbs');

                // test existence
                var req1 = os.get(request.data.course_id);
                req1.onsuccess = function (event) {

                    if (req1.result) {

                        // found in db
                        var conf = confirm("This course ID already exists. Do you want to update the existing record?");
                        if (conf) {
                            // update
                            var req = os.put({
                                course_id: request.data.course_id,
                                course_code: request.data.course_code,
                                thumb_image: request.data.thumb_image
                            });
                            req.onsuccess = function (event) {
                                browser.tabs.sendMessage(sender.tab.id, {
                                    action: 'addCourseThumbsResponse',
                                    data: {
                                        err_code: 0,
                                        data: {
                                            msg: 'Custom Cover Picture Updated',
                                            popup_class: request.data.popup_class
                                        }
                                    }
                                });
                            };
                            req.onerror = function (event) {
                                browser.tabs.sendMessage(sender.tab.id, {
                                    action: 'addCourseThumbsResponse',
                                    data: {
                                        err_code: 2,
                                        err_msg: event.target.error.name + ': ' + event.target.error.message
                                    }
                                });
                            };

                        } else {
                            // give up replace
                            browser.tabs.sendMessage(sender.tab.id, {
                                action: 'addCourseThumbsResponse',
                                // data: {
                                //     err_code: 1,
                                //     err_msg: 'Operation canceled. The existing record was not affected.'
                                // }
                                data: {
                                    err_code: 0,
                                    data: {
                                        msg: 'Operation canceled. The existing record was not affected.',
                                        popup_class: request.data.popup_class
                                    }
                                }
                            });
                        }

                    }

                    else {
                        // add to db
                        var req = os.add({
                            course_id: request.data.course_id,
                            course_code: request.data.course_code,
                            thumb_image: request.data.thumb_image
                        });
                        req.onsuccess = function (event) {
                            browser.tabs.sendMessage(sender.tab.id, {
                                action: 'addCourseThumbsResponse',
                                data: {
                                    err_code: 0,
                                    data: {
                                        msg: 'New Custom Cover Picture Added',
                                        popup_class: request.data.popup_class
                                    }
                                }
                            });
                        };
                        req.onerror = function (event) {
                            browser.tabs.sendMessage(sender.tab.id, {
                                action: 'addCourseThumbsResponse',
                                data: {
                                    err_code: 2,
                                    err_msg: event.target.error.name + ': ' + event.target.error.message
                                }
                            });
                        };

                    }

                };
            }, null);
        }

        // delete course thumbs
        else if (request.action == 'deleteCourseThumbs') {

            getDatabase(function (db) {
                var tx = db.transaction(['course_thumbs'], 'readwrite');
                var os = tx.objectStore('course_thumbs');
                var req = os.delete(request.data.course_id);

                req.onsuccess = function (event) {
                    browser.tabs.sendMessage(sender.tab.id, {
                        action: 'deleteCourseThumbsResponse',
                        data: {
                            err_code: 0,
                            data: {
                                msg: 'Custom cover picture deleted successfully'
                            }
                        }
                    });
                };
                req.onerror = function (event) {
                    browser.tabs.sendMessage(sender.tab.id, {
                        action: 'deleteCourseThumbsResponse',
                        data: {
                            err_code: 2,
                            err_msg: event.target.error.name + ': ' + event.target.error.message
                        }
                    });
                };
            }, null);
        }

    });

    /**
     * Add toolbar context menu
     */
    createToolbarContextMenu('dlight-website', 'Official Website', ['browser_action'], function () {
        browser.tabs.create({
            'url': 'https://www.zijianshao.com/dlight/'
        });
    });
    createToolbarContextMenu('dlight-contribute', 'Donate', ['browser_action'], function () {
        browser.tabs.create({
            'url': 'https://www.paypal.me/zjshao'
        });
    });
    createToolbarContextMenu('dlight-github', 'GitHub', ['browser_action'], function () {
        browser.tabs.create({
            'url': 'https://github.com/SssWind/Learn-Darklight'
        });
    });

}

initBackground();
