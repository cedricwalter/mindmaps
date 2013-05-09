mindmaps.plugins["search"] = {
    startOrder: 1000,
    onUIInit: function () {
        var control='<form class="navbar-search pull-left"> \
        <input type="text" class="search-query" id="search-input" placeholder="Search"> \
            </form>'


        function search() {
            var text = new RegExp($("#search-input").val())
            var matched = _(mindmaps.ui.mindmapModel.getMindMap().nodes.nodes).filter(function (v) {
                return text.test(v.text.caption)
            })
            mindmaps.plugins["style"].highlight(matched)
        }
        //TODO is this too expensive?
        mindmaps.ui.eventBus.subscribe(mindmaps.Event.NODE_SELECTED,search);
        mindmaps.ui.eventBus.subscribe(mindmaps.Event.NODE_CREATED,search);
        mindmaps.ui.eventBus.subscribe(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED,search);

        var $control=$(control)
        var $text = $("#search-input",$control).keyup(function () {
            $(this).change()
        }).change(search)
        //var $div = $('<div>').text('Search').append($('<i>').addClass('icon-search')).append($text)

        //mindmaps.ui.toolbarView.alignLeft($div)
        $('.navbar-inner').append($control)
    }
}