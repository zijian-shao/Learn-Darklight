function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "name": "Darklight Theme",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#111",
            "previewColor": "#111"
        },
        "theme_1": {
            "id": 1,
            "name": "Daylight Theme",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fff",
            "previewColor": "#fff"
        },
        "theme_2": {
            "id": 2,
            "name": "Black Turquoise Theme",
            "author": "Zijian Shao",
            "overlayColor": "#09b1b9",
            "previewColor": "#09b1b9"
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}