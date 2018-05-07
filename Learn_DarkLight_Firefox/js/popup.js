function initPopup() {

    browser.storage.sync.get(getOptionListDefault(), function (items) {
        $('#enable-darklight').prop('checked', items.GLB_Enabled);

        var quickLinks = $('#quick-access-links');
        if (items.GLB_PopupAccessForWaterloo) {
            $('<hr class="darklight-option-hr"><div class="darklight-option-group"><p class="darklight-option-link" id="open-learn">Open Waterloo Learn</p></div>').on('click', function () {
                browser.tabs.create({
                    url: 'https://learn.uwaterloo.ca/'
                });
            }).appendTo(quickLinks);
        }
        if (items.GLB_PopupAccessForLaurier) {
            $('<hr class="darklight-option-hr"><div class="darklight-option-group"><p class="darklight-option-link" id="open-learn">Open MyLearningSpace</p></div>').on('click', function () {
                browser.tabs.create({
                    url: 'https://mylearningspace.wlu.ca/'
                });
            }).appendTo(quickLinks);
        }
    });

    $('#enable-darklight').change(function () {

        browser.storage.sync.set({

            GLB_Enabled: $(this).is(':checked')

        }, function () {

            $('#darklight-toast').removeClass('darklight-toast-hidden');
            setTimeout(function () {
                $('#darklight-toast').addClass('darklight-toast-hidden');
            }, 2000);

        });

    });

    $('#more-options').on('click', function () {
        browser.tabs.create({
            url: browser.runtime.getURL('') + 'html/options.html'
        });
    });

}

initPopup();