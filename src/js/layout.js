// initialize the controls
function initDrawPanel(view){

    //$('#right-panel').hide();
    //$("#right-button").click(function(){$('#right-panel').toggle();});


    //window.savingCallback=savingCallback;

    // $("#save-button").click(function(){
    //     window.savingCallback(drawingCanvas.get(0).toDataURL());
    //     view.panel.hide();

    // });
   

    // set up colour picker
    var strokeColourPicker = $("#stroke-colour-picker");
    strokeColourPicker.ColorPicker({
        flat: true,
        color: '#000',
        onChange: function (hsb, hex, rgb) {
            var hexColour = "#" + hex;
            setColour(hexColour);
        },
        onSubmit: function (hsb, hex, rgb) {
            var hexColour = "#" + hex;
            setColour(hexColour);
        }
    });

    $("#delete-tool").click(function () {
        clearDrawing();
    });

    $("#pencil-tool").click(function () {
        setBrush("pencil");
        $(".tool-button").removeClass("selected");
        $(this).parent().addClass("selected");
    });

    $("#spray-tool").click(function () {
        setBrush("spray");
        $(".tool-button").removeClass("selected");
        $(this).parent().addClass("selected");
    });

    $("#paint-tool").click(function () {
        setBrush("paint");
        $(".tool-button").removeClass("selected");
        $(this).parent().addClass("selected");
    });

    $("#undo-tool").click(function () {
        undo();
    });

    $("#eraser-tool").click(function () {
        setBrush("eraser");
        $(".tool-button").removeClass("selected");
        $(this).parent().addClass("selected");
    });

    $("#colour-picker-tool").click(function () {
        setBrush("colour-picker");
        $(".tool-button").removeClass("selected");
        $(this).parent().addClass("selected");
    });
}