/**
 * @namespace
 */
mindmaps.action = {};

/**
 * Creates a new action.
 *
 * @constructor
 */
mindmaps.action.Action = function () {
};

mindmaps.action.Action.prototype = {
    /**
     * Make this action un-undoable.
     *
     * @returns {Action}
     */
    noUndo: function () {
        delete this.undo;
        delete this.redo;
        return this;
    },

    /**
     * Don't emit an event after execution.
     *
     * @returns {Action}
     */
    noEvent: function () {
        delete this.event;
        return this;
    },

    /**
     * Executes this action. Explicitly returning false will cancel this action
     * and not raise an event or undoable action.
     *
     */
    execute: function () {
    },

    cancel: function () {
        this.cancelled = true;
    }
};

/**
 * Creates a new MoveNodeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {Point} offset
 */
mindmaps.action.MoveNodeAction = function (node, offset) {
    var oldOffset = node.getPluginData("layout", "offset");

    this.execute = function () {
        node.setPluginData("layout", "offset", offset);
    };

    this.event = [ mindmaps.Event.NODE_MOVED, node ];
    this.undo = function () {
        return new mindmaps.action.MoveNodeAction(node, oldOffset);
    };
};
mindmaps.action.MoveNodeAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new DeleteNodeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {mindmaps.MindMap} mindmap
 */
mindmaps.action.DeleteNodeAction = function (node, mindmap) {
    var parent = node.getParent();

    this.execute = function () {
        if (node.isRoot()) {
            return false;
        }
        mindmap.removeNode(node);
    };

    this.event = [ mindmaps.Event.NODE_DELETED, node, parent ];
    this.undo = function () {
        return new mindmaps.action.CreateNodeAction(node, parent, mindmap);
    };
};
mindmaps.action.DeleteNodeAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new CreateAutoPositionedNodeAction.
 *
 * @constructor
 * @param {mindmaps.Node} parent
 * @param {mindmaps.MindMap} mindmap
 * @returns {CreateNodeAction}
 */
mindmaps.action.CreateAutoPositionedNodeAction = function (parent, mindmap) {
    if (parent.isRoot()) {
        var branchColor = mindmaps.Util.randomColor();

        // calculate position
        // magic formula
        var leftRight = Math.random() > 0.49 ? 1 : -1;
        var topBottom = Math.random() > 0.49 ? 1 : -1;
        var x = leftRight * (100 + Math.random() * 250);
        var y = topBottom * (Math.random() * 250);
    } else {
        var branchColor = parent.getPluginData("style", "branchColor");

        // calculate position
        var leftRight = parent.getPluginData("layout", "offset").x > 0 ? 1 : -1;

        var c = mindmaps.ui.geometry.newChildPosition(parent)
        var x = Math.abs(c.x) * leftRight
        var y = c.y
        var allDots = mindmaps.ui.geometry.dots()
        var parentDots = mindmaps.ui.geometry.dot(parent)
        while (true) {
            var newDots = mindmaps.ui.geometry.dot(parent, function (p) {
                return {"x": p.x + x, "y": p.y + y}
            })

            if (!_(allDots).any(function (v) {
                return mindmaps.ui.geometry.rectOverlap(v, newDots)
            }))
                break;
            else {
                y = y + 50
            }
        }

    }
    var node = new mindmaps.Node();
    node.setPluginData("style", "branchColor", branchColor);
    node.shouldEditCaption = true;
    node.setPluginData("layout", "offset", new mindmaps.Point(x, y));

    return new mindmaps.action.CreateNodeAction(node, parent, mindmap);
};

/**
 * Creates a new CreateNodeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {mindmaps.Node} parent
 * @param {mindmaps.MindMap} mindmap
 */
mindmaps.action.CreateNodeAction = function (node, parent, mindmap) {
    this.execute = function () {
        mindmap.addNode(node);
        parent.addChild(node);
    };

    this.event = [ mindmaps.Event.NODE_CREATED, node ];
    this.undo = function () {
        return new mindmaps.action.DeleteNodeAction(node, mindmap);
    };
};
mindmaps.action.CreateNodeAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new ToggleNodeFoldAction.
 *
 *
 * @constructor
 * @param {mindmaps.Node} node
 * @returns {Action}
 */
mindmaps.action.ToggleNodeFoldAction = function (node) {
    if (node.getPluginData("layout", "foldChildren")) {
        return new mindmaps.action.OpenNodeAction(node);
    } else {
        return new mindmaps.action.CloseNodeAction(node);
    }
};

/**
 * Creates a new OpenNodeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 */
mindmaps.action.OpenNodeAction = function (node) {
    this.execute = function () {
        node.setPluginData("layout", "foldChildren", false);
    };

    this.event = [ mindmaps.Event.NODE_OPENED, node ];

};
mindmaps.action.OpenNodeAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new CloseNodeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 */
mindmaps.action.CloseNodeAction = function (node) {
    this.execute = function () {
        node.setPluginData("layout", "foldChildren", true);
    };

    this.event = [ mindmaps.Event.NODE_CLOSED, node ];

};
mindmaps.action.CloseNodeAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new ChangeNodeCaptionAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {String} caption
 */
mindmaps.action.ChangeNodeCaptionAction = function (node, caption) {
    var oldCaption = node.getCaption();

    this.execute = function () {
        // dont update if nothing has changed
        if (oldCaption === caption) {
            return false;
        }
        node.setCaption(caption);
    };

    this.event = [ mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.ChangeNodeCaptionAction(node, oldCaption);
    };
};
mindmaps.action.ChangeNodeCaptionAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new ChageNodeFontSizeAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {Integer} step
 */
mindmaps.action.ChangeNodeFontSizeAction = function (node, step) {
    this.execute = function () {
        var font = node.getPluginData("style", "font")
        font.size = font.size + step;
        node.setPluginData("style", "font", font)
    };

    this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.ChangeNodeFontSizeAction(node, -step);
    };
};
mindmaps.action.ChangeNodeFontSizeAction.prototype = new mindmaps.action.Action();

/**
 * @constructor
 * @param {mindmaps.Node} node
 * @returns {ChangeNodeFontSizeAction}
 */
mindmaps.action.DecreaseNodeFontSizeAction = function (node) {
    return new mindmaps.action.ChangeNodeFontSizeAction(node, -4);
};

/**
 * @constructor
 * @param {mindmaps.Node} node
 * @returns {ChangeNodeFontSizeAction}
 */
mindmaps.action.IncreaseNodeFontSizeAction = function (node) {
    return new mindmaps.action.ChangeNodeFontSizeAction(node, 4);
};

/**
 * Creates a new ChageNodeLineWidthAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {Integer} step
 */
mindmaps.action.ChangeNodeLineWidthAction = function (node, step) {
    this.execute = function () {
        var lwo = node.getPluginData("style", "lineWidthOffset")
        node.setPluginData("style", "lineWidthOffset", lwo + step);
    };

    this.event = [ mindmaps.Event.NODE_LINE_WIDTH_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.ChangeNodeLineWidthAction(node, -step);
    };
};
mindmaps.action.ChangeNodeLineWidthAction.prototype = new mindmaps.action.Action();

/**
 * @constructor
 * @param {mindmaps.Node} node
 * @returns {ChangeNodeLineWidthAction}
 */
mindmaps.action.DecreaseNodeLineWidthAction = function (node) {
    return new mindmaps.action.ChangeNodeLineWidthAction(node, -2);
};

/**
 * @constructor
 * @param {mindmaps.Node} node
 * @returns {ChangeNodeLineWidthAction}
 */
mindmaps.action.IncreaseNodeLineWidthAction = function (node) {
    return new mindmaps.action.ChangeNodeLineWidthAction(node, 2);
};

/**
 * Creates a new SetFontWeightAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {Boolean} bold
 */
mindmaps.action.SetFontWeightAction = function (node, bold) {
    this.execute = function () {
        var font = node.getPluginData("style", "font")

        var weight = bold ? "bold" : "normal";
        font.weight = weight;
        node.setPluginData("style", "font", font)

    };

    this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.SetFontWeightAction(node, !bold);
    };
};
mindmaps.action.SetFontWeightAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new SetFontStyleAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {Boolean} italic
 */
mindmaps.action.SetFontStyleAction = function (node, italic) {
    this.execute = function () {
        var font = node.getPluginData("style", "font")

        var style = italic ? "italic" : "normal";
        font.style = style;
        node.setPluginData("style", "font", font)

    };

    this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.SetFontStyleAction(node, !italic);
    };
};
mindmaps.action.SetFontStyleAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new SetFontDecorationAction. Possible styles: "none", "underline",
 * "line-through".
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {String} style
 */
mindmaps.action.SetFontDecorationAction = function (node, style) {
    var font = node.getPluginData("style", "font")

    var oldDecoration = font.decoration;
    this.execute = function () {
        font.decoration = style;
        node.setPluginData("style", "font", font)

    };

    this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.SetFontDecorationAction(node, oldDecoration);
    };
};
mindmaps.action.SetFontDecorationAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new SetFontColorAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {String} fontColor color as hex
 */
mindmaps.action.SetFontColorAction = function (node, fontColor) {
    var font = node.getPluginData("style", "font")
    var oldColor = font.color;
    this.execute = function () {
        if (fontColor === font.color) {
            return false;
        }
        font.color = fontColor;
        node.setPluginData("style", "font", font)
    };

    this.event = [ mindmaps.Event.NODE_FONT_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.SetFontColorAction(node, oldColor);
    };
};
mindmaps.action.SetFontColorAction.prototype = new mindmaps.action.Action();

/**
 * Creates a new SetBranchColorAction.
 *
 * @constructor
 * @augments mindmaps.action.Action
 * @param {mindmaps.Node} node
 * @param {String} branchColor color as hex
 */
mindmaps.action.SetBranchColorAction = function (node, branchColor) {

    var oldColor = node.getPluginData("style", "branchColor");
    this.execute = function () {
        if (branchColor === oldColor) {
            return false;
        }
        node.setPluginData("style", "branchColor", branchColor);
    };

    this.event = [ mindmaps.Event.NODE_BRANCH_COLOR_CHANGED, node ];
    this.undo = function () {
        return new mindmaps.action.SetBranchColorAction(node, oldColor);
    };
};
mindmaps.action.SetBranchColorAction.prototype = new mindmaps.action.Action();

/**
 * A composite action is a group of actions.
 */
mindmaps.action.CompositeAction = function () {
    this.actions = [];
};

mindmaps.action.CompositeAction.prototype.addAction = function (action) {
    this.actions.push(action);
};

/**
 * Apply fn on each action.
 */
mindmaps.action.CompositeAction.prototype.forEachAction = function (fn) {
    this.actions.forEach(fn)
};


/**
 * Changes the branch color of all the node's children to branch
 * color of the node.
 */
mindmaps.action.SetChildrenBranchColorAction = function (node) {
    mindmaps.action.CompositeAction.call(this);
    var branchColor = node.getPluginData("style", "branchColor")
    var self = this;

    node.forEachDescendant(function (desc) {
        self.addAction(new mindmaps.action.SetBranchColorAction(desc, branchColor));
    });
}
mindmaps.action.SetChildrenBranchColorAction.prototype = new mindmaps.action.CompositeAction();






