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
    browser.runtime.setUninstallURL("https://www.zijianshao.com/dlight/uninstall/?platform=firefox", function () {
        if (chrome.runtime.lastError) {
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

    });

    /**
     * Firefox API Calls From Content Scripts
     */
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}

        // execute script
        if (request.action == 'executeScript') {

            var obj = {};
            if (Array.isArray(request.data)) {

                for (var i = 0; i < request.data.length; i++) {
                    obj = {};
                    obj[request.data[i].type] = request.data[i].content;
                    browser.tabs.executeScript(sender.tab.id, obj);
                }

            } else {
                obj[request.data.type] = request.data.content;
                browser.tabs.executeScript(sender.tab.id, obj);
            }

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // inject css
        else if (request.action == 'insertCSS') {

            var obj = {};
            obj[request.data.type] = request.data.content;
            browser.tabs.insertCSS(sender.tab.id, obj);

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // app.getDetails
        else if (request.action == 'getDetails') {

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
                        browser.tabs.sendMessage(sender.tab.id, {
                            action: 'addCourseThumbsResponse',
                            data: {
                                err_code: 1,
                                err_msg: 'This course ID already exists. Please delete the old one before adding.'
                            }
                        });
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
