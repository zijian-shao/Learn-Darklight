function initPopup() {

    var enableStatus;
    if (safari.extension.settings.GLB_Enabled === undefined)
        enableStatus = true;
    else
        enableStatus = !!safari.extension.settings.GLB_Enabled;
    $('#enable-darklight').prop('checked', enableStatus);

    var quickLinks = $('#quick-access-links');
    if (safari.extension.settings.GLB_PopupAccessForWaterloo === true
        || safari.extension.settings.GLB_PopupAccessForWaterloo === undefined) {
        $('<hr class="darklight-option-hr"><div class="darklight-option-group"><p class="darklight-option-link" id="open-learn">Open Waterloo Learn</p></div>').on('click', function () {
            safari.application.activeBrowserWindow.openTab().url = 'https://learn.uwaterloo.ca/';
        }).appendTo(quickLinks);
    }
    if (safari.extension.settings.GLB_PopupAccessForLaurier === true) {
        $('<hr class="darklight-option-hr"><div class="darklight-option-group"><p class="darklight-option-link" id="open-learn">Open MyLearningSpace</p></div>').on('click', function () {
            safari.application.activeBrowserWindow.openTab().url = 'https://mylearningspace.wlu.ca/';
        }).appendTo(quickLinks);
    }

    $('#enable-darklight').change(function () {

        safari.extension.settings.GLB_Enabled = $(this).is(':checked');

        $('#darklight-toast').removeClass('darklight-toast-hidden');
        setTimeout(function () {
            $('#darklight-toast').addClass('darklight-toast-hidden');
        }, 2000);

    });

    $('#more-options').off('click').on('click', function () {
        safari.application.activeBrowserWindow.openTab().url = safari.extension.baseURI + 'html/options.html';
    });

    safari.self.height = $('html').height();
}

initPopup();

function _popoverHandler() {
    window.location.reload();
}

safari.application.addEventListener("popover", _popoverHandler, true);