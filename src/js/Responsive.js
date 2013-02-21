/**
 * Created with JetBrains WebStorm.
 * User: nielinjie
 * Date: 13-2-17
 * Time: PM4:24
 * To change this template use File | Settings | File Templates.
 */


mindmaps.Responsive = function () {
    //TODO use eventbus to publish responsive properties changed
    var self=this
    this.isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    this.isMiddleDevice= function() {
        var w= self.inEm($(window).width())
        //TODO w<117 and w>???
        return w<117;
    }
    this.font_size=parseFloat($("body").css("font-size"));
    this.inEm=function(px){
        return px/this.font_size;
    }


}

mindmaps.responsive=new mindmaps.Responsive();

