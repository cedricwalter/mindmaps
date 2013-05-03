mindmaps.plugins["layout"] = {
    startOrder: 100,


    onUIInit: function (eventBus, mindmapModel) {

        mindmaps.SelectUpperNodeCommand = function () {
            this.id = "SELECT_UPPER_NODE_COMMAND";
            //this.shortcut = "shift+tab";
            this.label = "Upper";
            this.icon = "ui-icon-arrowthick-1-n";
            this.description = "Go to upper node";
        };
        mindmaps.SelectUpperNodeCommand.prototype = new mindmaps.Command();

        var selectUpperNodeCommand = mindmaps.ui.commandRegistry.get(mindmaps.SelectUpperNodeCommand);
        selectUpperNodeCommand.setHandler(function () {
            var geo = new mindmaps.Geometry(mindmapModel)
            var node = geo.up(mindmapModel.selectedNode)
            if (node)
                mindmapModel.selectNode(node)
        });


        _(mindmaps.ui.toolbarView.menus).find(function (menu) {
            return menu.title == "Nodes"
        }).add([new mindmaps.ToolBarButton(selectUpperNodeCommand)])

        eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function () {
            selectUpperNodeCommand.setEnabled(false);
        });

        eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function () {
            selectUpperNodeCommand.setEnabled(true);


        });


    },


    onCreateNode: function (node) {
    },
    onNodeUpdate: function (node, selected) {
    }


}
