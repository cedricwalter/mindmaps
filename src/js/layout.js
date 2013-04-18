// initialize the controls
function initDrawPanel(view){


    $(".delete-tool").click(function () {
        clearDrawing();
    });

    $(".pencil-tool").click(function () {
        setBrush("pencil");
        $(".tool-button").removeClass("selected");
        $(this).addClass("selected");
    });


    $(".eraser-tool").click(function () {
        setBrush("eraser");
        $(".tool-button").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".brush-color").colorPicker({pickerDefault:'000',colors:['000','#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd' ,'#8c564b' ,'#e377c2', '#7f7f7f', '#bcbd22', '#17becf']});
    $(".brush-color").change(function(){
        //console.log($(this).val())
        currentColour=$(this).val()
        currentBrush.setColour(currentColour);
    })
}