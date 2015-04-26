
/*

buglist:

if you pause (via "p" key)... then press UP. then unpause... the level has restarted.

*/

var paused = false;

level_params = [ // 7*8 = 56 seconds 
        {pulse_p: 0.0, min_pulse_v: 0.0, max_pulse_v: 0.0, move_p: 0.0, min_r: 0.1, max_r: 0.2, v_x: 0.23, min_v_y: 0.00, max_v_y: 0.00, min_v_x: 0.0, max_v_x: 1.0 },
        {pulse_p: 0.6, min_pulse_v: 0.1, max_pulse_v: 0.5, move_p: 0.0, min_r: 0.1, max_r: 0.3, v_x: 0.23, min_v_y: 0.00, max_v_y: 0.00, min_v_x: 0.0, max_v_x: 3.0 },
        {pulse_p: 0.8, min_pulse_v: 0.1, max_pulse_v: 1.0, move_p: 0.0, min_r: 0.1, max_r: 0.3, v_x: 0.23, min_v_y: 0.00, max_v_y: 0.00, min_v_x: 0.0, max_v_x: 3.0 },
        {pulse_p: 0.8, min_pulse_v: 0.1, max_pulse_v: 1.2, move_p: 0.1, min_r: 0.1, max_r: 0.4, v_x: 0.23, min_v_y: 0.01, max_v_y: 0.02, min_v_x: 0.0, max_v_x: 3.0 },
        {pulse_p: 0.8, min_pulse_v: 0.2, max_pulse_v: 1.4, move_p: 0.5, min_r: 0.1, max_r: 0.4, v_x: 0.24, min_v_y: 0.02, max_v_y: 0.05, min_v_x: 0.0, max_v_x: 4.0 },
        {pulse_p: 0.9, min_pulse_v: 0.3, max_pulse_v: 1.6, move_p: 0.9, min_r: 0.1, max_r: 0.5, v_x: 0.26, min_v_y: 0.02, max_v_y: 0.10, min_v_x: 0.0, max_v_x: 4.0 },
        {pulse_p: 1.0, min_pulse_v: 0.5, max_pulse_v: 2.0, move_p: 1.0, min_r: 0.1, max_r: 0.6, v_x: 0.28, min_v_y: 0.05, max_v_y: 0.20, min_v_x: 0.0, max_v_x: 6.0 },
        {pulse_p: 1.0, min_pulse_v: 0.5, max_pulse_v: 3.0, move_p: 1.0, min_r: 0.1, max_r: 0.7, v_x: 0.30, min_v_y: 0.05, max_v_y: 0.20, min_v_x: 0.0, max_v_x: 9.0 }
    ];

level_colors = {
        bg:      { h: 0.0, s: 0.4, l: 0.2, h_v: 0.001, h_min: 0.0, h_max: 0.1},
        player:  { h: 0.0, s: 0.3, l: 0.6, h_v: 0.002, h_min: 0.4, h_max: 0.6},
        enemy:   { h: 0.0, s: 0.3, l: 0.6, h_v: 0.002},
        overlay: { h: 0.0, s: 0.0, l: 0.0}
    };

//window.onload = instantiate_game(2, level_params, level_colors);

instantiate_game(0, level_params, level_colors);


// level selected
$("#level-list ul li").click(function(){

    if (! $(this).hasClass("locked-level")){

        $("#level-list").hide();
        instantiate_game(0, level_params, level_colors);

    }

});

// paused

$(window).keypress(function( event ) {

    if (event.which == 112){
        paused = !paused;
    }

});

