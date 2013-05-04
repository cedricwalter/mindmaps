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

        var ca = this.getContent().get(0)
        ca.addEventListener("touchstart",
            mindmaps.Util.touchHandler, true);
        ca.addEventListener("touchmove",
            mindmaps.Util.touchHandler, true);
        ca.addEventListener("touchend",
            mindmaps.Util.touchHandler, true);
        ca.addEventListener("touchcancel",
            mindmaps.Util.touchHandler, true);

        var gstr = new Moousture.TopedLevenMatcher(2);
        _(self.gestures).each(function (v) {
            gstr.addGesture(v.seq, function (error) {
                if (error < 0.3) {
                    if (v.command.enabled) {
                        v.command.execute()
                        logit(v.description + " - executed")
                    }
                }
                else
                    return
            })
        })

        var logit=function(s){
            $("#gesture-log").append($("<div></div>").text(s))
            $("#gesture-log").animate({ scrollTop: $('#gesture-log')[0].scrollHeight}, 1000);
        }
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
                command: commandRegistry.get(mindmaps.CreateNodeCommand),
                description:"Create Child"
            },
            {
                seq: [2, 4],
                command: commandRegistry.get(mindmaps.CreateSiblingNodeCommand),
                description:"Create Sibling"
            },
            {
                seq:[0],
                command: commandRegistry.get(mindmaps.SelectRightNodeCommand),
                description:"Move Right"
            }
            ,
            {
                seq:[2],
                command: commandRegistry.get(mindmaps.SelectDownNodeCommand),
                description:"Move Down"
            }
            ,
            {
                seq:[4],
                command: commandRegistry.get(mindmaps.SelectLeftNodeCommand),
                description:"Move Left"

            }
            ,
            {
                seq:[6],
                command: commandRegistry.get(mindmaps.SelectUpNodeCommand),
                description:"Move Up"

            }
        ]
        view.init()
    };

    function updateView(node) {

    }


};

