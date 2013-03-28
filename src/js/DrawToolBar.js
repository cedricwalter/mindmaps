/**
 * Creates a new ToolBarView.
 * 
 * @constructor
 */
//TODO extends, don't copy/paste
mindmaps.DrawToolBarView = function() {
  var self = this;
  this. buttons=[];
    this.menus=[];
  this.init = function() {

  };
    this.ensureResponsive=function(){
        var short=mindmaps.responsive.isMiddleDevice()
        self.buttons.forEach(function(bu){bu.setSmall(short)})
        self.menus.forEach(function(menu){menu.setSmall(short)})
    }

  /**
   * Adds a button to the toolbar with the given align function.
   * 
   * @param {mindmaps.ToolBarButton} button
   * @param {Function} alignFunc
   */
  this.addButton = function(button, alignFunc) {
    // var $button = this.createButton(button);
      self.buttons.push(button)
    alignFunc(button.asJquery());
  };

  /**
   * Adds a set of buttons grouped together to the toolbar.
   * 
   * @param {mindmaps.ToolBarButton[]} buttons
   * @param {Function} alignFunc
   */
  this.addButtonGroup = function(buttons, alignFunc) {
    var $buttonset = $("<span/>");
    buttons.forEach(function(button) {
      // var $button = self.createButton(button);
        self.buttons.push(button)
      $buttonset.append(button.asJquery());
    });
    $buttonset.buttonset();
    alignFunc($buttonset);
  };

  /**
   * Adds a menu to the toolbar.
   * 
   * @param {mindmaps.ToolBarMenu} menu
   */
  this.addMenu = function(menu) {
      this.menus.push(menu);
    this.alignRight(menu.getContent());
  };

  /**
   * Adds the element to the left side of the toolbar.
   * 
   * @param {jQuery} $el
   */
  this.alignLeft = function($el) {
    $el.appendTo("#draw-toolbar");
  };

  /**
   * Adds the element to the right side of the toolbar.
   * 
   * @param {jQuery} $el
   */
  this.alignRight = function($el) {
    $el.appendTo("#draw-toolbar");
  };
};

/**
 * Creates a new ToolBarPresenter.
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.DrawToolBarView} view
 * @param {mindmaps.MindMapModel} mindmapModel
 */

//TODO extends, don't copy/paste

mindmaps.DrawToolBarPresenter = function(eventBus, commandRegistry, view,
    mindmapModel,canvasContainer) {
  /**
   * Returns a button that registers with a command of the given commandType
   * 
   * @param {mindmaps.Command} commandType
   * @returns {mindmaps.ToolBarButton}
   */
  function commandToButton(commandType) {
    var command = commandRegistry.get(commandType);
    return new mindmaps.ToolBarButton(command);
  }

  function commandsToButtons(commands) {
    return commands.map(commandToButton);
  }

  // populate toolbar

  // node buttons
  var nodeCommands = [ mindmaps.CreateNodeCommand, mindmaps.CreateSiblingNodeCommand, mindmaps.DeleteNodeCommand ];
  var nodeButtons = commandsToButtons(nodeCommands);
  view.addButtonGroup(nodeButtons, view.alignLeft);



//
//
//  var moveCommands = [ mindmaps.SelectParentNodeCommand, mindmaps.SelectChildFirstNodeCommand,mindmaps.SelectSiblingNextNodeCommand,mindmaps.SelectSiblingPrevNodeCommand];
//  var moveButtons = commandsToButtons(moveCommands);
//  view.addButtonGroup(moveButtons, view.alignLeft);
//
//  // undo buttons
//  var undoCommands = [ mindmaps.UndoCommand, mindmaps.RedoCommand ];
//  var undoButtons = commandsToButtons(undoCommands);
//  view.addButtonGroup(undoButtons, view.alignLeft);
//
//  // clipboard buttons.
//  var clipboardCommands = [ mindmaps.CopyNodeCommand,
//      mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand ];
//  var clipboardButtons = commandsToButtons(clipboardCommands);
//  view.addButtonGroup(clipboardButtons, view.alignLeft);
//
//  // file menu
//  var fileMenu = new mindmaps.ToolBarMenu("Mind map", "ui-icon-document");
//  var fileCommands = [ mindmaps.NewDocumentCommand,
//      mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand,
//      mindmaps.ExportCommand, mindmaps.PrintCommand,
//      mindmaps.CloseDocumentCommand ];
//  var fileButtons = commandsToButtons(fileCommands);
//  fileMenu.add(fileButtons);
//  view.addMenu(fileMenu);
//
//  // help button
//  view.addButton(commandToButton(mindmaps.HelpCommand), view.alignRight);

  this.go = function() {
    view.init();
      view.ensureResponsive();
  };
  function bind(){
      canvasContainer.subscribe(mindmaps.CanvasContainer.Event.RESIZED,function(){

          view.ensureResponsive();
      })
  }
  bind();
};
