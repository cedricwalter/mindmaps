mindmaps.GestureView = function() {
    var self = this;

    var $content = $("#template-gesture").tmpl();





    /**
     * Returns a jquery object.
     *
     * @returns {jQuery}
     */
    this.getContent = function() {
        return $content;
    };



    /**
     * Initialise
     */
    this.init =  function() {
        var gstr = new Moousture.TopedLevenMatcher(2);
        gstr.addGesture([0,2], function(error){
            console.log("gesture -"+error)
        });
        var probe = new Moousture.MouseProbe(this.getContent().get(0));
        var recorder = new Moousture.Recorder({maxSteps:20, matcher: gstr});
        var monitor = new Moousture.Monitor(30, 2);
        monitor.start(probe, recorder);


        self.getContent().css("opacity",0.80);
    };


}


mindmaps.GesturePresenter = function(eventBus, mindmapModel, commandRegistry, view) {


    this.go = function() {
        view.init()
    };

    function updateView(node){

    }






};

