var textTypes = 
{
    CONDITION: 1,
    STORY: 2
};

var dragCanvas = {canvas: null, x: 0, y: 0};
var ij = 0;

$(function()
{
    var el = {id: 0, x: 20, y: 20, type: textTypes.STORY, name: "tes1t"};
    el = {id: 1, x: 20, y: 280, type: textTypes.CONDITION, name: "tes2t", successor: el};
    el = {id: 2, x: 420, y: 20, type: textTypes.CONDITION, name: "tes3t"};
    el = $.post("test.php",
                {
                    action: "load"
                },
                function(data,status){
//                    data = '{"age":"23", "name" : "abc"}';
                    var e = JSON.parse(data);
                    draw(e);
                });
});


function draw(el)
{
    el.id = ij;
    ++ij;
    $("#main").append("<canvas id='canvas" + el.id + "' style='position: absolute; z-index: " + el.id + ";'></canvas>"); 
    var c = $("#canvas" + el.id)[0];
    //$('#canvas' + el.id).on('click', function(){alert(el.id);});
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight;
    var ctx = c.getContext("2d");
    var d = $("#papitems")[0];

    var k = JSON.stringify(el);
    var e = $("#book");
    var padding = 
    {
        LEFT:  18,
        RIGHT: 18,
        TOP:   18,
        BOTTOM:18
    }

    ctx.font = d.style.font;
    ctx.font = "1em arial";
    fontSize = parseInt(ctx.font);
    var metrics = ctx.measureText(el.name);
    var width = metrics.width*2 + padding.LEFT + padding.RIGHT;
    var height = fontSize + padding.TOP + padding.BOTTOM;
    c.width = width + 10;
    c.height = (el.type == textTypes.CONDITION) ? 10 + height * 1.2 : 10 + height;
    c.style.width=c.width + 10;
    c.style.height = c.height + 10;
    c.style.left = el.x;
    c.style.top = el.y;
    el.x = 5;
    el.y = 5;
    ctx = c.getContext("2d");
    ctx.font = "1em arial";


    $(document).mouseup(function(){
        dragCanvas.canvas = null;
    }).mousemove(function(e) {
        if(dragCanvas.canvas != null)
        {
            dragCanvas.canvas.style.left = e.pageX - dragCanvas.x; 
            dragCanvas.canvas.style.top = e.pageY - dragCanvas.y;
        }

    })
    $("#canvas" + el.id)
        .mousedown(function(e) {
            //TODO make this element the topmost element
            dragCanvas.canvas = $(this)[0];
            dragCanvas.x = e.pageX - parseInt($(this)[0].style.left);
            dragCanvas.y = e.pageY - parseInt($(this)[0].style.top);
        })

    .mouseup(function() {
        dragCanvas.canvas = null;
    }).dblclick(function()
    {
        $.post("test.php",
                {
                    action: "load",
                },
                function(data,status){
                    draw(JSON.parse(data));
                });
    });

    ctx.fillStyle="rgba(0, 0, 200, 0)";
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0, 1)';
    ctx.fillStyle="rgba(0, 0, 0, 1)";
    if(el.type == textTypes.CONDITION)
    {
        height *= 1.20;
        ctx.moveTo(el.x, el.y + height/2);
        ctx.lineTo(el.x + width/2, el.y);
        ctx.lineTo(el.x + width, el.y + height/2);
        ctx.lineTo(el.x + width/2, el.y + height);
        ctx.lineTo(el.x, el.y + height/2);
        ctx.fillText(el.name, el.x + metrics.width / 2 + padding.LEFT, el.y + height/2 + fontSize/2 - 0.2*fontSize);
    }
    else if(el.type == textTypes.STORY)
    {
        ctx.rect(el.x, el.y, width, height);
        ctx.fillText(el.name, el.x + metrics.width/2 + padding.LEFT, el.y + height - 0.20*fontSize - padding.BOTTOM);
    }
    ctx.stroke();
}

