mindmaps.plugins["style"] = {
    startOrder: 100,


    onUIInit: function () {

    },


    onCreateNode: function (node) {
    },
    onNodeUpdate: function (node, selected) {
    },

    highlight:function(nodes,children){
        var hide=function (nodes,bool) {
            _.chain(nodes).each(function (node) {
                var $node=$('#node-' + node.id)
                var $node_c = $('#node-caption-' + node.id)
                var $icons=$('#node-pluginIcons-'+node.id)
                var $canvas=$('#node-canvas-'+node.id)

                $node.css('border-bottom-color', $.Color($node.css('border-bottom-color')).alpha(bool?0.1:1))
                $node_c.css('opacity', bool?0.1:1)
                $icons.css('opacity', bool?0.1:1)
                $canvas.css('opacity', bool?0.1:1)

            })
        }
      hide(mindmaps.ui.mindmapModel.getMindMap().nodes.nodes,true)
      hide(nodes,false)
        mindmaps.plugins['style'].highlightNodes=nodes
    }


}
