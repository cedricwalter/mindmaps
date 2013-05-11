/**
 * Creates a new ToolBarView.
 *
 * @constructor
 */
mindmaps.ToolBarView = function () {
    var self = this;
    this.buttons = [];
    this.menus = [];
    this.init = function () {

    };
    this.ensureResponsive = function () {
//        var short = mindmaps.responsive.isMiddleDevice()
//        self.buttons.forEach(function (bu) {
//            bu.setSmall(short)
//        })
//        self.menus.forEach(function (menu) {
//            menu.setSmall(short)
//        })
    }

    /**
     * Adds a button to the toolbar with the given align function.
     *
     * @param {mindmaps.ToolBarButton} button
     * @param {Function} alignFunc
     */
    this.addButton = function (button) {

        function fromButton(b){

            return $('<a></a>').attr("data-toggle","button").addClass("btn","btn-toggle").click(function(e){b.command.execute()}).text(b.getTitle()).prepend($('<i>').addClass(b.command.icon).addClass("pull-left"))
        }
        $("ul.nav",$("#topbar")).append(fromButton(button))

    };


    /**
     * Adds a menu to the toolbar.
     *
     * @param {mindmaps.ToolBarMenu} menu
     */
    this.addMenu = function (menu) {
        this.menus.push(menu);
        //this.alignRight(menu.getContent());
        $("ul.nav",$("#topbar")).append(menu.$menu)
    };


};

/**
 * Toolbar button model.
 *
 * @constructor
 * @param {mindmaps.Command} command
 */

mindmaps.ToolBarButton = function (command) {
    this.command = command;

    // callback to update display state
    var self = this;
    command.subscribe(mindmaps.Command.Event.ENABLED_CHANGED,
        function (enabled) {
            if (self.setEnabled) {
                self.setEnabled(enabled);
            }
        });
};

/**
 * Returns whether the button should have an enabled style.
 *
 * @returns {Boolean}
 */
mindmaps.ToolBarButton.prototype.isEnabled = function () {
    return this.command.enabled;
};

/**
 * Executes the button's command.
 */
mindmaps.ToolBarButton.prototype.click = function () {
    this.command.execute();
};

/**
 * Gets the button's title.
 *
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getTitle = function () {
    return this.command.label;
};

/**
 * Gets the tooltip.
 *
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getToolTip = function () {
    var tooltip = this.command.description;

    var shortcut = this.command.shortcut;
    if (shortcut) {
        if (Array.isArray(shortcut)) {
            shortcut = shortcut.join(", ");
        }

        tooltip += " [" + shortcut.toUpperCase() + "]";
    }

    return tooltip;
};

/**
 * Gets the unique id of the button.
 *
 * @returns {String}
 */
mindmaps.ToolBarButton.prototype.getId = function () {
    return "button-" + this.command.id;
};

/**
 * Constructs a jQuery element that represents the button.
 *
 * @returns {jQuery}
 */
mindmaps.ToolBarButton.prototype.asJquery = function () {
    var self = this;
    var $button = $("<button/>", {
        id: this.getId(),
        title: this.getToolTip()
    }).click(function () {
            self.click();
        }).button({
            label: this.getTitle(),
            disabled: !this.isEnabled()
        });

    var icon = this.command.icon;
    if (icon) {
        $button.button({
            icons: {
                primary: icon
            }
        });
    }

    // callback to update display state
    this.setEnabled = function (enabled) {
        $button.button(enabled ? "enable" : "disable");
    };

    this.setSmall = function (small) {
        $button.button({
            label: small ? this.getTitle().substr(0, 1) : this.getTitle()
        })
    }

    return $button;
};

/**
 * Creates a new ToolBarMenu.
 *
 * @constructor
 * @param {String} title
 * @param {String} icon
 */
mindmaps.ToolBarMenu = function (title, icon) {
    this.title=title
    var self = this;
    this.buttons = [];
    var control='<li><div>\
    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Dropdown trigger</a>\
        <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">\
        </ul></div></li>'
    var itemControl='<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>'

    //TODO split responsive aspect out.
//    this.setSmall = function (small) {
//        self.$menuButton.button({label: small ? title.substr(0, 1) : title})
//        self.buttons.forEach(function (bu) {
//            bu.setSmall(small)
//        })
//    }
    var $control=$(control)
    $("a",$control).text(self.title).prepend($('<i>').addClass(icon).addClass("pull-left")).append($('<i>').addClass("icon-angle-down").addClass("pull-right"))
    this.$menu = $control

    /**
     * Adds a new button entry to the menu.
     *
     * @param {mindmaps.ToolBarButton|mindmaps.ToolBarButtons[]} buttons a
     *            single button or an array of buttons
     */
    this.add = function (buttons) {
        function fromButton(b){
            var $ic =$(itemControl)
            $("a",$ic).text(b.getTitle()).click(function(){b.command.execute()}).prepend($('<i>').addClass(b.command.icon).addClass("pull-eft"))
            return $ic
        }
        if (!Array.isArray(buttons)) {
            buttons = [ buttons ];
        }
        _.chain(buttons).each(function(b){
            $("ul",self.$menu).append(fromButton(b))
        })
    };

    /**
     * Returns the underlying jquery object.
     *
     * @returns {jQuery}
     */
    this.getContent = function () {
        return this.$menu;
    };
};

/**
 * Creates a new ToolBarPresenter.
 *
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.CommandRegistry} commandRegistry
 * @param {mindmaps.ToolBarView} view
 * @param {mindmaps.MindMapModel} mindmapModel
 */
mindmaps.ToolBarPresenter = function (eventBus, commandRegistry, view, mindmapModel, canvasContainer) {
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






    var navigateMenu=new mindmaps.ToolBarMenu("Nodes", "icon-plus");
    var navigateCommands=[ mindmaps.CreateNodeCommand, mindmaps.CreateSiblingNodeCommand, mindmaps.DeleteNodeCommand,mindmaps.SelectParentNodeCommand, mindmaps.SelectChildFirstNodeCommand, mindmaps.SelectSiblingNextNodeCommand, mindmaps.SelectSiblingPrevNodeCommand  ];
    var navigateButtons = commandsToButtons(navigateCommands);
    navigateMenu.add(navigateButtons);
    view.addMenu(navigateMenu);



    var editMenu=new mindmaps.ToolBarMenu("Edit", "icon-copy");
    var editCommands=[ mindmaps.UndoCommand, mindmaps.RedoCommand ,mindmaps.CopyNodeCommand,
        mindmaps.CutNodeCommand, mindmaps.PasteNodeCommand ];
    var editButtons = commandsToButtons(editCommands);
    editMenu.add(editButtons);
    view.addMenu(editMenu);

    // file menu
    var fileMenu = new mindmaps.ToolBarMenu("Document", "icon-file");
    var fileCommands = [ mindmaps.NewDocumentCommand,
        mindmaps.OpenDocumentCommand, mindmaps.SaveDocumentCommand,
        mindmaps.ExportCommand, mindmaps.PrintCommand,
        mindmaps.CloseDocumentCommand ];
    var fileButtons = commandsToButtons(fileCommands);
    fileMenu.add(fileButtons);
    view.addMenu(fileMenu);

    // help button
    view.addButton(commandToButton(mindmaps.HelpCommand));

    this.go = function () {
        view.init();
        view.ensureResponsive();
    };
    function bind() {
        canvasContainer.subscribe(mindmaps.CanvasContainer.Event.RESIZED, function () {
            view.ensureResponsive();
        })
    }

    bind();
};
