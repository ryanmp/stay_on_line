window.onload = function () {

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
        {r: 0, g: 0, b: 0, o: 1},
        {r: 0, g: 0, b: 0, o: 1},
        {r: 0, g: 0, b: 0, o: 1}
    ],
        canvas = document.getElementById('c'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        s = Math.min(w, h),
        framerate = 60,
        frame = 0,
        ctx = canvas.getContext('2d'),
        MIN_PHYSICS_TICK = 200 / 60,

        //player variables
        INPUT_SCALAR = 0.002,
        BOUNCE_DAMPENING = 0.7,
        AIR_DRAG = 0.001,
        OLD_HEIGHT = s / 20,
        HEIGHT = s / 20,
        WIDTH = s / 50,
        moving_up = false,
        moving_down = false,
        amount = 0,
        MAX_JUMP = 0.9,
        up_amt = 0,
        down_amt = 0,
        max_vel = 0.004,
        init_colors = Math.random() * 2 * Math.PI,
        score = "0",
        grav_dir = 0,
        max_v = 0.5,
        player = {
            p: {
                x: w / 8,
                y: h / 2
            },
            v: {
                x: 0,
                y: 0
            },
            a: {
                x: 0,
                y: 0.001
            },
            r: s/50
        },
        xNum = 0,
        enemies = [],
        num_enemies = 15,
        lastTick = Date.now(),

        /** Update position and velocity */
        doPhysics = function (delta) {
            // CALC NEW VELOCITIES
            player.v.y = player.v.y + player.a.y * grav_dir * delta - player.v.y * delta * AIR_DRAG;

            // CALC NEW POSITIONS
            player.p.y += player.v.y * delta;

            if (player.p.y > h / 2) {
                grav_dir = -1;
            } else if (player.p.y < h / 2) {
                grav_dir = 1;
            } else {
                grav_dir = 0;
            }

            if (moving_up && player.v.y > max_v * -1) {
                player.v.y += -1*delta*INPUT_SCALAR;
            }
            if (moving_down && player.v.y < max_v) {
                player.v.y += delta*INPUT_SCALAR;
            }
        },
        
        dead_ani_frame = 0,
        dead = false,



        checkCollisions = function () {

            //basic ground collision
            if (player.p.y >= h - player.r) {
                player.p.y = h - player.r - 1;
                player.v.y = -1 * BOUNCE_DAMPENING * player.v.y;
            }

            if (player.p.y <= 0 + player.r) {
                player.p.y = 0 + player.r + 1;
                player.v.y = -1 * BOUNCE_DAMPENING * player.v.y;
            } 
            
            //collide with enemies
            for (var i = 0; i < enemies.length; i++){                
                if (distance(enemies[i],player) < enemies[i].r + player.r){
                    dead = true;
                }  
            }
    
        },

        move = function () {

        };

    function init_enemies(){
        for (var i = 0 ; i < num_enemies; i++){
            enemies.push({
                p:{x:Math.random()*w*3+w,y:Math.random()*h},
                v:{x:-0.2,y:0},
                r:s*.02*(1+Math.random()*5),
                rv:0.001*(.5+Math.random()*50)
            }); 
        }
    } init_enemies();
    
    

        
    console.log(enemies.length); 
    var enemyAI = function (delta) {
        
        
        for (var i = 0; i < enemies.length; i++){ 
        
            enemies[i].p.x += enemies[i].v.x * delta;
            enemies[i].p.y += enemies[i].v.y * delta;
            
            if (enemies[i].r >= s*.02*6){
                enemies.rv *= -1;
                if (Math.random() > .9) enemies[i].rv = -0.001*(.1+Math.random()*50); // a chance to change pulse speed 
            }
            if (enemies[i].r <= s*.02){
                enemies.rv *= -1;
                if (Math.random() > .9) enemies[i].rv = 0.001*(.1+Math.random()*50);  
            }
            
            
            
            enemies[i].r += enemies[i].rv * delta;
            

            if (enemies[i].p.x < -w) {
                enemies[i].p.x = w*2;
                enemies[i].p.y = Math.random()*h;
                enemies[i].rv = 0.001*(.1+Math.random()*50);  
            }     
            
        } 
    };

    var colorChanges = function () {

        //background rotate

        colors[0].r = Math.round(Math.cos(frame * 0.0007 + init_colors) * 70 + 20 * amount);
        colors[0].g = Math.round(Math.sin(frame * 0.0013 + init_colors) * 70 + 20 * amount);
        colors[0].b = Math.round(Math.sin(frame * 0.0019 + init_colors) *  60 + 30 * amount);

        /*
        tempC = rgbToHsl(colors[0].r,colors[0].g,color[0].b);
        tempC[1]++;
        console.log(tempC);
        var tempC2 = hslToRgb(tempC[0],tempC[1],tempC[2]);
        colors[0].r = tempC2[0];
        colors[0].g = tempC[1];
        colors[0].b = tempC[2];
        */
        
        hue1 = Math.sin((init_colors+frame*.0005)%Math.PI/2);
        hue2 = (hue1 + 0.5)%1;
        
        colors[1] = hslToRgb(hue1,0.7,0.6);
        colors[2] = hslToRgb(hue2,0.7,0.6);
    };


    var draw = function () {

        if (dead){
            colors[1] = {r:255,g:255,b:255,o:1};
            colors[2] = {r:255,g:255,b:255,o:1}; 
        }
        
        //clear
        ctx.beginPath();
        ctx.rect(0, 0, w, h); ctx.fillStyle = toRGB(colors[0]); ctx.fill();

        //player
        ctx.beginPath();
        ctx.arc(player.p.x, player.p.y,player.r, 0,2*Math.PI);
        ctx.fillStyle = toRGB(colors[1]);
        ctx.fill();

        //enemies
        for (var i = 0; i < enemies.length; i++){ 
            ctx.beginPath();
            ctx.arc(enemies[i].p.x,enemies[i].p.y,enemies[i].r,0 , 2 * Math.PI);
            ctx.fillStyle = toRGB(colors[2]);
            ctx.fill();
        }
      
         //middle line
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w, h/2);
        ctx.strokeStyle = toRGB({r:255,g:255,b:255,o:.3});
        ctx.stroke();

       
        
        // score
        font_size = Math.round(s/15);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.font = font_size + "px Helvetica";
        ctx.fillStyle = toRGB({r: 255, g: 255, b: 255, o: 0.3});
        ctx.fillText(score, (s / 16) + 0, (s / 16) + font_size);
         
         //cover
        
        if (dead){
            
            var ghost_img = 200;
            
            // fade out
            ctx.beginPath();
            ctx.rect(0, 0, w, h); ctx.fillStyle = toRGB({r: 255, g: 255, b: 255, o: dead_ani_frame/60}); ctx.fill();
            
            // stroke
            ctx.beginPath();
            ctx.moveTo(0, h/2);
            ctx.lineTo(w, h/2);
            ctx.strokeStyle = toRGB({r:150,g:150,b:150,o:.1*(dead_ani_frame-60)/60});
            ctx.stroke();
            
            //player
            ctx.beginPath();
            ctx.arc(player.p.x, player.p.y,player.r, 0,2*Math.PI);
            ctx.fillStyle = toRGB({r:ghost_img-70,g:ghost_img,b:ghost_img,o:.1*(dead_ani_frame-60)/60});
            ctx.fill();
            
            //enemies
            for (var i = 0; i < enemies.length; i++){ 
                ctx.beginPath();
                ctx.arc(enemies[i].p.x,enemies[i].p.y,enemies[i].r,0 , 2 * Math.PI);
                ctx.fillStyle = toRGB({r:ghost_img,g:ghost_img,b:ghost_img,o:.1*(dead_ani_frame-60)/60});
                ctx.fill();
            }
            
            // messages
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            
            font_size = Math.round(s/6);
            ctx.font = font_size + "px Helvetica";
            ctx.fillStyle = toRGB({r: 0, g: 0, b: 0, o: dead_ani_frame/60});
            ctx.fillText("DEAD", w/2, h*(1/5) );
            
            font_size = Math.round(s/3);
            ctx.font = font_size + "px Helvetica";
            ctx.fillText(score, w/2, h/2 );
            
            
            font_size = Math.round(s/20);
            ctx.font = font_size + "px Helvetica";
            ctx.fillText("Try Again?", w/2, h*(4/5));     
        }
           
        
    };

    setInterval(function () {
        frame += 1;
        
        if (!dead){
            score = (1 + parseInt(frame / 120)).toString();
            var now = Date.now(),
                delta = now - lastTick,
                numTicks = Math.ceil(delta / MIN_PHYSICS_TICK), //at physics rate (multiple ticks per frame)
                i;
            for (i = 0; i < numTicks; i++) {
                 move();
                 enemyAI(delta / numTicks);
                 doPhysics(delta / numTicks);
                 checkCollisions();
            }
        } else {
            dead_ani_frame += 1;
            
            // after 2 seconds we can restart
            if (dead_ani_frame > 120){
                if (moving_up || moving_down){
                    dead_ani_frame = 0;
                    dead = false;
                    enemies = [];
                    player.p.y = h/2;
                    player.v.y = 0;
                    frame = 0;
                    init_enemies();
                }
            }
        }

        //at frame rate
        colorChanges();
        draw(); 
        lastTick = now;
    }, 1000 / framerate);


    //keyboard input
    $("body").keydown(function (e) {
        var i = e.which;
        if (i === 38 || i === 90) moving_up = true;
        if (i == 40 || i === 191) moving_down = true;
    });

    $("body").keyup(function (e) {
        var i = e.which;
        if (i === 38 || i === 90) { moving_up = false; }
        if (i === 40 || i === 191) { moving_down = false; }
    });


    function toRGB(c){
       return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.o + ");";
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
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2, d;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0);
                break;
                case g: h = (b - r) / d + 2;
                break;
                case b: h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }

        var arr = [h, s, l];
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
     * @return  {}           The RGB representation
     */
    function hslToRgb (h, s, l) {
        var r, g, b, r1, g1, b1, o1;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb (p, q, t){
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

        r1 = Math.round(r * 255);
        g1 = Math.round(g * 255);
        b1 = Math.round(b * 255);
        o1 = 1;
        
        return {r: r1, g: g1, b: b1, o: o1};
    }

    
    function distance(p1, p2){
        var dx, dy;
        dx = p1.p.x - p2.p.x; dx *= dx;
        dy = p1.p.y - p2.p.y; dy *= dy;
        return Math.sqrt(dx + dy)   
    }
    
    
    
    

}