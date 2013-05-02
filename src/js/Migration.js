mindmaps.migrations = {
    "before style and layout as plugin": {
        onNode: function (node, obj) {
            if (obj.text.font) {
                node.setPluginData("style", "font", obj.text.font)
            }
            if (obj.branchColor) {
                node.setPluginData("style", "branchColor", obj.branchColor)
            }
            if (obj.lineWIdthOffset) {
                node.setPluginData("style", "lineWIdthOffset", obj.lineWIdthOffset)
            }
            if (obj.offset) {
                node.setPluginData("layout", "offset", obj.offset)
            }
            if (obj.foldChildren) {
                this.setPluginData("layout", "foldChildren", false)
            }
        }
    }
}