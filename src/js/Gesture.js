
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;
        case "touchend":   type="mouseup"; break;
        default: return;
    }


    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}
mindmaps.GestureView = function () {
    var self = this;

    var $content = $("#template-gesture").tmpl();


    /**
     * Returns a jquery object.
     *
     * @returns {jQuery}
     */
    this.getContent = function () {
        return $content;
    };


    /**
     * Initialise
     */
    this.init = function () {

        var ca=this.getContent().get(0)
        ca.addEventListener("touchstart", touchHandler, true);
        ca.addEventListener("touchmove", touchHandler, true);
        ca.addEventListener("touchend", touchHandler, true);
        ca.addEventListener("touchcancel", touchHandler, true);

        var gstr = new Moousture.TopedLevenMatcher(2);
        _(self.gestures).each(function (v) {
            gstr.addGesture(v.seq, function (error) {
                if (error < 0.3) {
                    console.log(v.command.id + " - " + error)
                    if (v.command.enabled) {
                        v.command.execute()
                        console.log(v.command.id + " - executed")
                    }
                }
                else
                    return
            })
        })


        var probe = new Moousture.MouseProbe(this.getContent().get(0));
        var recorder = new Moousture.Recorder({maxSteps: 20, matcher: gstr});
        var monitor = new Moousture.Monitor(30, 2);
        monitor.start(probe, recorder);


        self.getContent().css("opacity", 0.80);


    };


}


mindmaps.GesturePresenter = function (eventBus, mindmapModel, commandRegistry, view) {


    this.go = function () {

        view.gestures = [
            {
                seq: [0, 2],
                command: commandRegistry.get(mindmaps.CreateNodeCommand)
            },
            {
                seq: [2, 4],
                command: commandRegistry.get(mindmaps.CreateSiblingNodeCommand)
            }
        ]
        view.init()
    };

    function updateView(node) {

    }


};

