function initPopup() {

    chrome.storage.sync.get(getOptionListDefault(), function (items) {
        $('#enable-darklight').prop('checked', items.GLB_Enabled);

        var quickLinks = $('#quick-access-links');
        if (items.GLB_PopupAccessForWaterloo) {
            $('<div class="btn btn-yellow">' +
                '<div class="btn-icon"><img src="../img/popup-icon-waterloo.png" alt="Waterloo"></div>' +
                '<div class="btn-text">Waterloo Learn</div></div>').on('click', function () {
                chrome.tabs.create({
                    url: 'https://learn.uwaterloo.ca/'
                });
            }).appendTo(quickLinks);
        }
        if (items.GLB_PopupAccessForLaurier) {
            $('<div class="btn btn-purple">' +
                '<div class="btn-icon"><img src="../img/popup-icon-laurier.png" alt="Laurier"></div>' +
                '<div class="btn-text">Laurier MyLearningSpace</div></div>').on('click', function () {
                chrome.tabs.create({
                    url: 'https://mylearningspace.wlu.ca/'
                });
            }).appendTo(quickLinks);
        }
    });

    $('#enable-darklight').change(function () {

        chrome.storage.sync.set({

            GLB_Enabled: $(this).is(':checked')

        }, function () {

            $('#darklight-toast').removeClass('darklight-toast-hidden');
            setTimeout(function () {
                $('#darklight-toast').addClass('darklight-toast-hidden');
            }, 2000);

        });

    });

    $('#more-options').on('click', function () {
        chrome.runtime.openOptionsPage();
    });

}

initPopup();