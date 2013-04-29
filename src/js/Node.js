/**
 * Creates a new node.
 *
 * @constructor
 */
mindmaps.Node = function () {
    this.id = mindmaps.Util.getId();
    this.parent = null;
    this.children = new mindmaps.NodeMap();
    this.pluginData = {}

    this.text = {
        caption: "New Idea"

    };
    this.setPluginData("style", "font", {
        style: "normal",
        weight: "normal",
        decoration: "none",
        /** unit: pixel */
        size: 15,
        color: "#000000"
    })
    this.setPluginData("style", "lineWidthOffset", 0)
    this.setPluginData("style", "branchColor", "#000000")
    this.setPluginData("layout", "offset", new mindmaps.Point());
    this.foldChildren = false;
};

/**
 * Creates a deep copy of this node, where all nodes have a new IDs.
 *
 * @returns {mindmaps.Node} the cloned node
 */
mindmaps.Node.prototype.clone = function () {
    var clone = new mindmaps.Node();
    var text = {
        caption: this.text.caption
    };

    clone.text = text;

    clone.pluginData = $.extend(true, {}, this.pluginData)


    this.forEachChild(function (child) {
        var childClone = child.clone();
        clone.addChild(childClone);
    });

    return clone;
};

/**
 * Creates a new node object from JSON String.
 *
 * @param {String} json
 * @returns {mindmaps.Node}
 */
mindmaps.Node.fromJSON = function (json) {
    return mindmaps.Node.fromObject(JSON.parse(json));
};

/**
 * Creates a new node object from a generic object.
 *
 * @param {Object} obj
 * @returns {mindmaps.Node}
 */
mindmaps.Node.fromObject = function (obj) {
    var node = new mindmaps.Node();
    node.id = obj.id;
    node.text = obj.text;
    if (obj.pluginData) {
        node.pluginData = obj.pluginData
    }
    _(mindmaps.migrations).each(function (m) {
        if (m.onNode) {
            m.onNode(node,obj)
        }
    })
    // extract all children from array of objects
    obj.children.forEach(function (child) {
        var childNode = mindmaps.Node.fromObject(child);
        node.addChild(childNode);
    });

    return node;
};

/**
 * Returns a presentation of this node and its children ready for serialization.
 * Called by JSON.stringify().
 *
 * @private
 */
mindmaps.Node.prototype.toJSON = function () {
    // TODO see if we cant improve this
    // http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
    // copy all children into array
    var self = this;
    var children = (function () {
        var result = [];
        self.forEachChild(function (child) {
            result.push(child.toJSON());
        });
        return result;
    })();

    var obj = {
        id: this.id,
        // store parent as id since we have to avoid circular references
        parentId: this.parent ? this.parent.id : null,
        text: this.text,
        pluginData: this.pluginData,
        children: children
    };

    return obj;
};

/**
 * Creates a JSON representation of the node.
 *
 * @returns {String}
 */
mindmaps.Node.prototype.serialize = function () {
    return JSON.stringify(this);
};

/**
 * Adds a child to the node.
 *
 * @param {mindmaps.Node} node
 */
mindmaps.Node.prototype.addChild = function (node) {
    node.parent = this;
    this.children.add(node);
};

/**
 * Removes a direct child.
 *
 * @param {mindmaps.Node} node
 */
mindmaps.Node.prototype.removeChild = function (node) {
    node.parent = null;
    this.children.remove(node);
};

/**
 * Returns whether this node is a root.
 *
 * @returns {Boolean}
 */
mindmaps.Node.prototype.isRoot = function () {
    return this.parent === null;
};

/**
 * Returns whether this node is a leaf.
 *
 * @returns {Boolean}
 */
mindmaps.Node.prototype.isLeaf = function () {
    return this.children.size() === 0;
};

/**
 * Returns the parent node.
 *
 * @returns {mindmaps.Node}
 */
mindmaps.Node.prototype.getParent = function () {
    return this.parent;
};

/**
 * Returns the root if this node is part of a tree structure, otherwise it
 * returns itself.
 *
 * @returns {mindmaps.Node} The root of the tree structure.
 */
mindmaps.Node.prototype.getRoot = function () {
    var root = this;
    while (root.parent) {
        root = root.parent;
    }

    return root;
};

/**
 * Gets the position of the node relative to the root.
 *
 * @returns {mindmaps.Point}
 */
mindmaps.Node.prototype.getPosition = function () {
    var pos = this.getPluginData("layout", "offset").clone();
    var node = this.parent;

    while (node) {
        pos.add(node.getPluginData("layout", "offset"));
        node = node.parent;
    }
    return pos;
};

/**
 * Gets the depth of the node. Root has a depth of 0.
 *
 * @returns {Number}
 */
mindmaps.Node.prototype.getDepth = function () {
    var node = this.parent;
    var depth = 0;

    while (node) {
        depth++;
        node = node.parent;
    }

    return depth;
};

mindmaps.Node.prototype.getLineWidthOffset = function () {

    var maxLineWidthOffsetOfDescendant = 0;
    this.forEachDescendant(function (node) {
        if (node.getPluginData("style", "lineWidthOffset") > maxLineWidthOffsetOfDescendant) {
            maxLineWidthOffsetOfDescendant = node.getPluginData("style", "lineWidthOffset")
        }
    });

    return this.getPluginData("style", "lineWidthOffset") + maxLineWidthOffsetOfDescendant;
}

/**
 * Gets the children of the node. Traverses the whole sub tree if recursive is
 * true.
 *
 * @param recursive
 * @returns {Array}
 * @deprecated
 */
mindmaps.Node.prototype.getChildren = function (recursive) {
    var nodes = [];

    this.children.each(function (node) {
        if (recursive) {
            var childNodes = node.getChildren(true);
            childNodes.forEach(function (child) {
                nodes.push(child);
            });
        }
        nodes.push(node);
    });

    return nodes;
};

/**
 * Iterator. Traverses all child nodes.
 *
 * @param {Function} func
 */
mindmaps.Node.prototype.forEachChild = function (func) {
    this.children.each(func);
};

/**
 * Iterator. Traverses all child nodes recursively.
 *
 * @param {Function} func
 */
mindmaps.Node.prototype.forEachDescendant = function (func) {
    this.children.each(function (node) {
        func(node);
        node.forEachDescendant(func);
    });
};

/**
 * Sets the caption for the node
 *
 * @param {String} caption
 */
mindmaps.Node.prototype.setCaption = function (caption) {
    this.text.caption = caption;
};

/**
 * Gets the caption for the node.
 *
 * @returns {String}
 */
mindmaps.Node.prototype.getCaption = function () {
    return this.text.caption;
};

/**
 * Tests (depth-first) whether the other node is a descendant of this node.
 *
 * @param {mindmaps.Node} other
 * @returns {Boolean} true if descendant, false otherwise.
 */
mindmaps.Node.prototype.isDescendant = function (other) {
    function test(node) {
        var children = node.children.values();
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (test(child)) {
                return true;
            }

            if (child === other) {
                return true;
            }
        }
        return false;
    }

    return test(this);
};


mindmaps.Node.prototype.getPluginData = function (pluginName, propertyName) {
    this.pluginData = this.pluginData || {}
    this.pluginData[pluginName] = this.pluginData[pluginName] || {}
    return this.pluginData[pluginName][propertyName]
}


mindmaps.Node.prototype.setPluginData = function (pluginName, propertyName, value) {
    var old = $.extend(true, {}, this.pluginData)
    this.pluginData = this.pluginData || {}
    this.pluginData[pluginName] = this.pluginData[pluginName] || {}
    this.pluginData[pluginName][propertyName] = value
    if (!this.getPluginData("style", "font")) {

        console.log("not here")
        console.log(old)
    }
}