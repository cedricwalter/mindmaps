/**
 * Creates a new ClipboardController.
 * Handles copy, cut and paste commands.
 *
 * @constructor
 *
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.ClipboardController = function (eventBus, commandRegistry, mindmapModel) {
    var node, copyCommand, cutCommand, pasteCommand, nodeDate;

    function init() {
        copyCommand = commandRegistry.get(mindmaps.CopyNodeCommand);
        copyCommand.setHandler(doCopy);

        cutCommand = commandRegistry.get(mindmaps.CutNodeCommand);
        cutCommand.setHandler(doCut);

        pasteCommand = commandRegistry.get(mindmaps.PasteNodeCommand);
        pasteCommand.setHandler(doPaste);

        eventBus.subscribe(mindmaps.Event.DOCUMENT_CLOSED, function () {
            copyCommand.setEnabled(false);
            cutCommand.setEnabled(false);
        });

        eventBus.subscribe(mindmaps.Event.DOCUMENT_OPENED, function () {
            copyCommand.setEnabled(true);
            cutCommand.setEnabled(true);
            pasteCommand.setEnabled(true)
        });

    }

    function copySelectedNode() {
        node = mindmapModel.selectedNode.clone();
        nodeDate = new Date().getTime();
        //write to local storage to support cross doc/window copy paste
        mindmaps.LocalStorage.put("mindmaps.clipboard", JSON.stringify({node: node.serialize(), date: nodeDate}))
    }

    function doCopy() {
        copySelectedNode();
    }

    function doCut() {
        copySelectedNode();
        mindmapModel.deleteNode(mindmapModel.selectedNode);
    }

    function doPaste() {
        var fromStorage = null;
        try {
            fromStorage = JSON.parse(mindmaps.LocalStorage.get("mindmaps.clipboard"))
        }
        catch (error) {
        }
        if (!node && !fromStorage) {
            return
        } else if (!node && fromStorage) {
            var _node
            var json = fromStorage.node
            if (json)
                _node = mindmaps.Node.fromJSON(json)
            mindmapModel.createNode(_node, mindmapModel.selectedNode);
        } else if (node && fromStorage) {
            if (nodeDate < fromStorage.date) {
                var _node
                var json = fromStorage.node
                if (json)
                    _node = mindmaps.Node.fromJSON(json)
                mindmapModel.createNode(_node, mindmapModel.selectedNode);
            } else {
                mindmapModel.createNode(node.clone(), mindmapModel.selectedNode);

            }

        }
    }

    init();
};
