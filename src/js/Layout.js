mindmaps.plugins["layout"] = {
    startOrder: 100,


    onUIInit: function (eventBus, mindmapModel) {

        mindmaps.SelectUpNodeCommand = function () {
            this.id = "SELECT_UP_NODE_COMMAND";
            this.shortcut = "up";
            this.label = "Up";
            this.icon = "ui-icon-arrowthick-1-n";
            this.description = "Go to up node";
        };
        mindmaps.SelectUpNodeCommand.prototype = new mindmaps.Command();

        var selectUpNodeCommand = mindmaps.ui.commandRegistry.get(mindmaps.SelectUpNodeCommand);
        selectUpNodeCommand.setHandler(function () {
            var node = mindmaps.ui.geometry.up(mindmapModel.selectedNode)
            if (node)
                mindmapModel.selectNode(node)
        });

        mindmaps.SelectDownNodeCommand = function () {
            this.id = "SELECT_DOWN_NODE_COMMAND";
            this.shortcut = "down";
            this.label = "Down";
            this.icon = "ui-icon-arrowthick-1-s";
            this.description = "Go to down node";
        };
        mindmaps.SelectDownNodeCommand.prototype = new mindmaps.Command();

        var selectDownNodeCommand = mindmaps.ui.commandRegistry.get(mindmaps.SelectDownNodeCommand);
        selectDownNodeCommand.setHandler(function () {
            var node = mindmaps.ui.geometry.down(mindmapModel.selectedNode)
            if (node)
                mindmapModel.selectNode(node)
        });


        mindmaps.SelectLeftNodeCommand = function () {
            this.id = "SELECT_LEFT_NODE_COMMAND";
            this.shortcut = "left";
            this.label = "Left";
            this.icon = "ui-icon-arrowthick-1-w";
            this.description = "Go to left node";
        };
        mindmaps.SelectLeftNodeCommand.prototype = new mindmaps.Command();

        var selectLeftNodeCommand = mindmaps.ui.commandRegistry.get(mindmaps.SelectLeftNodeCommand);
        selectLeftNodeCommand.setHandler(function () {
            var node = mindmaps.ui.geometry.left(mindmapModel.selectedNode)
            if (node)
                mindmapModel.selectNode(node)
        });


        mindmaps.SelectRightNodeCommand = function () {
            this.id = "SELECT_RIGHT_NODE_COMMAND";
            this.shortcut = "right";
            this.label = "Right";
            this.icon = "ui-icon-arrowthick-1-e";
            this.description = "Go to right node";
        };
        mindmaps.SelectRightNodeCommand.prototype = new mindmaps.Command();

        var selectRightNodeCommand = mindmaps.ui.commandRegistry.get(mindmaps.SelectRightNodeCommand);
        selectRightNodeCommand.setHandler(function () {
            var node = mindmaps.ui.geometry.right(mindmapModel.selectedNode)
            if (node)
                mindmapModel.selectNode(node)
        });

        _(mindmaps.ui.toolbarView.menus).find(function (menu) {
            return menu.title == "Nodes"
        }).add(_.chain([selectUpNodeCommand,selectDownNodeCommand,selectLeftNodeCommand,selectRightNodeCommand]).map(function(c){return new mindmaps.ToolBarButton(c)}).toArray().value())



        eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function () {
            selectUpNodeCommand.setEnabled(false);
            selectDownNodeCommand.setEnabled(false);
            selectLeftNodeCommand.setEnabled(false);
            selectRightNodeCommand.setEnabled(false);

        });

        eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function () {
            selectUpNodeCommand.setEnabled(true);
            selectDownNodeCommand.setEnabled(true);
            selectLeftNodeCommand.setEnabled(true);
            selectRightNodeCommand.setEnabled(true);


        });


    },


    onCreateNode: function (node) {
    },
    onNodeUpdate: function (node, selected) {
    }


}
