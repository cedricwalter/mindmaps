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

        self.getContent().css("opacity",0.80);
    };


}


mindmaps.GesturePresenter = function(eventBus, mindmapModel, commandRegistry, view) {


    this.go = function() {

    };

    function updateView(node){

    }






};

