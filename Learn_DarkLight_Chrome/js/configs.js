function getOptionVersion() {

    var optionVer = 1;
    return optionVer;

}

function getOptionListDefault() {

    var obj = {
        EXT_Version: '0.0.0',
        EXT_ReceiveNotification: false,
        OPT_Version: 0,
        GLB_Enabled: true,
        GLB_ThemeID: 0,
        GLB_CustomFont: true,
        GLB_CustomFontInfo: 'Lato',
        GLB_DarklightFavicon: true,
        GLB_DarklightFaviconInvert: false,
        GLB_FixNavigation: true,
        GLB_BackToTopButton: true,
        GLB_BackToTopButtonNavbar: true,
        GLB_EnableCustomStyle: false,
        GLB_CustomCSS: '',
        GLB_CustomJS: '',
        GLB_BasicFontSize: 16,
        GLB_EnableForWaterloo: true,
        GLB_EnableForLaurier: true,
        GLB_PopupAccessForWaterloo: true,
        GLB_PopupAccessForLaurier: false,
        GLB_KeepSessionAlive: true,
        HOME_AutoHideSysAlert: true,
        HOME_HideCheckMySys: true,
        HOME_AddCalendar: true,
        HOME_ShowWeekDayOnCalendar: true,
        HOME_HidePrivacy: true,
        HOME_HideMetaTerm: false,
        HOME_HideMetaEndDate: false,
        HOME_HideCoverPic: false,
        HOME_HideCourseTabSelector: false,
        HOME_SwitchAnnounceAndCalendar: false,
        HOME_RemoveAnnounceFormat: false,
        HOME_HidePinnedIcon: true,
        HOME_CourseTileContextMenu: true,
        HOME_CourseTileContextMenuData: [
            {
                name: 'Common',
                list: [
                    {name: 'Course Home', visible: false},
                    {name: 'Content', visible: true},
                    {name: 'Grades', visible: true}
                ]
            }, {
                name: 'Submit',
                list: [
                    {name: 'Dropbox', visible: true},
                    {name: 'Quizzes', visible: true},
                    {name: 'Surveys', visible: false}
                ]
            }, {
                name: 'Connect',
                list: [
                    {name: 'Classlist', visible: false},
                    {name: 'Discussions', visible: true},
                    {name: 'Groups', visible: false}
                ]
            }, {
                name: 'Resources',
                list: [
                    {name: 'Checklist', visible: false},
                    {name: 'Rubrics', visible: false}
                ]
            }
        ],
        COURSE_ContentResizeBtn: true,
        COURSE_AutoScrollToContent: false,
        COURSE_CustomThumb: true,
        COURSE_DirectToContent: false,
        COURSE_AutoEnterFullScreen: false,
        COURSE_HideCourseHomeBanner: false,
        COURSE_FixSidePanelSelector: false,
        COURSE_OpenContentInNewTab: false,
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
            previewColor: "#000",
            overlayColor: "#222",
            brightness: "bright",
            headerHeight: 92,
            options: [
                {
                    key: "showWaterlooLogo",
                    type: "boolean",
                    value: true,
                    description: "Show 'Waterloo' on the side <small>(Waterloo Learn)</small>"
                }, {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: false,
                    description: "Full-width layout"
                }, {
                    type: "separator"
                }, {
                    key: "overrideOverlayColor",
                    type: "color",
                    value: "#222222",
                    description: "Loading overlay color"
                }, {
                    key: "overridePageBackgroundColor",
                    type: "color",
                    value: "#111111",
                    description: "Page background color"
                }, {
                    key: "navPrimaryColor",
                    type: "color",
                    value: "#FDD54F",
                    description: "Navigation bar primary & highlight color"
                }
            ]
        },
        theme_1: {
            id: 1,
            name: "Bright Daylight",
            author: "Zijian Shao",
            previewColor: "#999",
            overlayColor: "#f6f7f8",
            brightness: "bright",
            headerHeight: 91,
            options: [
                {
                    key: "whiteNavbar",
                    type: "boolean",
                    value: false,
                    description: "Use white navigation bar"
                }, {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: false,
                    description: "Full-width layout"
                }
            ]
        },
        theme_2: {
            id: 2,
            name: "Dark Turquoise",
            author: "Zijian Shao",
            previewColor: "#09b3bc",
            overlayColor: "#323841",
            brightness: "dark",
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
                }, {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: false,
                    description: "Full-width layout"
                }
            ]
        },
        theme_3: {
            id: 3,
            name: "Dodger Blue",
            author: "Zijian Shao & TIM",
            previewColor: "#0088fb",
            overlayColor: "#f6f7f8",
            brightness: "bright",
            headerHeight: 110,
            isNew: true,
            options: [
                {
                    key: "useThemeLogo",
                    type: "boolean",
                    value: true,
                    description: "Use theme logo"
                }, {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: true,
                    description: "Full-width layout"
                }
            ]
        },
        theme_4: {
            id: 4,
            name: "Modern Waterloo",
            author: "UWaterloo",
            previewColor: "#fdd54f",
            overlayColor: "#ffffff",
            brightness: "bright",
            headerHeight: 86,
            isNew: true,
            hidden: false,
            options: [
                {
                    key: "colorScheme",
                    type: "enum",
                    value: 'default',
                    items: [{
                        name: 'default',
                        description: 'University of Waterloo<span class="color-scheme-preview" style="background:#fdd54f"></span>'
                    }, {
                        name: 'ahs',
                        description: 'Applied Health Sciences<span class="color-scheme-preview" style="background:#0098a5"></span>'
                    }, {
                        name: 'art',
                        description: 'Arts<span class="color-scheme-preview" style="background:#d93f00"></span>'
                    }, {
                        name: 'eng',
                        description: 'Engineering<span class="color-scheme-preview" style="background:#8100b4"></span>'
                    }, {
                        name: 'env',
                        description: 'Environment<span class="color-scheme-preview" style="background:#607000"></span>'
                    }, {
                        name: 'mat',
                        description: 'Mathematics<span class="color-scheme-preview" style="background:#df2498"></span>'
                    }, {
                        name: 'sci',
                        description: 'Science<span class="color-scheme-preview" style="background:#0073ce"></span>'
                    }],
                    description: "Select a color scheme"
                }, {
                    type: "separator"
                }, {
                    key: "useThemeLogo",
                    type: "boolean",
                    value: true,
                    description: "Use university logo <small>(Waterloo Learn)</small>"
                }, {
                    key: "fullWidthLayout",
                    type: "boolean",
                    value: false,
                    description: "Full-width layout"
                }
            ]
        },
        theme_99: {
            id: 99,
            name: "Learn Default",
            author: "D2L",
            previewColor: "#ddd",
            overlayColor: "#f6f7f8",
            brightness: "bright",
            headerHeight: 95
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}

function getFontConfigs() {
    var configs = [
        {
            name: "Lato",
            image: "font-sample-lato.png"
        }, {
            name: "Muli",
            size: 0,
            weight: "400,600,800",
            image: "font-sample-muli.png"
        }, {
            name: "Helvetica Neue",
            size: 0,
            weight: "300,400,700",
            image: "font-sample-helvetica-neue.png"
        }, {
            name: "Ubuntu",
            size: 0,
            weight: "400,500,700",
            image: "font-sample-ubuntu.png"
        }, {
            name: "Consolas",
            size: 0,
            weight: "400",
            source: "none",
            image: "font-sample-consolas.png"
        }, {
            name: "Comic Sans MS",
            size: 0,
            weight: "400,700",
            image: "font-sample-comic-sans-ms.png"
        }, {
            name: "Vollkorn",
            size: 0,
            weight: "400,600,700",
            image: "font-sample-vollkorn.png"
        }, {
            name: "Roboto Slab",
            size: 0,
            weight: "400,700",
            image: "font-sample-roboto-slab.png"
        }, {
            name: "Roboto Condensed",
            size: 0,
            weight: "400,700",
            image: "font-sample-roboto-condensed.png"
        }, {
            name: "Raleway",
            size: 0,
            weight: "400,600,700",
            image: "font-sample-raleway.png"
        }, {
            name: "Roboto",
            size: 0,
            weight: "400,500,700",
            image: "font-sample-roboto.png"
        }, {
            name: "Arial",
            size: 0,
            weight: "400",
            source: "none",
            image: "font-sample-arial.png"
        }
    ];
    return configs;
}

function getLink(key) {
    var list = {
        darklightStore: 'https://chrome.google.com/webstore/detail/learn-darklight/lhodieepeghcemhpbloffmljoklaklho',
        azureStore: 'https://chrome.google.com/webstore/detail/waterlooworks-azure/peeaakkcmdoeljddgdkcailflcballmm',
        autologStore: 'https://chrome.google.com/webstore/detail/waterloo-autolog/ncpmlgiinkikhgijoplpnjggobinhkpl',
        raspberryStore: 'https://chrome.google.com/webstore/detail/quest-raspberry/ifhnmgllkaeebiklhakndljclagikoak',
        feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSdrOnFC70L2juZuUzAy0r2xmPPCiWQ5sR7-U_c8ZQIuJYsqsg/viewform?usp=pp_url&entry.131896974=@@extVersion@@&entry.763960959=@@browser@@&entry.1389556052=@@os@@',
        officialWebsite: 'https://www.zijianshao.com/dlight/',
        officialWebsiteVersion: 'https://www.zijianshao.com/dlight/releases/',
        github: 'https://github.com/SssWind/Learn-Darklight',
        donate: 'https://www.paypal.me/zjshao',
        linkShare: 'https://www.zijianshao.com/dlight/sharelink/?platform=chrome',
        facebookShare: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dchrome',
        twitterShare: 'https://twitter.com/intent/tweet?hashtags=UWaterloo&original_referer=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2F&ref_src=twsrc%5Etfw&text=New%20themes%20for%20Waterloo%20Learn!%20Get%20Learn%20Darklight%20now!&tw_p=tweetbutton&url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dchrome',
        redditShare: 'https://www.reddit.com/submit?url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dchrome&title=New%20themes%20for%20Waterloo%20Learn!%20Get%20Learn%20Darklight%20now!',
        gplusShare: 'https://plus.google.com/share?url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dchrome',
        linkedInShare: 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.zijianshao.com%2Fdlight%2Fsharelink%2F%3Fplatform%3Dchrome',
        mailTo: 'mailto:sam.zj.shao@gmail.com?Subject=Learn Darklight Extension',
        imageGallery: 'https://www.zijianshao.com/dlight/course-images/'
    };
    return list[key];
}