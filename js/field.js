class Field
{
	constructor(size)
	{
		this.size = size;
		this.cell_size = new Vector(100, 100);

		this.field = null;

		this.generate();

		console.log(this)
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

	setcell (pos, cell)
	{
		this.field[pos.x][pos.y] = cell;
	}

	draw (canvas, camera)
	{
		var ctx = canvas.getContext('2d');

		var right = Math.ceil((camera.pos.x + canvas.width / camera.scale) / this.cell_size.x)-1,
			left = Math.ceil((camera.pos.x - canvas.width / 2 / camera.scale) / this.cell_size.x)-1,
			bottom = Math.ceil((camera.pos.y + canvas.height / camera.scale) / this.cell_size.y)-1,
			top = Math.ceil((camera.pos.y - canvas.height / 2 / camera.scale) / this.cell_size.y)-1;

		for (var x = left; x <= right; x++)
		{
			for (var y = top; y <= bottom; y++)
			{
				if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y)
				{
					ctx.fillStyle = "#888";
				}
				else
				{
					var cell = this.field[x][y];

					if ((x + y) % 2 == 0)
					{
						ctx.fillStyle = "#000";
					}
					else
					{
						ctx.fillStyle = "#eee";
					}
				}
				ctx.fillRect(Math.ceil((x * this.cell_size.x - camera.pos.x) * camera.scale + canvas.width / 2),
							 Math.ceil((y * this.cell_size.y - camera.pos.y) * camera.scale + canvas.height / 2),
							 this.cell_size.x * camera.scale, this.cell_size.y * camera.scale);
			}
		}
	}
}