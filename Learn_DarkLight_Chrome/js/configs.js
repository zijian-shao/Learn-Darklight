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
        'GLB_BackToTopButtonNavbar': true,
        'GLB_EnableCustomStyle': false,
        'GLB_CustomCSS': '',
        'GLB_CustomJS': '',
        'GLB_EnableForWaterloo': true,
        'GLB_EnableForLaurier': true,
        'GLB_PopupAccessForWaterloo': true,
        'GLB_PopupAccessForLaurier': false,
        'HOME_AutoHideSysAlert': true,
        'HOME_HideCheckMySys': true,
        'HOME_AddCalendar': true,
        'HOME_HidePrivacy': true,
        'HOME_HideMetaTerm': false,
        'HOME_HideMetaEndDate': false,
        'HOME_SwitchAnnounceAndCalendar': false,
        'COURSE_ContentResizeBtn': true,
        'COURSE_CustomThumb': true,
        'COURSE_DirectToContent': false,
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
            "overlayColor": "#222"
        },
        "theme_1": {
            "id": 1,
            "name": "Bright Daylight",
            "author": "Zijian Shao",
            "nightMode": false,
            "overlayColor": "#f6f7f8"
        },
        "theme_2": {
            "id": 2,
            "name": "Dark Turquoise",
            "author": "Zijian Shao",
            "nightMode": true,
            "overlayColor": "#282d34"
        },
        "theme_3": {
            "id": 3,
            "name": "TEST",
            "author": "Zijian Shao",
            "nightMode": false,
            "overlayColor": "#fff",
            "hidden": true
        },
        "theme_99": {
            "id": 99,
            "name": "Default",
            "author": "D2L",
            "nightMode": false,
            "overlayColor": "transparent"
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}
