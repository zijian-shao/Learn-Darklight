function getOptionVersion() {

    var optionVer = 1;
    return optionVer;

}

function getOptionListDefault() {

    var obj = {
        'EXT_Version': '0.0.0',
        'OPT_Version': 0,
        'GLB_Enabled': true,
        'GLB_ThemeID': 0,
        'GLB_FixNavigation': true,
        'GLB_BackToTopButton': true,
        'GLB_EnableCustomStyle': false,
        'GLB_CustomCSS': '',
        'GLB_CustomJS': '',
        'GLB_EnableForWaterloo': true,
        'GLB_EnableForLaurier': true,
        'GLB_PopupAccessForWaterloo': true,
        'GLB_PopupAccessForLaurier': false,
        'HOME_AutoHideSysAlert': true,
        'HOME_HideCheckMySys': false,
        'HOME_AddCalendar': true,
        'HOME_HidePrivacy': true,
        'HOME_SwitchAnnounceAndCalendar': false,
        'COURSE_ContentResizeBtn': true,
        'COURSE_CustomThumb': true,
        'QUIZ_ContentResizeBtn': true,
        'GROUP_ListMembersBtn': true
    };

    return obj;

}

function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "name": "Classic Darklight",
            "author": "Zijian Shao",
            "nightMode": false,
            "overlayColor": "#111",
            "previewColor": "#333"
        },
        "theme_1": {
            "id": 1,
            "name": "Bright Daylight",
            "author": "Zijian Shao",
            "nightMode": false,
            "overlayColor": "#fff",
            "previewColor": "#eee"
        },
        "theme_2": {
            "id": 2,
            "name": "Dark Turquoise",
            "author": "Zijian Shao",
            "nightMode": true,
            "overlayColor": "#282d34",
            "previewColor": "#09b1b9"
        },
        "theme_99": {
            "id": 99,
            "name": "Default",
            "author": "D2L",
            "nightMode": false,
            "overlayColor": "transparent",
            "previewColor": "transparent"
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}