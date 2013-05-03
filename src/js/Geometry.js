mindmaps.Geometry = function (mindmapModel) {
    var nodes = mindmapModel.getMindMap().nodes.nodes
    var dots = function () {
        return _.chain(nodes).map(function (node) {
            return [node.id, dot(node)]
        }).object().value()
    }
    var dot = function (node) {
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
        return {"w": w, "s": s, "e": e, "n": n,
            "wn": {"x": w.x, "y": n.y},
            "en": {"x": e.x, "y": n.y},
            "ws": {"x": w.x, "y": s.y},
            "es": {"x": e.x, "y": s.y}
        }
    }
    var isUpper = function (dot_node, dot_bnode) {
        return dot_bnode.n.y <= dot_node.n.y
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
        var bNodeSector = {"end": toAngle(dot_node.n, dot_bNode.wn), "start": toAngle(dot_node.n, dot_bNode.en)}
        return inSector(upSector, bNodeSector)
    }

    this.up = function (node) {
        var dotsMap = dots()
        var thisDot = dotsMap[node.id]
        var inSectorId = _.chain(dotsMap).pairs().filter(function (id_dot) {
            var id = id_dot[0]
            var dot = id_dot[1]
            return id !== node.id && isUpper(thisDot, dot) && inUpSector(thisDot, dot)
        })
        var closeId = inSectorId.sortBy(function (entry) {
            return  -entry[1].n.y + thisDot.n.y
        }).head().value()
        return(closeId?nodes[closeId[0]]:null)
    }
    var dis = function (a, b) {
        return Math.sqrt(pow_(a, b))
    }
    var pow_ = function (a, b) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    }
}