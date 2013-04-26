//For more detail of plugin stuff,
// see Draw.js for example.

mindmaps.plugins = mindmaps.plugins || {}

mindmaps.util = {
    plugins: {
        ui: {}
    }


}
mindmaps.util.plugins.ui.placeOnNode = function ($div, node) {
    var $text = $("#node-caption-" + node.id)
    if (node.isRoot()) {
        $div.css({
            "left": $text.width() * 0.8,
            "width": $text.width()
        });
    }
    else {
        $div.css({
            "left": $text.width() * 1.2,
            "width": $text.width()
        });
    }
}

mindmaps.util.plugins.ui.createOnNode = function ($div, node) {
    var $node = $("#node-" + node.id);
    var $text = $("#node-caption-" + node.id)

    $div.css({
        "position": "absolute",
        "top": 0,
        "z-index": 100
    }).appendTo($node);
    if (node.isRoot()) {
        $div.css({
            "left": $text.width() * 0.8,
            "width": $text.width()
        });
    }
    else {
        $div.css({
            "left": $text.width() * 1.2,
            "width": $text.width()
        });
    }
}

mindmaps.util.plugins.ui.addToPluginIcons = function ($div, node) {
    var $icons = $("#node-pluginIcons-" + node.id)
    $icons.append($div.css("float","left").css("margin","0.1em"))
}
mindmaps.util.plugins.ui.pluginIcons = function (node) {
    return $("#node-pluginIcons-" + node.id)
}