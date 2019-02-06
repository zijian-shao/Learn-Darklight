function getOptionVersion() {

    var optionVer = 1;
    return optionVer;

}

function getOptionListDefault() {

    var obj = {
        EXT_Version: '0.0.0',
        OPT_Version: 0,
        GLB_Enabled: true,
        GLB_ThemeID: 0,
        GLB_CustomFont: true,
        GLB_CustomFontInfo: 'Default',
        GLB_DarklightFavicon: true,
        GLB_FixNavigation: true,
        GLB_BackToTopButton: true,
        GLB_BackToTopButtonNavbar: true,
        GLB_EnableCustomStyle: false,
        GLB_CustomCSS: '',
        GLB_CustomJS: '',
        GLB_UseSmallerFonts: true,
        GLB_EnableForWaterloo: true,
        GLB_EnableForLaurier: true,
        GLB_PopupAccessForWaterloo: true,
        GLB_PopupAccessForLaurier: false,
        HOME_AutoHideSysAlert: true,
        HOME_HideCheckMySys: true,
        HOME_AddCalendar: true,
        HOME_HidePrivacy: true,
        HOME_HideMetaTerm: false,
        HOME_HideMetaEndDate: false,
        HOME_SwitchAnnounceAndCalendar: false,
        COURSE_ContentResizeBtn: true,
        COURSE_AutoScrollToContent: false,
        COURSE_CustomThumb: true,
        COURSE_DirectToContent: false,
        COURSE_AutoEnterFullScreen: false,
        QUIZ_ContentResizeBtn: true,
        GROUP_ListMembersBtn: true
    };

    return obj;

}

function getThemeConfigs(id) {

    var configs = {
        theme_0: {
            id: 0,
            name: "Classic Darklight",
            author: "Zijian Shao",
            previewColor: "#fdd54f",
            overlayColor: "#222",
            options: [
                {
                    key: "navPrimaryColor",
                    type: "color",
                    value: "#fdd54f",
                    description: "Navigation bar primary color <small>(RGB or HEX syntax)</small>"
                }
            ]
        },
        theme_1: {
            id: 1,
            name: "Bright Daylight",
            author: "Zijian Shao",
            previewColor: "#333",
            overlayColor: "#f6f7f8",
            options: [
                {
                    key: "whiteNavbar",
                    type: "boolean",
                    value: false,
                    description: "Use white navigation bar"
                }
            ]
        },
        theme_2: {
            id: 2,
            name: "Dark Turquoise",
            author: "Zijian Shao",
            previewColor: "#09b3bc",
            overlayColor: "#323841",
            options: [
                {
                    key: "darkCoursePic",
                    type: "boolean",
                    value: true,
                    description: "Reduce the brightness of course cover pics"
                }, {
                    key: "darkIframe",
                    type: "boolean",
                    value: true,
                    description: "Reduce the brightness of iframes"
                }, {
                    key: "invertIframe",
                    type: "boolean",
                    value: false,
                    description: "Invert the color of iframes"
                }
            ]
        },
        theme_3: {
            id: 3,
            name: "TEST",
            author: "Zijian Shao",
            previewColor: "#000",
            overlayColor: "#fff",
            hidden: true
        },
        theme_99: {
            id: 99,
            name: "Learn Default",
            author: "D2L",
            previewColor: "#22a3ff",
            overlayColor: "#f6f7f8"
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}
