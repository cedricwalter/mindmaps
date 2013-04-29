mindmaps.DrawView = function () {
    var self = this;

    var $content = $("#template-draw").tmpl();


    /**
     * Returns a jquery object.
     *
     * @returns {jQuery}
     */
    this.getContent = function () {
        return $content;
    };


    this.resize = function (width, height) {
        var w = width
        var h = height - $(".ui-dialog-titlebar").height()

        self.can.isDrawingMode = false
        self.can.calcOffset()

        self.can.setWidth(w)
        self.can.setHeight(h - 50)
        self.can.renderAll()
        //self.can.calcOffset()
        self.can.calcOffset()

        $("#canvas-panel", $content).width(w).height(h - 50)

        self.can.isDrawingMode = true


        //TODO set size for every part of this panel.
    }
    /**
     * Initialise
     */
    this.init = function () {

        self.can = new fabric.Canvas('drawingCanvas')

        self.can.freeDrawingBrush = new fabric["PencilBrush"](self.can)
        //self.can.freeDrawingBrush.color = "rgba(0,0,0,1)"
        self.can.freeDrawingBrush.width = 5

        initDrawPanel(this);
        self.can.calcOffset()
        self.can.on('path:created', function (e) {
            self.onDrawChanged(self.can.toJSON())
        })
        self.getContent().css("opacity", 0.80);
    };
    this.setImgData = function (data) {
        self.can.clear()
        try {
            self.can.loadFromJSON(data)
        } catch (e) {
        }
    }
    function initDrawPanel(view) {


        $(".delete-tool").click(function () {
            self.can.clear()
            self.onDrawChanged(self.can.toJSON())
        });

        $(".pencil-tool").click(function () {
            self.erasing = false
            self.can.freeDrawingBrush.color = self.color || "000"
            self.can.freeDrawingBrush.width = 5
            $(".tool-button").removeClass("selected");
            $(this).addClass("selected");
        });


        $(".eraser-tool").click(function () {
            self.erasing = true
            self.can.freeDrawingBrush.color = "fff"
            self.can.freeDrawingBrush.width = 25
            $(".tool-button").removeClass("selected");
            $(this).addClass("selected");
        });

        $(".brush-color").colorPicker({pickerDefault: '000', colors: ['000', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd' , '#8c564b' , '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']});
        $(".brush-color").change(function () {
            //console.log($(this).val())
            currentColour = $(this).val()
            self.color = currentColour
            if (!self.erasing)
                self.can.freeDrawingBrush.color = self.color || "fff"
        })
    }

}


mindmaps.DrawPresenter = function (eventBus, mindmapModel, commandRegistry, view) {
    var self = this;
    var currentNode = null;
    this.saveImage = function (data) {
        if (currentNode) {
            var action = new mindmaps.action.ChangeImgDataAction(
                currentNode, data);
            mindmapModel.executeAction(action);
        }
    }

    eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function (node) {
        currentNode = node
        updateView(node);
    });

    this.go = function () {
        view.init();
        view.onDrawChanged = this.saveImage
    };

    function updateView(node) {
        if (node.getPluginData("draw", "imgData"))
            view.setImgData(node.getPluginData("draw", "imgData"))
    }


};


mindmaps.plugins["draw"] = {
    startOrder: 1000,
    onUIInit: function (eventBus, mindmapModel) {

        mindmaps.Event.PLUGIN_NODE_IMGDATA_CHANGED = "NodeImgDataChangedEvent"


        mindmaps.action.ChangeImgDataAction = function (node, text) {
            this.execute = function () {
                node.setPluginData("draw", "imgData", text)

            };

            this.event = [ mindmaps.Event.PLUGIN_NODE_IMGDATA_CHANGED, node ];
        }

        eventBus.subscribe(mindmaps.Event.PLUGIN_NODE_IMGDATA_CHANGED, function (node) {
            mindmaps.ui.canvasView.updateNode(node);
        });

        // gesture
        var gestureView = new mindmaps.GestureView();
        var gesturePresenter = new mindmaps.GesturePresenter(eventBus, mindmapModel, mindmaps.ui.commandRegistry, gestureView)
        gesturePresenter.go();
        var gesturePanel = mindmaps.ui.floatPanelFactory.create("Gesture", gestureView.getContent());

        gesturePanel.$widget.css("z-index", "20000");

        //draw

        var drawView = new mindmaps.DrawView();
        drawView.panel = drawPanel;
        window.drawPanel = drawPanel;
        var drawPresenter = new mindmaps.DrawPresenter(eventBus,
            mindmapModel, mindmaps.ui.commandRegistry, drawView);

        var drawPanel = mindmaps.ui.floatPanelFactory.bigPanel("Draw", drawView.getContent(), drawView, function () {
            mindmaps.mode.inHD = true;
        }, function () {
            mindmaps.mode.inHD = false;
        });

        drawPresenter.go();

        mindmaps.ui.statusbarPresenter.addEntryN([drawPanel, gesturePanel], "Drawing");
    },
    onCreateNode: function (node) {
        mindmaps.util.plugins.ui.addIcon("draw",node,"edit")
    },
    onNodeUpdate: function (node,selected) {
        var state=selected?"normal":"hide"
        if (node.getPluginData("draw", "imgData") && node.getPluginData("draw", "imgData").objects && node.getPluginData("draw", "imgData").objects.length > 0){
            state="shine"
        }
        mindmaps.util.plugins.ui.iconState("draw",node,state)

    }


}



