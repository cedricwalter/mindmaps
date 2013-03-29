/**
 * The canvas container is the area in between the toolbar and the statusbar.
 * Inside the mind map will be drawn and the floating panels are contained
 * within this area.
 * 
 * @constructor
 */
mindmaps.CanvasContainer = function() {
  var self = this;
  var $content = $("#canvas-container");

  /**
   * @returns {jQuery}
   */
  this.getContent = function() {
    return $content;
  };

  /**
   * Sets the height of the canvas to fit between header and footer.
   */
  this.setSize = function() {
    var windowHeight = $(window).height();
    var headerHeight = $("#topbar").outerHeight(true);
    var footerHeight = $("#bottombar").outerHeight(true);
    var height = windowHeight - headerHeight - footerHeight;
    $content.height(height);

    var size = new mindmaps.Point($content.width(), height);
    self.publish(mindmaps.CanvasContainer.Event.RESIZED, size);
  };

  /**
   * Set up the container to accept drag and drop of files from the desktop.
   */
  this.acceptFileDrop = function() {
    function ignore(e) {
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();
    }

    function handleDragOver(e) {
      ignore(e);
    }

    function handleDrop(e) {
      ignore(e);

      var files = e.originalEvent.dataTransfer.files;
      var file = files[0];

      var reader = new FileReader();
      reader.onload = function() {
        self.receivedFileDrop(reader.result);
      };
      reader.readAsText(file);
    }

    $content.bind('dragover', handleDragOver);
    $content.bind('drop', handleDrop);
  };

  this.init = function() {
    // recalculate size when window is resized.
    $(window).resize(function() {
      self.setSize();
    });

    this.setSize();
    this.acceptFileDrop();
  };

  /**
   * Callback for when a file was dropped onto the container.
   * 
   * @event
   * @param {String} result
   */
  this.receivedFileDrop = function(result) {
  };

};
EventEmitter.mixin(mindmaps.CanvasContainer);

/**
 * Events fired by the container.
 * 
 * @namespace
 */
mindmaps.CanvasContainer.Event = {
  /**
   * Fired when the container has been resized.
   * 
   * @event
   * @param {mindmaps.Point} point the new size
   */
  RESIZED : "ResizedEvent"
};

/**
 * Creates a new MainViewController. The controller is responsible for creating
 * all main ui elements.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.InspectorView} view
 */
mindmaps.MainViewController = function(eventBus, mindmapModel, commandRegistry) {
  var zoomController = new mindmaps.ZoomController(eventBus, commandRegistry);
  var canvasContainer = new mindmaps.CanvasContainer();

  /**
   * When a file was dropped on the canvas container try to open it.
   */
  canvasContainer.receivedFileDrop = function(result) {
    try {
      var doc = mindmaps.Document.fromJSON(result);
      mindmapModel.setDocument(doc);
    } catch (e) {
      eventBus.publish(mindmaps.Event.NOTIFICATION_ERROR, "Could not read the file.");
      console.warn("Could not open the mind map via drag and drop.");
    }
  };

  this.go = function() {
    canvasContainer.init();

    // init all presenters

    // toolbar
    var toolbar = new mindmaps.ToolBarView();
    var toolbarPresenter = new mindmaps.ToolBarPresenter(eventBus,
        commandRegistry, toolbar, mindmapModel,canvasContainer);
    toolbarPresenter.go();

    // canvas
    var canvas = new mindmaps.DefaultCanvasView();
    var canvasPresenter = new mindmaps.CanvasPresenter(eventBus,
        commandRegistry, mindmapModel, canvas, zoomController);
    canvasPresenter.go();

    // statusbar
    var statusbar = new mindmaps.StatusBarView();
    var statusbarPresenter = new mindmaps.StatusBarPresenter(eventBus,
        statusbar);
    statusbarPresenter.go();

    // floating Panels
    var fpf = new mindmaps.FloatPanelFactory(canvasContainer);

    // inspector
    var inspectorView = new mindmaps.InspectorView();
    var inspectorPresenter = new mindmaps.InspectorPresenter(eventBus,
        mindmapModel, commandRegistry, inspectorView);
    inspectorPresenter.go();

    var inspectorPanel = fpf
        .create("Inspector", inspectorView.getContent());
    inspectorPanel.show();
    statusbarPresenter.addEntry(inspectorPanel);

    //draw

    var drawView=new mindmaps.DrawView(
      function(dataString){
        inspectorView.setImgDataTextAreaContents(dataString)
      });
    var drawPresenter = new mindmaps.DrawPresenter(eventBus,
        mindmapModel, commandRegistry, drawView);
    var drawPanel=fpf.bigPanel("Draw",drawView.getContent(),drawView,function(){
        mindmaps.mode.inHD=true;
    },function(){
        mindmaps.mode.inHD=false;
    });
    drawPresenter.go();

    statusbarPresenter.addEntry(drawPanel);

    drawView.panel=drawPanel;
    window.drawPanel=drawPanel;


    // drawView.resize(canvasContainer.getContent().width() * 0.95, canvasContainer.getContent().height()*0.95)

    // //TODO for debug, small is cool
    // // drawView.resize(500, 500)
    // canvasContainer.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function(size) {
    //   drawView.resize(size.x * 0.9, size.y*0.9)
      
    // });




    // navigator
    var naviView = new mindmaps.NavigatorView();
    var naviPresenter = new mindmaps.NavigatorPresenter(eventBus, naviView,
        canvasContainer, zoomController);
    naviPresenter.go();

    var navigatorPanel = fpf.create("Navigator", naviView.getContent());
    navigatorPanel.show();
    statusbarPresenter.addEntry(navigatorPanel);




  };
};
