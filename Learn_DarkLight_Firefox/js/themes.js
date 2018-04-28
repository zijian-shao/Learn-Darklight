function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "name": "Classic Darklight Theme",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#111",
            "previewColor": "#333"
        },
        "theme_1": {
            "id": 1,
            "name": "Bright Daylight Theme",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fff",
            "previewColor": "#eee"
        },
        "theme_2": {
            "id": 2,
            "name": "Dark Turquoise Theme",
            "author": "Zijian Shao",
            "overlayColor": "#282d34",
            "previewColor": "#09b1b9"
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}