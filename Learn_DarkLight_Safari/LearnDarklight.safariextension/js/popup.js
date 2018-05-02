function initPopup() {

    var enableStatus;
    if (safari.extension.settings.GLB_Enabled === undefined)
        enableStatus = true;
    else
        enableStatus = !!safari.extension.settings.GLB_Enabled;
    $('#enable-darklight').prop('checked', enableStatus);


    $('#enable-darklight').change(function () {

        safari.extension.settings.GLB_Enabled = $(this).is(':checked');

        $('#darklight-toast').removeClass('darklight-toast-hidden');
        setTimeout(function () {
            $('#darklight-toast').addClass('darklight-toast-hidden');
        }, 2000);

    });

    $('#more-options').on('click', function () {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + 'html/options.html';
    });

    $('#open-learn').on('click', function () {
        safari.application.activeBrowserWindow.openTab().url = 'https://learn.uwaterloo.ca/';
    });

}

initPopup();