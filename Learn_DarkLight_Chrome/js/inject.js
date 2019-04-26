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

dlightApp.init();