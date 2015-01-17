window.onload = function(){

/*

todo:

debug general block collision in checkCollisions() function

z to jump...

if

*/
//color palette

/*
rgb(255, 168, 71)
rgb(255, 102, 71)
rgb(153, 102, 122)
rgb(153, 204, 173)




*/
var colors = [
             {r:153,g:102,b:122,o:1},
    {r:255,g:168,b:71,o:.8},
                {r:255,g:102,b:71,o:1},
              {r:153,g:204,b:173,o:1}
             ];

var canvas = document.getElementById('c');
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var s = Math.min(w,h);
var framerate = 60;
var color = 'rgba(170,190,230,1)';
var frame = 0;

var ctx = canvas.getContext('2d');
var MIN_PHYSICS_TICK = 1000 / 60;

//player variables
var BOUNCE_DAMPENING = 0.2;
var OLD_HEIGHT = s/20;
var HEIGHT = s/20;
var WIDTH = s/50;
var charging = false;
var moving_up = false;
var moving_down = false;
var amount = 0;
var MAX_JUMP = .9;
var up_amt = 0;
var down_amt = 0;
var max_hor_vel = .003;



var init_colors = Math.random()*2*Math.PI;

var grav_dir = 0;

var max_v = .4;

var position = {
    x: w/8,
    y: h/2
};
var velocity = {
    x: 0,
    y: 0
};
var acceleration = {
    x: 0,
    y: .0003
};


//init level blocks
bsize = s/40;
blocks = [];
var xNum = 0;
for (var i = 0 ; i < w - bsize ; i+=bsize){
    xNum++;
    var yNum = 0;
    for (var j = 0 ; j < h - bsize ; j+=bsize){
        yNum++;
        blocks.push({x:i,y:j,t:0,xi:xNum,yi:yNum});
    }
}
var diffX = (w - xNum*bsize)/2; //center the array
var diffY = (h - yNum*bsize)/2;
for (var i = 0; i < blocks.length ; i++){
    blocks[i].x += diffX;
    blocks[i].y += diffY;
}


for (var i = 0; i < blocks.length ; i++){

    //add some random blocks
    if (Math.random() < .01 && (i+yNum < blocks.length)){
       blocks[i].t = 1;
        blocks[i+yNum].t = 1;
    }

    //make floor
    if (blocks[i].yi == yNum) blocks[i].t = 1;
}

var floor_pos = Math.round(blocks[blocks.length-1].y);





var e1 = {p:{x:w/2,y:h/2},v:{x:-.1,y:0}};

var lastTick = Date.now();

/** Update position and velocity */
var doPhysics = function (delta) {
    // CALC NEW VELOCITIES
    velocity.y = velocity.y + acceleration.y*grav_dir * delta;
    velocity.x = velocity.x + acceleration.x * delta;

    // CALC NEW POSITIONS
    position.y += velocity.y * delta;
    position.x += velocity.x * delta;

    if (position.y > h/2){
        grav_dir = 1;
    } else if (position.y < h/2){
        grav_dir = -1;
    } else{
        grav_dir = 0;
    }

    if (moving_up && position.y >= h/2 && velocity.y > max_v*-1){
        velocity.y += -.02;
    }
    if (moving_down && position.y <= h/2 && velocity.y < max_v){
        velocity.y += .02;
    }



};





var checkCollisions = function () {

    //basic ground collision placeholder

    /*
    if (position.y > floor_pos) {
        position.y = floor_pos;
        velocity.y = -1 * BOUNCE_DAMPENING * velocity.y;
        jumping=false;
    } */


};

var move = function () {

    /*
    if (moving_up){
          up_amt = up_amt + (up_amt/max_hor_vel)*.1 + .05;
            if (up_amt > max_hor_vel){
                up_amt = max_hor_vel;
            }

        } else {
            up_amt = 0;
        };

        if (moving_down){
          down_amt = down_amt + (down_amt/max_hor_vel)*.1 + .05;
            if (down_amt > max_hor_vel){
                down_amt = max_hor_vel;
            }

        } else {
            down_amt = 0;
        };
    velocity.y=up_amt*-1+down_amt;
    */







}

var enemyAI = function (delta) {

    e1.p.x += e1.v.x * delta;
    e1.p.y += e1.v.y * delta;

    if (e1.p.x < 0){
         e1.p.x = 0;
         e1.v.x *= -1;
    }
    if (e1.p.x > w){
        e1.p.x = w;
        e1.v.x *= -1;
    }

}

var colorChanges = function () {

    //background rotate

    colors[0].r = Math.round(Math.cos(frame*.0007 + init_colors)*70+20*amount);
    colors[0].g = Math.round(Math.sin(frame*.0013 + init_colors)*70+20*amount);
     colors[0].b = Math.round(Math.sin(frame*.0019 + init_colors)*60+30*amount);


    //tempC = rgbToHsl(colors[0].r,colors[0].g,color[0].b);
    //tempC[1]++;
    //console.log(tempC);
    //var tempC2 = hslToRgb(tempC[0],tempC[1],tempC[2]);
    /*colors[0].r = tempC2[0];
    /*colors[0].g = tempC[1];
    colors[0].b = tempC[2];
    */

}


var draw = function () {

    //clear
    ctx.beginPath();
    ctx.rect(0, 0, w, h); ctx.fillStyle = toRGB(colors[0]); ctx.fill();

    //middle line
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.strokeStyle = toRGB({r:255,g:255,b:255,o:.3});
    ctx.stroke();

    //player
    ctx.beginPath();
    ctx.arc(position.x, position.y,10,0,2*Math.PI);
    ctx.fillStyle = toRGB(colors[1]);
    ctx.fill();

    //enemy
    ctx.beginPath();
    ctx.arc(e1.p.x,e1.p.y,10,0,2*Math.PI);
    ctx.fillStyle = toRGB(colors[3])
    ctx.fill();

    // score
    ctx.font="10pt Helvetica";
    var score = (1 + parseInt(frame/120)).toString();
    ctx.fillStyle = toRGB({r:255,g:255,b:255,o:.3});
    ctx.fillText(score,w/16,h/16);
};



setInterval(function () {
    frame++;
    var now = Date.now();
    var delta = now - lastTick;

    //at physics rate (multiple ticks per frame)
    var numTicks = Math.ceil(delta / MIN_PHYSICS_TICK);
    for (var i = 0; i < numTicks; i++) {
         move();
         enemyAI(delta / numTicks);
        doPhysics(delta / numTicks);
        checkCollisions();
    }

    //at frame rate
    colorChanges();
    draw();

    lastTick = now;
}, 1000 / framerate);


//keyboard input
$("body").keydown(function (e) {
    var i = e.which;
    if (i == 38 || i == 90) moving_up=true;
    if (i == 40 || i == 191) moving_down=true;
});

$("body").keyup(function (e) {
    var i = e.which;
    if (i == 38 || i == 90){ moving_up = false; }
    if (i == 40 || i == 191){ moving_down = false; }
});


function toRGB(c){
   return "rgba("+c.r+","+c.g+","+c.b+","+c.o+");";
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    var arr = [h, s, l]
    return arr;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}


}