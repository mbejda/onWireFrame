$(document).ready(function () {

    var canvas = new fabric.Canvas('c');
    canvas.setWidth($('.sub-container').width());

    grid = 25;

    // grid
    for (var i = 0; i < (canvas.width / grid); i++) {
        canvas.add(new fabric.Line([i * grid, 0, i * grid, canvas.width], {stroke: '#ccc', selectable: false}));
        canvas.add(new fabric.Line([0, i * grid, canvas.width, i * grid], {stroke: '#ccc', selectable: false}));
    }


    var imgObj = new Image();
    imgObj.src = "/assets/images/header.svg"
    imgObj.onload = function () {
        var image = new fabric.Image(imgObj);
        image.set({
            top: 0,
            angle: 0,
            padding: 10,
            cornersize: 10,
            height: 75,
            width: 950,
            hasBorders: false,
            hasControls: false,
            hasRotatingPoint: false,
            selectable: false
        });

        canvas.add(image);
    };


    // snap at 10% of the size of the cell
    canvas.on('object:moving', function (ev) {
        var w = ev.target.width * ev.target.scaleX,
            h = ev.target.height * ev.target.scaleY,
            snap = {   // Closest snapping points
                top: Math.round(ev.target.top / grid) * grid,
                left: Math.round(ev.target.left / grid) * grid,
                bottom: Math.round((ev.target.top + h) / grid) * grid,
                right: Math.round((ev.target.left + w) / grid) * grid
            },
            threshold = grid * 0.1,
            dist = {   // Distance from snapping points
                top: Math.abs(snap.top - ev.target.top),
                left: Math.abs(snap.left - ev.target.left),
                bottom: Math.abs(snap.bottom - ev.target.top - h),
                right: Math.abs(snap.right - ev.target.left - w)
            };

        if (dist.bottom < dist.top) {
            if (dist.bottom > threshold)
                snap.top = ev.target.top; // don't snap
            else
                snap.top = snap.bottom - h;
        }
        else if (dist.top > threshold)
            snap.top = ev.target.top; // don't snap

        if (dist.right < dist.left) {
            if (dist.right > threshold)
                snap.left = ev.target.left; // don't snap
            else
                snap.left = snap.right - w;
        }
        else if (dist.left > threshold)
            snap.left = ev.target.left; // don't snap

        ev.target.set({
            top: snap.top,
            left: snap.left
        });
    });


    $("#addText").on('click', function () {
        canvas.add(new fabric.IText('Tap and Type', {
            fontFamily: 'arial black',
            left: 100,
            top: 100,
        }));
    });
    $("#save").on('click', function () {
        canvas.deactivateAll().renderAll();
        window.open(canvas.toDataURL('png'));
    });
    $(document).on('keydown', function (e) {
        if (e.keyCode == 8) {
            var obj = canvas.getActiveObject();

            if (obj) {
                canvas.remove(obj);
                e.preventDefault();
                e.stopPropagation();
                return false;

            }

        }
    });


    canvas.on('object:scaling', function (options) {
        var target = options.target,
            w = target.getWidth(),
            h = target.getHeight(),
            snap = {   // Closest snapping points
                top: Math.round(target.top / grid) * grid,
                left: Math.round(target.left / grid) * grid,
                bottom: Math.round((target.top + h) / grid) * grid,
                right: Math.round((target.left + w) / grid) * grid
            },
            threshold = grid * 0.2,
            dist = {   // Distance from snapping points
                top: Math.abs(snap.top - target.top),
                left: Math.abs(snap.left - target.left),
                bottom: Math.abs(snap.bottom - target.top - h),
                right: Math.abs(snap.right - target.left - w)
            },
            attrs = {
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                top: target.top,
                left: target.left
            };

        switch (target.__corner) {
            case 'tl':
                if (dist.left < dist.top && dist.left < threshold) {
                    attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                    attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                    attrs.top = target.top + (h - target.height * attrs.scaleY);
                    attrs.left = snap.left;
                }
                else if (dist.top < threshold) {
                    attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                    attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                    attrs.left = attrs.left + (w - target.width * attrs.scaleX);
                    attrs.top = snap.top;
                }
                break;
            case 'mt':
                if (dist.top < threshold) {
                    attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                    attrs.top = snap.top;
                }
                break;
            case 'tr':
                if (dist.right < dist.top && dist.right < threshold) {
                    attrs.scaleX = (snap.right - target.left) / target.width;
                    attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                    attrs.top = target.top + (h - target.height * attrs.scaleY);
                }
                else if (dist.top < threshold) {
                    attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                    attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                    attrs.top = snap.top;
                }
                break;
            case 'ml':
                if (dist.left < threshold) {
                    attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                    attrs.left = snap.left;
                }
                break;
            case 'mr':
                if (dist.right < threshold)
                    attrs.scaleX = (snap.right - target.left) / target.width;
                break;
            case 'bl':
                if (dist.left < dist.bottom && dist.left < threshold) {
                    attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                    attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                    attrs.left = snap.left;
                }
                else if (dist.bottom < threshold) {
                    attrs.scaleY = (snap.bottom - target.top) / target.height;
                    attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                    attrs.left = attrs.left + (w - target.width * attrs.scaleX);
                }
                break;
            case 'mb':
                if (dist.bottom < threshold)
                    attrs.scaleY = (snap.bottom - target.top) / target.height;
                break;
            case 'br':
                if (dist.right < dist.bottom && dist.right < threshold) {
                    attrs.scaleX = (snap.right - target.left) / target.width;
                    attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                }
                else if (dist.bottom < threshold) {
                    attrs.scaleY = (snap.bottom - target.top) / target.height;
                    attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                }
                break;
        }

        target.set(attrs);
    });


    var group = [];
    var addElement = function (path, cb) {

        fabric.Image.fromURL(path, function (image) {
            image.lockUniScaling = true

            canvas.add(image.scale(1).rotate(0).set({left: 100, top: 100}));

            canvas.renderAll();
            cb();


        });


    };


    var kits = {};
    /*
     Loads stencil kits image selection
     */
    var loadKit = function (name, cb) {
        $("#elements .element").remove();
        var elements = kits[name];
        for (var element in elements) {
            var file = elements[element];
            var img = "/kits/" + name + "/" + file;
            var element = $("<img style='width:100px;height:100px' src='" + img + "'/>");
            var li = $("<div class='element'></div>");

            element.on('click', function () {
                var self = $(this);
                var imagePath = self.attr('src');
                addElement(imagePath, function () {
                });

            });
            li.append(element);
            $("#elements").append(li);


        }
        cb();
    };

    /*
     Loads all stencil kits into memory
     */
    var loadKits = function (cb) {
        $.getJSON("/elements.json", function (response) {

            kits = response;
            cb(null, response)


        })
    };


    var options = {
        $menu: false,
        menuSelector: 'a',
        panelSelector: '>li',
        namespace: '.elements-container',
        onSnapStart: function () {
        },
        onSnapFinish: function () {
        },
        onActivate: function () {
        },
        directionThreshold: 50,
        slideSpeed: 200,
        delay: 0,
        easing: 'linear',
        offset: 0,
        navigation: {
            keys: {
                nextKey: false,
                prevKey: false,
            },
            buttons: {
                $nextButton: false,
                $prevButton: false,
            },
            wrapAround: false
        }
    };


    loadKits(function (error, kits) {
        var names = Object.keys(kits);
        names.forEach(function (name) {
            $("select#kits").append("<option value='" + name + "'>" + name + "</option>");
        });

        loadKit(names[0], function (error, loaded) {
            $("#kits").selectmenu({
                change: function (event, data) {
                    var valueSelected = data.item.value;
                    loadKit(valueSelected, function (error, loaded) {
                    });
                }
            });
        })


    });

});