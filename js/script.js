var canvas = null,
	field = null,
	camera = null;

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;

window.onload = function ()
{
	canvas = document.getElementById('main-screen');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var ctx = canvas.getContext('2d');

	camera = new Camera();
	field = new Field(new Vector(100, 200));
	setInterval(main_loop, 1);
}

window.onresize = function() 
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function main_loop ()
{
	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	c_pos = camera.pos;
	if (keyW)
		c_pos.y -= 10;
	if (keyS)
		c_pos.y += 10;
	if (keyA)
		c_pos.x -= 10;
	if (keyD)
		c_pos.x += 10;

	camera.pos = c_pos;

	field.draw(canvas, camera);
}

function onKeyDown(event){
  var keyCode = event.keyCode;
  switch(keyCode){
    case 87:  //w
        keyW = true;
    break;
    case 68:  //d
        keyD = true;
    break;
    case 83:  //s
        keyS = true;
    break;
    case 65:  //a
        keyA = true;
    break;
  }
}
function onKeyUp(event){
  var keyCode = event.keyCode;
  switch(keyCode){
    case 87:  //w
        keyW = false;
    break;
    case 68:  //d
        keyD = false;
    break;
    case 83:  //s
        keyS = false;
    break;
    case 65: //a
        keyA = false;
    break;
  }
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);