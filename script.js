var canvas = null,
	field = null,
	camera = null,
	player = null;

var lastCalledTime;

var current_state = "menu";

var keyboard_presseed_btns = {};

var random_move_thread = null;


function reload_screen()
{
	document.getElementById('loading').style.opacity = 1;
}


function load_complete()
{
	document.getElementById('loading').style.opacity = 0;
}


window.onload = function ()
{
	setTimeout(load_complete, 500);
	canvas = document.getElementById('main-screen');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	camera = new Camera();
	field = new Field(new Vector(100, 100));
	player = new Player(0, new Vector(Math.floor(Math.random()*field.size.x*field.cell_size.x),
									  Math.floor(Math.random()*field.size.y*field.cell_size.y)),
						Color.random(), field);

	camera.pos = player.pos;

	setInterval(main_loop, 1);
	random_move_thread = setInterval(randomize_moving, 5000);
	window.onkeyup = keyboard_listener;
	window.onkeydown = keyboard_listener;
	window.onwheel = scroll_listener;
}

window.onresize = function() 
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function main_loop ()
{
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "#888";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var fps = requestAnimFrame();

	if (current_state == "menu")
	{
		camera.scale = (Math.min(canvas.width, canvas.height)/1250 - Math.sqrt(player.score)/Math.PI/100).toFixed(2);

		field.draw(canvas, camera);
		player.draw(canvas, camera);

		try
		{
			if (fps < 1) fps = 60;
			player.physic_process(field, fps);
		}
		catch (error)
		{
			if (error == "dead") 
			{
				reload_screen();
				current_state = "menu_wait";
				clearInterval(random_move_thread);
				setTimeout(function () {
					current_state = "menu";
					window.onload();
				}, 500);
			}
			else throw error;
		}
	}
	else if (current_state == "menu_wait")
	{
		field.draw(canvas, camera);
		player.draw(canvas, camera);
	}
	else if (current_state == "game")
	{
		camera.scale = (Math.min(canvas.width, canvas.height)/1250 - Math.sqrt(player.score)/Math.PI/100).toFixed(2);

		field.draw(canvas, camera);
		player.draw(canvas, camera);

		try
		{
			if (fps < 1) fps = 60;
			player.physic_process(field, fps);
		}
		catch (error)
		{
			if (error == "dead") 
			{
				player = null;
				current_state = "dead";
			}
			else throw error;
		}
	}
	else if (current_state == "dead")
	{
		field.draw(canvas, camera);
		if (keyboard_presseed_btns["KeyW"]) camera.pos.y -= 10;
		if (keyboard_presseed_btns["KeyS"]) camera.pos.y += 10;
		if (keyboard_presseed_btns["KeyA"]) camera.pos.x -= 10;
		if (keyboard_presseed_btns["KeyD"]) camera.pos.x += 10;
	}

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText(fps.toFixed() + " fps", 10, 20);
}

function randomize_moving()
{
	set_dest = Math.floor(Math.random()*4);
	if (set_dest % 2 == player.dest % 2) set_dest += 1;
	if (set_dest > 3) set_dest = 0;
	player.dest = set_dest;
}

function keyboard_listener(event)
{
	if (current_state == "game")
	{
		if (event.type == "keydown")
		{
			if (event.code == "KeyW") player.dest = 0;
			else if (event.code == "KeyD") player.dest = 1;
			else if (event.code == "KeyS") player.dest = 2;
			else if (event.code == "KeyA") player.dest = 3;
		}
	}
	else if (current_state == "dead")
	{
		if (event.type == "keydown")
			keyboard_presseed_btns[event.code] = true;
		else
			keyboard_presseed_btns[event.code] = false;
	}
}

function scroll_listener(event)
{
	if (current_state == "dead")
	{
		camera.scale = camera.scale - (event.deltaY*camera.scale) / 1000;
		if (camera.scale < 0.4) camera.scale = 0.4;
		else if (camera.scale > 2) camera.scale = 2;
	}
}

function requestAnimFrame()
{
	if(!lastCalledTime)
	{
		lastCalledTime = Date.now();
		fps = 0;
	}
	else
	{
		delta = (Date.now() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		fps = 1 / delta;
	}
	return fps;
}