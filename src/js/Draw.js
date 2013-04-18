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


    this.setImgData = function (dataURL) {
//        //FIXME will fail when call this continuously.
//        clearDrawing();
//        if (dataURL == "") {
//            return
//        }
//
//        var canvas = drawingCanvas.get(0)
//        var context = canvas.getContext('2d');
//
//        // load image from data url
//        var imageObj = new Image();
//        imageObj.onload = function () {
//            //
//            context.drawImage(this, 0, 0);
//        };
//
//        imageObj.src = dataURL;
    }

    this.resize = function (width, height) {
        var w = width
        var h = height - $(".ui-dialog-titlebar").height()
//        self.setCanvasSize(w, h - 50)
//        window.drawCanvasW = w
//        window.drawCanvasH = h - 50
        self.can.isDrawingMode = false
        self.can.calcOffset()

        self.can.setWidth(w)
        self.can.setHeight(h)
        self.can.renderAll()
        //self.can.calcOffset()
        self.can.calcOffset()

        $("#canvas-panel", $content).width(w).height(h)

        self.can.isDrawingMode = true

        //TODO set size for every part of this panel.
    }
    /**
     * Initialise
     */
    this.init = function () {


        // initialize the canvas
        //initializeCanvas();
        self.can = new fabric.Canvas('drawingCanvas')
        self.can.add(
            new fabric.Rect({ top: 100, left: 100, width: 50, height: 50, fill: '#f55' }),
            new fabric.Circle({ top: 140, left: 230, radius: 75, fill: 'green' }),
            new fabric.Triangle({ top: 300, left: 210, width: 100, height: 100, fill: 'blue' })
        );
        self.can.freeDrawingBrush = new fabric["PencilBrush"](self.can)
        //self.can.freeDrawingBrush.color = "rgba(0,0,0,1)"
        self.can.freeDrawingBrush.width = 5
        initDrawPanel(this);
        self.can.calcOffset()

        self.getContent().css("opacity", 0.80);
    };
    function initDrawPanel(view) {


        $(".delete-tool").click(function () {
            self.can.clear()
        });

        $(".pencil-tool").click(function () {
            self.erasing=false
            self.can.freeDrawingBrush.color = self.color || "000"
            self.can.freeDrawingBrush.width = 5
            $(".tool-button").removeClass("selected");
            $(this).addClass("selected");
        });


        $(".eraser-tool").click(function () {
            self.erasing=true
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
            if(!self.erasing)
            self.can.freeDrawingBrush.color = self.color || "fff"
        })
    }

}


mindmaps.DrawPresenter = function (eventBus, mindmapModel, commandRegistry, view) {
    var self = this;
    var currentNode = null;
    this.saveImage = function () {
//        if (currentNode) {
//            var action = new mindmaps.action.ChangeImgDataAction(
//                currentNode, drawingCanvas.get(0).toDataURL());
//            mindmapModel.executeAction(action);
//        }

    }
    //FIXME call saveImage when save/autosave etc.
    eventBus.subscribe(mindmaps.Event.NODE_SELECTED, function (node) {
        self.saveImage()
        currentNode = node
        updateView(node);
    });

    this.go = function () {
        view.init();
    };

    function updateView(node) {
        view.setImgData(node.imgData)
    }


};

