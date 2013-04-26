//For more detail of plugin stuff,
// see Draw.js for example.

mindmaps.plugins = mindmaps.plugins || {}

mindmaps.util={
    plugins:{
        ui:{}
    }


}
mindmaps.util.plugins.ui.placeOnNode=function($div,node) {
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

mindmaps.util.plugins.ui.createOnNode=function($div,node){
    $node=$("#node-" + node.id);
    $div.css({
        "position": "absolute",
        "top": 0,
        "left": $node.width() * 1.05,
        "z-index": 100
    }).appendTo($node);
}