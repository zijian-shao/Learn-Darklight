function initPopup() {

    browser.storage.sync.get({
        GLB_Enabled: true
    }, function (items) {
        $('#enable-darklight').prop('checked', items.GLB_Enabled);
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

    $('#open-learn').on('click', function () {
        browser.tabs.create({
            url: 'https://learn.uwaterloo.ca/'
        });
    });

}

initPopup();