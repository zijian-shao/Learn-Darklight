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
        'QUIZ_ContentResizeBtn': true,
        'GROUP_ListMembersBtn': true
    };

    return obj;

}