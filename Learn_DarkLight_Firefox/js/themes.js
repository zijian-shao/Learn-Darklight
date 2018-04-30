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
            "name": "None",
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