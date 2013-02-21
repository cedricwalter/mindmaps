/**
 * Creates a new NodeMap object. Map implementation for nodes. The key is
 * automatically set to the node id.
 * 
 * @constructor
 */
mindmaps.NodeMap = function() {
  this.nodes = {};
  this.indexes=[];
  this.count = 0;
};

/**
 * Return a node by its ID.
 * 
 * @param {String} nodeId
 * @returns {mindmaps.Node}
 */
mindmaps.NodeMap.prototype.get = function(nodeId) {
  return this.nodes[nodeId];
};

/**
 * Adds a node to the map if it hasn't been added before.
 * 
 * @param {mindmaps.Node} node
 * @returns {Boolean} true if added, false otherwise.
 */
mindmaps.NodeMap.prototype.add = function(node) {
  if (!this.nodes.hasOwnProperty(node.id)) {
    this.nodes[node.id] = node;
    this.indexes.push(node.id)
    this.count++;
    return true;
  }
  return false;
};

/**
 * Removes a node from the map.
 * 
 * @param {mindmaps.Node} node
 * @returns {Boolean} true if removed, false otherwise.
 */
mindmaps.NodeMap.prototype.remove = function(node) {
  if (this.nodes.hasOwnProperty(node.id)) {
    delete this.nodes[node.id];
    var a = this.indexes.indexOf(node.id); 
    if (a >= 0) { 
      this.indexes.splice(a, 1); 
    }
    this.count--;
    return true;
  }
  return false;
};

/**
 * Returns the number of nodes in the map.
 * 
 * @returns {Number}
 */
mindmaps.NodeMap.prototype.size = function() {
  return this.count;
};

/**
 * Returns all nodes in the map.
 * 
 * @returns {Array}
 */
mindmaps.NodeMap.prototype.values = function() {
  return Object.keys(this.nodes).map(function(key) {
    return this.nodes[key];
  }, this);
};

/**
 * Iterator for nodes.
 * 
 * @param {Function} callback, first argument should be the node.
 */
mindmaps.NodeMap.prototype.each = function(callback) {
  for ( var id in this.nodes) {
    callback(this.nodes[id]);
  }
};
