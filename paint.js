// Testing

(function() {

    // declarations
    var mousePressed = false;
    var lastX, lastY;
    var ctx, container, canvas, canvaso, context, currentTool, color_picker, toolSize;
    var cPushArray = new Array();
    var cStep = -1;

    // functions
    function InitThis() {
        toolSize = 1;
        currentTool = "pencil";
        canvaso = document.getElementById('myCanvas');
        ctx = canvaso.getContext("2d");
        ctx.fillStyle = "white";
        cPush();
        canvas = document.getElementById('imageTemp');
        context = canvas.getContext('2d');
        context.fillStyle = "white";

        color_picker = document.getElementById('color_picker').getContext("2d");

        var img = new Image();
        img.src = 'colormap.jpg';
        $(img).load(function() {
            color_picker.drawImage(img, 0, 0);
        });

        $('#color_picker').click(function(e) {
            // getting user coordinates
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop;

            // getting image data and RGB values
            var img_data = color_picker.getImageData(x, y, 1, 1).data;
            var R = img_data[0];
            var G = img_data[1];
            var B = img_data[2];
            var rgb = R + ',' + G + ',' + B;
            // convert RGB to HEX
            var hex = rgbToHex(R, G, B);
            // making the color the value of the input
            $('#rgb input').val(rgb);
            $('#hex input').val('#' + hex);
            $('#current_color').text($('#hex input').val());
        });

        $('#selColor').on('change', function() {
            $('#current_color').text($('#selColor').val());
        });

        $('#imageTemp').mousedown(function(e) {
            mousePressed = true;
            lastX = e.pageX - $(this).offset().left;
            lastY = e.pageY - $(this).offset().top;

            if (currentTool == "spray") {
                context.moveTo(lastX, lastY);
            } else if (currentTool == "fill") {
                context.drawImage(canvaso, 0, 0);
                //clearArea();
                paintFill(lastX, lastY);
            }

        });

        $('#imageTemp').mousemove(function(e) {
            if (currentTool == "pencil") {
                if (mousePressed) {
                    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
                }
            } else if (currentTool == "line") {
                if (mousePressed) {
                    lineDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
                }
            } else if (currentTool == "rectangle") {
                rectangleDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
            } else if (currentTool == "eraser") {
                eraserDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
            } else if (currentTool == "spray") {
                sprayDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
            } else if (currentTool == "oval") {
                ovalDraw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, mousePressed);
            }


        });

        $('#imageTemp').mouseup(function(e) {
            //console.log("pencil");
            if (currentTool == "eraser") {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            mousePressed = false;
            console.log($('#myCanvas').position());
            console.log($('#imageTemp').position());
            img_update();
        });


        $('#clear_button').click(function() {
            clearArea();
        });

        $('#pencil_tool').click(function() {
            changeTool("pencil");
        });

        $('#line_tool').click(function() {
            changeTool("line");
        });

        $('#rectangle_tool').click(function() {
            changeTool("rectangle");
        });

        $('#eraser_tool').click(function() {
            changeTool("eraser");
        });

        $('#spray_tool').click(function() {
            changeTool("spray");
        });

        $('#oval_tool').click(function() {
            changeTool("oval");
        });

        $('#fill_tool').click(function() {
            changeTool("fill");
        });

        $('#increase_tool').click(function() {
            increaseSize();
        });

        $('#decrease_tool').click(function() {
            decreaseSize();
        });

        $('#redo_tool').click(function() {
            cRedo();
        });

        $('#undo_tool').click(function() {
            cUndo();
        });

        $("img").hover(function() {
            $(this).height(function(i, h) {
                    return h * 1.3;
                })
                .width(function(i, w) {
                    return w * 1.3;
                });
        }, function() {
            $(this).height(function(i, h) {
                return h / 1.3;
            }).width(function(i, w) {
                return w / 1.3;
            })
        });


        document.getElementById('btn-download').addEventListener('click', function() {
            var fileName = $('#file_name').val();
            if (fileName == "") {
                fileName == "download.png";
            } else {
                fileName.concat(".png");
            }
            downloadCanvas(this, 'myCanvas', fileName); // <- this can be a dynamic name
        }, false);


    }

    function downloadCanvas(link, canvasId, filename) {
        link.href = document.getElementById(canvasId).toDataURL();
        link.download = filename;
    }

    function Draw(x, y, isDown) {
        console.log("adas");
        if (isDown && currentTool == "pencil") {

            context.beginPath();
            context.strokeStyle = $('#current_color').text();
            context.lineWidth = toolSize;
            context.lineJoin = "round";
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
            lastX = x;
            lastY = y;

        }
        //lastX = x; lastY = y; // this is killing the other functions
    }

    function lineDraw(x, y, isDown) {
        if (isDown && currentTool == "line") {
            context.clearRect(0, 0, canvas.width, canvas.height); // create a new layer so that previous drawing is not deleted
            context.strokeStyle = $('#current_color').text();
            context.lineWidth = toolSize;
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();


        }

    }



    function rectangleDraw(x, y, isDown) {
        if (isDown && currentTool == "rectangle") {
            context.strokeStyle = $('#current_color').text();
            context.lineWidth = toolSize;
            var x = Math.min(x, lastX),
                y = Math.min(y, lastY),
                w = Math.abs(x - lastX),
                h = Math.abs(y - lastY);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) {
                return;
            }
            context.strokeRect(x, y, w, h);
        }
    }



    // implement a square and then fill it with white spacing
    // need to update image after each
    function eraserDraw(x, y, isDown) {
        if (isDown && currentTool == "eraser") {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "#000000";
            //console.log(context.strokeStyle);
            var currentSize = 20;
            currentSize += (toolSize * 2);
            context.beginPath();
            context.rect(x, y, currentSize, currentSize);
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, currentSize, currentSize);
            context.stroke();
            context.closePath();

        }

    }

    function sprayDraw(x, y, isDown) {
        if (isDown && currentTool == "spray") {
            context.fillStyle = $('#current_color').text();
            context.lineWidth = toolSize;
            context.rect(x, y, 1, 1);
            context.beginPath();

            for (var i = 20; i--;) {
                context.rect(x + Math.random() * 20 - 10,
                    y + Math.random() * 20 - 10, 1, 1);
                context.fill();
            }
            context.closePath();
        }

    }

    function ovalDraw(x, y, isDown) {
        if (currentTool == "oval" && isDown) {
            context.strokeStyle = $('#current_color').text();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(lastX, lastY + (y - lastY) / 2);
            context.bezierCurveTo(lastX, lastY, x, lastY, x, lastY + (y - lastY) / 2);
            context.bezierCurveTo(x, y, lastX, y, lastX, lastY + (y - lastY) / 2);
            context.closePath();
            context.stroke();
        }

    }


    function paintFill(e_x, e_y) {
        var curColor = {
            r: 255,
            g: 255,
            b: 0
        };
        var selectedColor = $('#current_color').text();
        if (selectedColor != "") {
            if (selectedColor[0] != '#') {
                selectedColor = colorNameToHex(selectedColor)
            }
            setColor(selectedColor);
        }
        var width, height;
        width = canvas.width;
        height = canvas.height;
        var drawingBoundTop = 0;
        var imageData = context.getImageData(0, 0, width, height);
        var tempData = context.getImageData(e_x, e_y, 1, 1);
        var startColor = tempData.data;
        //console.log(imageData);
        pixelStack = [
            [e_x, e_y]
        ];
        //console.log(e_x);
        //console.log(e_y);
        //newPos = pixelStack.pop();
        //x = newPos[0];
        //y = newPos[1];
        //console.log(x);
        //console.log(y);
        var cnt = 0;
        //console.log("asd");

        while (pixelStack.length) {
            //if(cnt++ > 500) return;
            console.log("lol");
            var newPos, x, y, pixelPos, reachLeft, reachRight;
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];
            //console.log(x);
            //console.log(y);
            pixelPos = (y * width + x) * 4;
            //console.log(matchStartColor(pixelPos));
            while (y-- >= drawingBoundTop && matchStartColor(pixelPos)) {
                pixelPos -= width * 4;
                //console.log(pixelPos, width);
            }
            pixelPos += width * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            //console.log(pixelPos);
            while (y++ < height - 1 && matchStartColor(pixelPos)) {
                colorPixel(pixelPos);

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                            //console.log(x);
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < width - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += width * 4;

            }
            cnt++;
        }

        context.putImageData(imageData, 0, 0);

        function matchStartColor(pixelPos) {
            var r = imageData.data[pixelPos];
            var g = imageData.data[pixelPos + 1];
            var b = imageData.data[pixelPos + 2];

            return (r === startColor[0] && g === startColor[1] && b === startColor[2]);
        }

        function colorPixel(pixelPos) {
            imageData.data[pixelPos] = curColor.r;
            imageData.data[pixelPos + 1] = curColor.g;
            imageData.data[pixelPos + 2] = curColor.b;
            imageData.data[pixelPos + 3] = 255;
        }

        function setColor(value) {
            var color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
            curColor.r = parseInt(color[1], 16);
            curColor.g = parseInt(color[2], 16);
            curColor.b = parseInt(color[3], 16);
        }

    }





    function clearArea() {
        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    }

    function img_update() {
        //console.log("caller is " + arguments.callee.caller.toString());
        ctx.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        cPush();
    }

    function cPush() {
        //console.log("caller is " + arguments.callee.caller.toString());
        cStep++;
        if (cStep < cPushArray.length) {
            cPushArray.length = cStep;
        }
        cPushArray.push(document.getElementById('myCanvas').toDataURL());
    }

    function cUndo() {
        if (cStep > 0) {
            cStep--;
            clearArea();
            var canvasPic = new Image();
            canvasPic.onload = function() {
                ctx.drawImage(canvasPic, 0, 0);
            }
            canvasPic.src = cPushArray[cStep];
        }
    }

    function cRedo() {
        if (cStep < cPushArray.length - 1) {
            cStep++;
            clearArea();
            var canvasPic = new Image();
            canvasPic.onload = function() {
                ctx.drawImage(canvasPic, 0, 0);
            }
            canvasPic.src = cPushArray[cStep];
        }
    }

    function changeTool(tool) {
        console.log(tool);
        currentTool = tool;
    }

    function rgbToHex(R, G, B) {
        return toHex(R) + toHex(G) + toHex(B)
    }

    function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    }

    function increaseSize() {
        if (toolSize == 15) {
            alert("You have reached maximum tool size.");
            return;
        } else {
            toolSize += 2;
            $('#tool_size').text("The current tool size is " + toolSize + "px");
        }

    }

    function decreaseSize() {
        if (toolSize == 1) {
            alert("You have reached the minimum tool size.");
            return;
        } else {
            toolSize -= 2;
            $('#tool_size').text("The current tool size is " + toolSize + "px");
        }
    }

    function colorNameToHex(color) {
        var colors = {
            "aliceblue": "#f0f8ff",
            "antiquewhite": "#faebd7",
            "aqua": "#00ffff",
            "aquamarine": "#7fffd4",
            "azure": "#f0ffff",
            "beige": "#f5f5dc",
            "bisque": "#ffe4c4",
            "black": "#000000",
            "blanchedalmond": "#ffebcd",
            "blue": "#0000ff",
            "blueviolet": "#8a2be2",
            "brown": "#a52a2a",
            "burlywood": "#deb887",
            "cadetblue": "#5f9ea0",
            "chartreuse": "#7fff00",
            "chocolate": "#d2691e",
            "coral": "#ff7f50",
            "cornflowerblue": "#6495ed",
            "cornsilk": "#fff8dc",
            "crimson": "#dc143c",
            "cyan": "#00ffff",
            "darkblue": "#00008b",
            "darkcyan": "#008b8b",
            "darkgoldenrod": "#b8860b",
            "darkgray": "#a9a9a9",
            "darkgreen": "#006400",
            "darkkhaki": "#bdb76b",
            "darkmagenta": "#8b008b",
            "darkolivegreen": "#556b2f",
            "darkorange": "#ff8c00",
            "darkorchid": "#9932cc",
            "darkred": "#8b0000",
            "darksalmon": "#e9967a",
            "darkseagreen": "#8fbc8f",
            "darkslateblue": "#483d8b",
            "darkslategray": "#2f4f4f",
            "darkturquoise": "#00ced1",
            "darkviolet": "#9400d3",
            "deeppink": "#ff1493",
            "deepskyblue": "#00bfff",
            "dimgray": "#696969",
            "dodgerblue": "#1e90ff",
            "firebrick": "#b22222",
            "floralwhite": "#fffaf0",
            "forestgreen": "#228b22",
            "fuchsia": "#ff00ff",
            "gainsboro": "#dcdcdc",
            "ghostwhite": "#f8f8ff",
            "gold": "#ffd700",
            "goldenrod": "#daa520",
            "gray": "#808080",
            "green": "#008000",
            "greenyellow": "#adff2f",
            "honeydew": "#f0fff0",
            "hotpink": "#ff69b4",
            "indianred ": "#cd5c5c",
            "indigo": "#4b0082",
            "ivory": "#fffff0",
            "khaki": "#f0e68c",
            "lavender": "#e6e6fa",
            "lavenderblush": "#fff0f5",
            "lawngreen": "#7cfc00",
            "lemonchiffon": "#fffacd",
            "lightblue": "#add8e6",
            "lightcoral": "#f08080",
            "lightcyan": "#e0ffff",
            "lightgoldenrodyellow": "#fafad2",
            "lightgrey": "#d3d3d3",
            "lightgreen": "#90ee90",
            "lightpink": "#ffb6c1",
            "lightsalmon": "#ffa07a",
            "lightseagreen": "#20b2aa",
            "lightskyblue": "#87cefa",
            "lightslategray": "#778899",
            "lightsteelblue": "#b0c4de",
            "lightyellow": "#ffffe0",
            "lime": "#00ff00",
            "limegreen": "#32cd32",
            "linen": "#faf0e6",
            "magenta": "#ff00ff",
            "maroon": "#800000",
            "mediumaquamarine": "#66cdaa",
            "mediumblue": "#0000cd",
            "mediumorchid": "#ba55d3",
            "mediumpurple": "#9370d8",
            "mediumseagreen": "#3cb371",
            "mediumslateblue": "#7b68ee",
            "mediumspringgreen": "#00fa9a",
            "mediumturquoise": "#48d1cc",
            "mediumvioletred": "#c71585",
            "midnightblue": "#191970",
            "mintcream": "#f5fffa",
            "mistyrose": "#ffe4e1",
            "moccasin": "#ffe4b5",
            "navajowhite": "#ffdead",
            "navy": "#000080",
            "oldlace": "#fdf5e6",
            "olive": "#808000",
            "olivedrab": "#6b8e23",
            "orange": "#ffa500",
            "orangered": "#ff4500",
            "orchid": "#da70d6",
            "palegoldenrod": "#eee8aa",
            "palegreen": "#98fb98",
            "paleturquoise": "#afeeee",
            "palevioletred": "#d87093",
            "papayawhip": "#ffefd5",
            "peachpuff": "#ffdab9",
            "peru": "#cd853f",
            "pink": "#ffc0cb",
            "plum": "#dda0dd",
            "powderblue": "#b0e0e6",
            "purple": "#800080",
            "red": "#ff0000",
            "rosybrown": "#bc8f8f",
            "royalblue": "#4169e1",
            "saddlebrown": "#8b4513",
            "salmon": "#fa8072",
            "sandybrown": "#f4a460",
            "seagreen": "#2e8b57",
            "seashell": "#fff5ee",
            "sienna": "#a0522d",
            "silver": "#c0c0c0",
            "skyblue": "#87ceeb",
            "slateblue": "#6a5acd",
            "slategray": "#708090",
            "snow": "#fffafa",
            "springgreen": "#00ff7f",
            "steelblue": "#4682b4",
            "tan": "#d2b48c",
            "teal": "#008080",
            "thistle": "#d8bfd8",
            "tomato": "#ff6347",
            "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "wheat": "#f5deb3",
            "white": "#ffffff",
            "whitesmoke": "#f5f5f5",
            "yellow": "#ffff00",
            "yellowgreen": "#9acd32"
        };

        if (typeof colors[color.toLowerCase()] != 'undefined')
            return colors[color.toLowerCase()];

        return false;
    }

    // add page load listener
    $(InitThis);

})();