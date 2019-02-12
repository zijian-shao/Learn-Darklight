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
        HOME_ShowWeekDayOnCalendar: false,
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
            headerHeight: 92,
            options: [
                {
                    key: "showWaterlooLogo",
                    type: "boolean",
                    value: true,
                    description: "Show 'Waterloo' on the side <small>(Waterloo Learn)</small>"
                }, {
                    type: "separator"
                }, {
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
            headerHeight: 91,
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
            headerHeight: 92,
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
            name: "Dodger Blue",
            author: "Zijian Shao & TIM",
            previewColor: "#0088fb",
            overlayColor: "#f6f7f8",
            headerHeight: 110,
            isNew: true,
            options: [
                {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: true,
                    description: "Full-width layout"
                }
            ]
        },
        theme_99: {
            id: 99,
            name: "Learn Default",
            author: "D2L",
            previewColor: "#bbb",
            overlayColor: "#f6f7f8",
            headerHeight: 90
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}

function getLink(key) {
    var list = {
        darklightStore: 'https://addons.mozilla.org/firefox/addon/learn-darklight/',
        azureStore: 'https://addons.mozilla.org/firefox/addon/waterlooworks-azure/',
        autologStore: 'https://addons.mozilla.org/firefox/addon/waterloo-autolog/',
        raspberryStore: 'https://addons.mozilla.org/firefox/addon/quest-raspberry/',
        feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSdrOnFC70L2juZuUzAy0r2xmPPCiWQ5sR7-U_c8ZQIuJYsqsg/viewform?usp=pp_url&entry.131896974=@@extVersion@@&entry.763960959=@@browser@@&entry.1389556052=@@os@@',
        officialWebsite: 'https://www.zijianshao.com/dlight/',
        github: 'https://github.com/SssWind/Learn-Darklight',
        donate: 'https://www.paypal.me/zjshao',
        linkShare: 'https://www.zijianshao.com/dlight/sharelink/?platform=firefox',
        facebookShare: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dfirefox',
        twitterShare: 'https://twitter.com/intent/tweet?hashtags=UWaterloo&original_referer=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2F&ref_src=twsrc%5Etfw&text=New%20themes%20for%20Waterloo%20Learn!%20Get%20Learn%20Darklight%20now!&tw_p=tweetbutton&url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dfirefox',
        redditShare: 'https://www.reddit.com/submit?url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dfirefox&title=New%20themes%20for%20Waterloo%20Learn!%20Get%20Learn%20Darklight%20now!',
        gplusShare: 'https://plus.google.com/share?url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dfirefox',
        linkedInShare: 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dfirefox',
        mailTo: 'mailto:sam.zj.shao@gmail.com?Subject=Learn Darklight Extension'
    };
    return list[key];
}