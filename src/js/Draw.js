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

    this.setCanvasSize = function (width, height) {
        var can = $("#drawingCanvas", $content)[0]
        var imageData = can.toDataURL()
        $("#drawingCanvas", $content).attr("width", width).attr("height", height)
        self.setImgData(imageData)
        $("#overlay", $content).attr("width", width).attr("height", height)
        $("#canvas-panel", $content).width(width).height(height)
    }

    this.setImgData = function (dataURL) {
        //FIXME will fail when call this continuously.
        clearDrawing();
        if (dataURL == "") {
            return
        }

        var canvas = drawingCanvas.get(0)
        var context = canvas.getContext('2d');

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function () {
            //
            context.drawImage(this, 0, 0);
        };

        imageObj.src = dataURL;
    }

    this.resize = function (width, height) {
        var w = width
        var h = height - $(".ui-dialog-titlebar").height()
        if(drawingCanvasCxt)
        self.setCanvasSize(w, h - 50)
        window.drawCanvasW = w
        window.drawCanvasH = h - 50

        //TODO set size for every part of this panel.
    }
    /**
     * Initialise
     */
    this.init = function () {
        var imagesLoaded = $(document).toObservable("images-loaded");
        var cursorsLoaded = $(document).toObservable("cursors-loaded");
        initializeCanvas();
        initDrawPanel(this);
        self.getContent().css("opacity", 0.80);
    };


}


mindmaps.DrawPresenter = function (eventBus, mindmapModel, commandRegistry, view) {
    var self = this;
    var currentNode = null;
    this.saveImage = function () {
        if (currentNode) {
            var action = new mindmaps.action.ChangeImgDataAction(
                currentNode, drawingCanvas.get(0).toDataURL());
            mindmapModel.executeAction(action);
        }

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

