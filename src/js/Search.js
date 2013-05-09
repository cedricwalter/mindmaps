mindmaps.plugins["search"] = {
    startOrder: 1000,
    onUIInit: function () {


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


        var $text = $('<input>').attr({'type': 'text', 'id': 'search-input'}).keyup(function () {
            $(this).change()
        }).change(search)
        var $div = $('<div>').text('Search').append($('<i>').addClass('icon-search')).append($text)

        mindmaps.ui.toolbarView.alignLeft($div)
    }
}