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

mindmaps.util.plugins.ui.addIcon = function (pluginName, node,iconName) {
    var _addToPluginIcons = function ($div, node) {
        var $icons = $("#node-pluginIcons-" + node.id)
        $icons.append($div.css("float", "left").css("margin", "0.1em"))
    }
    var $icon=$("<div>", {
        id: "node-" + pluginName + "-" + node.id
    }).append($('<i>',{class:"icon-"+iconName})).hover(
        function(){
            $(this).stop().animate({ marginTop: "-0.2em" }, 100);
        },
        function(){
            $(this).stop().animate({ marginTop: "0" }, 200);
        })
    _addToPluginIcons($icon, node)
    mindmaps.util.plugins.ui.iconState(pluginName,node,"hide")
}

mindmaps.util.plugins.ui.iconState=function(pluginName,node,state){
    var $icon = $("#node-"+pluginName+"-" + node.id)
    if(state=="hide"){
        $icon.hide()
    }else if(state=="shine"){
        $icon.css("color","#31A1DF").show()
    }else if(state=="normal"){
        $icon.css("color","#000").show()
    }
}

mindmaps.util.plugins.ui.pluginIcons = function (node) {
    return $("#node-pluginIcons-" + node.id)
}