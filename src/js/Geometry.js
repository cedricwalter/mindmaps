mindmaps.Geometry = function (mindmapModel) {
    var dots = function (fun) {
        return _.chain(mindmapModel.getMindMap().nodes.nodes).map(function (node) {
            return [node.id, dot(node, fun)]
        }).object().value()
    }
    var dot = function (node, fun) {
        fun=fun || funcs.s
        var $node = $("#node-" + node.id)
        var $cap = $("#node-caption-" + node.id)
        var top = $node.offset().top
        var height = $cap.height()
        var left = $node.offset().left
        var width = $cap.width()
        var w = {"y": top + height * 0.5, "x": left}
        var s = {"y": top + height, "x": left + width * 0.5}
        var e = {"y": top + height * 0.5, "x": left + width}
        var n = {"y": top, "x": left + width * 0.5}
        return _.chain({"w": w, "s": s, "e": e, "n": n,
            "c": {"x": n.x, "y": w.y},
            "wn": {"x": w.x, "y": n.y},
            "en": {"x": e.x, "y": n.y},
            "ws": {"x": w.x, "y": s.y},
            "es": {"x": e.x, "y": s.y}
        }).pairs().map(function (pair) {
                return [pair[0], fun(pair[1])]
            }).object().value()
    }
    var isUpper = function (dot_node, dot_bnode, dir) {
        return dot_bnode[dir].y <= dot_node.c.y
    }
    var toAngle = function (p, bp) {
        return Math.atan2(-bp.y + p.y, bp.x - p.x)
    }
    var inSector = function (sect, bSect) {
        var pi = Math.PI
        var sec0, sec1
        if (sect.start <= bSect.start) {
            sec0 = sect
            sec1 = bSect
        } else {
            sec0 = bSect
            sec1 = sect
        }
        if (sec1.start <= sec0.end) {
            return true
        }
        else if (sec0.start + 2 * pi <= sec1.end) {
            return true
        } else {
            return false
        }
    }
    var inUpSector = function (dot_node, dot_bNode) {
        var angle = Math.PI / 6
        var upSector = {"start": Math.PI / 2 - angle, "end": Math.PI / 2 + angle}
        var bNodeSector = {"end": toAngle(dot_node.c, dot_bNode.ws), "start": toAngle(dot_node.c, dot_bNode.es)}
        var bNodeSector2 = {"end": toAngle(dot_node.c, dot_bNode.wn), "start": toAngle(dot_node.c, dot_bNode.en)}

        return inSector(upSector, bNodeSector) || inSector(upSector, bNodeSector2)
    }

    var _select = function (node, dir) {
        function isRelationShip(nodea,nodeb){
            return nodea.isParentOf(nodeb) || nodeb.isParentOf(nodea) || (nodea.parent && nodea.parent.isParentOf(nodeb))
        }

        var dotsMap = dots(funcs[dir])
        var thisDot = dotsMap[node.id]
        var inSectorId = _.chain(dotsMap).pairs().filter(function (id_dot) {
            var id = id_dot[0]
            var dot = id_dot[1]
            return id !== node.id && isUpper(thisDot, dot, dir) && inUpSector(thisDot, dot)
        })
        var closeId = inSectorId.sortBy(function (entry) {
            return  (-entry[1].n.y + thisDot.n.y)-(isRelationShip(mindmapModel.getMindMap().nodes.nodes[entry[0]],node)?10000:0)
        }).head().value()
        return(closeId ? mindmapModel.getMindMap().nodes.nodes[closeId[0]] : null)
    }
    var funcs = {
        "s": function (p) {
            return{"x": p.x, "y": p.y}
        },
        "n": function (p) {
            return{"x": p.x, "y": -p.y}
        },
        "e": function (p) {
            return{"x": p.y, "y": p.x}
        },
        "w": function (p) {
            return{"x": -p.y, "y": -p.x}
        }
    }
    this.up = function (node) {
        return _select(node, "s")
    }

    this.down = function (node) {
        return _select(node, "n")
    }
    this.left = function (node) {
        return _select(node, "e")
    }
    this.right = function (node) {
        return _select(node, "w")
    }


    var dis = function (a, b) {
        return Math.sqrt(pow_(a, b))
    }
    var pow_ = function (a, b) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    }


    this.newChildPosition = function (node) {
        var STEP = 50


        function average(list) {
            return _.reduce(list, function (memo, num) {
                return memo + num;
            }, 0) / list.length
        }

        var centers = _.chain(node.children.nodes).map(function (n) {
            var $node = $("#node-" + n.id)
            var $cap = $("#node-caption-" + n.id)
            return {"y": $node.position().top , "x": $node.position().left }

        }).value()
        if (centers.length == 0) {
            return({"x": 150, "y": -STEP})
        } else if (centers.length == 1) {
            var cen = centers[0]
            return({"x": cen.x, "y": cen.y + STEP})
        } else {
            var xs = _(centers).pluck("x")
            var ys = _(centers).pluck("y")
            return({"x": average(xs), "y": _(ys).max() + STEP})
        }
    }
}