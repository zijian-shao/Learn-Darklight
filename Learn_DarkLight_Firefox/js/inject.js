var dlightApp = {
    keepSessionAlive: function () {
        setInterval(function () {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "/d2l/activityFeed/checkForNewAlerts?isXhr=true", true);
            xhttp.send();
            if (typeof D2l !== typeof undefined) {
                D2L.PT.Auth.SessionTimeout.InitData.Extending = true;
                D2L.PT.Auth.SessionTimeout.InitData.ExtendFunc();
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