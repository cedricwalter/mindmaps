// define a pencil brush for drawing free-hand lines
var PencilBrush = new Class({
    initialize: function (lineWidth, drawingCxt,canvas,overlayCanvas) {
        this.lineWidth = lineWidth;
        var self=this
        var over_ctx = overlayCanvas.getContext('2d');
        drawingCxt.lineWidth = this.lineWidth;
        over_ctx.lineWidth=this.lineWidth

        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(cursors/pencil_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
            drawingCxt.fillStyle = drawingCxt.strokeStyle = colour;
            over_ctx.fillStyle=over_ctx.strokeStyle=colour;
            drawingCxt.lineWidth = this.lineWidth;
            over_ctx.lineWidth=this.lineWidth

            drawingCxt.lineCap = "round";
            drawingCxt.lineJoin = "round";
        };

        this.setSize = function (size) {
            this.lineWidth = size;
            drawingCxt.lineWidth = this.lineWidth;
            over_ctx.lineWidth=this.lineWidth

        };

        // draws a line to the x and y coordinates of the specified position
        function drawLine(position) {
            drawingCxt.lineTo(position.X, position.Y);
            drawingCxt.stroke();
        }

        function onPaint() {
            //TODO why this set? not cool.
            over_ctx.lineWidth=self.lineWidth
            // Saving all the points in an array
            //ppts.push({x: mouse.x, y: mouse.y});

            if (ppts.length < 3) {
                var b = ppts[0];
                over_ctx.beginPath();
                //ctx.moveTo(b.x, b.y);
                //ctx.lineTo(b.x+50, b.y+50);
                over_ctx.arc(b.x, b.y, over_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
                over_ctx.fill();
                over_ctx.closePath();

                return;
            }

            // Tmp canvas is always cleared up before drawing.
            over_ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

            over_ctx.beginPath();
            over_ctx.moveTo(ppts[0].x, ppts[0].y);

            for (var i = 1; i < ppts.length - 2; i++) {
                var c = (ppts[i].x + ppts[i + 1].x) / 2;
                var d = (ppts[i].y + ppts[i + 1].y) / 2;

                over_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
            }

            // For the last 2 points
            over_ctx.quadraticCurveTo(
                ppts[i].x,
                ppts[i].y,
                ppts[i + 1].x,
                ppts[i + 1].y
            );

            //over_ctx.lineWidth=this.lineWidth

            over_ctx.stroke();

        };

        // Creating a tmp canvas



        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        // Pencil Points
        var ppts = [];

        /* Drawing on Paint App */
        //over_ctx.lineWidth = 5;
        over_ctx.lineJoin = 'round';
        over_ctx.lineCap = 'round';
        over_ctx.strokeStyle = 'blue';
        over_ctx.fillStyle = 'blue';

        this.startDrawing = function (position) {
            undoBackup();
        };

        this.draw = function (position) {
            ppts.push({x: position.X, y: position.Y});
            onPaint();
        };

        this.finishDrawing = function (position) {

            // Writing down to real canvas now
            drawingCxt.drawImage(overlayCanvas, 0, 0);
            // Clearing tmp canvas
            over_ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

            // Emptying up Pencil Points
            ppts = [];
        };
    }
});



// define an eraser brush which clears part of the canvas with rectangles
var EraserBrush = new Class({
    Extends: PencilBrush,
    initialize: function (lineWidth, drawingCxt,canvas,overlayCanvas) {
        // invoke the base constructor
        this.parent(lineWidth, drawingCxt,canvas,overlayCanvas);
        var over_ctx = overlayCanvas.getContext('2d');

        // get the cursor associated with the pencil brush
        this.getCursor = function () {
            return "url(cursors/eraser_cursor.cur), crosshair";
        };

        this.setColour = function (colour) {
            drawingCxt.fillStyle = drawingCxt.strokeStyle = backgroundColour;
            over_ctx.fillStyle=over_ctx.strokeStyle=backgroundColour;

            drawingCxt.lineWidth = this.lineWidth;
            drawingCxt.lineCap = "round";
            drawingCxt.lineJoin = "round";
        };
    }
});

