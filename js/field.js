class Field
{
	constructor(size)
	{
		this.size = size;
		this.cell_size = new Vector(100, 100);

		this.field = null;

		this.generate();
	}

	generate ()
	{
		this.field = [];
		for (var h = 0; h < this.size.x; h++)
		{
			this.field.push([]);
			for (var w = 0; w < this.size.y; w++)	
			{
				this.field[h].push(null);
			}
		}
	}

	get_cell_cords_by_world_pos (pos)
	{
		if (pos.x < 0 || pos.x > (this.size.x * this.cell_size.x)-1 || 
			pos.y < 0 || pos.y > (this.size.y * this.cell_size.y)-1) return null;
		return new Vector(Math.floor(pos.x / this.cell_size.x),
						  Math.floor(pos.y / this.cell_size.y));
	}

	setcell (pos, cell)
	{
		if (cell !== null) cell.pos = pos;
		this.field[pos.x][pos.y] = cell;
	}

	draw (canvas, camera)
	{
		var ctx = canvas.getContext('2d');

		var right = Math.ceil((camera.pos.x + canvas.width / camera.scale) / this.cell_size.x)-1,
			left = Math.ceil((camera.pos.x - canvas.width / 2 / camera.scale) / this.cell_size.x)-1,
			bottom = Math.ceil((camera.pos.y + canvas.height / camera.scale) / this.cell_size.y)-1,
			top = Math.ceil((camera.pos.y - canvas.height / 2 / camera.scale) / this.cell_size.y)-1;

		if (left < 0) left = 0;
		if (right >= this.size.x) right = this.size.x - 1;
		if (top < 0) top = 0;
		if (bottom >= this.size.y) bottom = this.size.y - 1;


		for (var x = left; x <= right; x++)
		{
			for (var y = top; y <= bottom; y++)
			{
				var cell = this.field[x][y];

				if (cell === null)
				{
					if ((x + y) % 2 == 0) ctx.fillStyle = "#eee";
					else ctx.fillStyle = "#fff";
				}
				else
				{
					ctx.fillStyle = cell.get_color().for_ctx();
				}
				ctx.fillRect(Math.ceil((x * this.cell_size.x - camera.pos.x) * camera.scale + canvas.width / 2),
							 Math.ceil((y * this.cell_size.y - camera.pos.y) * camera.scale + canvas.height / 2),
							 this.cell_size.x * camera.scale, this.cell_size.y * camera.scale);
				//ctx.font = camera.scale*15 + "px Verdana";
				//ctx.fillStyle = "#000";
				//ctx.fillText(x + ", " + y, Math.ceil((x * this.cell_size.x - camera.pos.x) * camera.scale + canvas.width / 2),
				//			 Math.ceil((y * this.cell_size.y - camera.pos.y) * camera.scale + canvas.height / 2)+12*camera.scale)
			}
		}

		for (var x = left; x <= right; x++)
		{
			for (var y = top; y <= bottom-1; y++)
			{
				var cell = this.field[x][y];
				if (this.field[x][y+1] === null && cell !== null)
				{
					if (cell.type != CellTypes.player) continue;
					ctx.fillStyle = cell.get_color().multiply(0.5).for_ctx();
					ctx.fillRect(Math.ceil((x * this.cell_size.x - camera.pos.x) * camera.scale + canvas.width / 2),
							 Math.ceil((y * this.cell_size.y - camera.pos.y + this.cell_size.y) * camera.scale + canvas.height / 2),
							 this.cell_size.x * camera.scale, 10 * camera.scale);
				}
			}
		}
	}
}