var dlightApp = {
    keepSessionAlive: function () {
        setInterval(function () {
            console.log('dlight session get');
            $.ajax({
                url: dlightData.currURLHost + '/d2l/activityFeed/checkForNewAlerts?isXhr=true',
                method: 'GET',
                dataType: 'text',
                success: function (data, textStatus) {
                }
            });
        }, 25 * 60 * 1000); // every 25 min
    },
    init: function () {
        if (dlightData.options.GLB_KeepSessionAlive) {
            dlightApp.keepSessionAlive();
        }
    }
};

dlightApp.init();