var dlightApp = {
    keepSessionAlive: function () {
        var keepSessionAliveInt = setInterval(function () {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "/d2l/activityFeed/checkForNewAlerts?isXhr=true", true);
            xhttp.send();
            if (typeof D2L == 'object') {
                D2L.LP.Web.UI.Html.Dom.Storage.Local.Set("Session.Expired", 0);
                D2L.LP.Web.UI.Html.Dom.Storage.Local.Set("Session.LastAccessed", (new Date).getTime().toString());
            }
        }, 7 * 60 * 1000); // every 7 min
    },
    init: function () {
        if (dlightData.options.GLB_KeepSessionAlive) {
            dlightApp.keepSessionAlive();
        }
    }
};

if (typeof dlightData !== typeof undefined) {
    dlightApp.init();
} else {
    var initIntvCnt = 0;
    var initIntv = setInterval(function () {
        if (typeof dlightData !== typeof undefined) {
            clearInterval(initIntv);
            dlightApp.init();
        } else {
            initIntvCnt++;
            if (initIntvCnt > 50) {
                clearInterval(initIntv);
                console.log('dlightData undefined');
            }
        }
    }, 100);
}

