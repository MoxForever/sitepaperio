class Player
{
	constructor (id, pos, color, field)
	{
		this.id = id;
		this.size = field.cell_size;
		this.pos = pos;
		this.color = color;
		this.field = field

		var rand_dest = Math.floor(Math.random()*4)
		this.dest = rand_dest;
		this.now_dest = rand_dest;

		this.speed = 700;

		this.can_dead = false;
		this.trail = [];

		this.score = 0;

		this.last_cell = null;
	}

	static darw_player (pos, size, color, canvas)
	{
		ctx = canvas.getContext('2d');

		ctx.fillStyle = this.color.multiply(0.9).for_ctx();
		ctx.fillRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);

		ctx.fillStyle = this.color.multiply(1.1).for_ctx();
		ctx.fillRect(pos.x-size.x/2, pos.y-size.y*0.3, size.x, size.y*0.4);
	}

	dead ()
	{
		for (var i = 1; i < this.trail.length; i++)
			this.field.setcell(this.trail[i].pos, null);

		throw "dead";
	}

	spawn ()
	{
		var coords = Vector.random(new Vector(15, 15), new Vector(this.field.size.x - 15, this.field.size.y - 15));
		this.pos = new Vector((coords.x) * this.size.x + this.size.x / 2, (coords.y) * this.size.y + this.size.y / 2);

		for (var x = coords.x - 3; x <= coords.x + 3; x++)
			for (var y = coords.y - 3; y <= coords.y + 3; y++)
			{
				var cell = new Cell(CellTypes.player, field);
				cell.extra = {"player_id": this.id, "color": this.color};
				this.field.setcell(new Vector(x, y), cell);
			}
	}

	physic_process (field, fps)
	{
		if (this.now_dest != this.dest)
		{
			if (this.now_dest % 2 == 1)
			{
				if (this.speed / fps >= (this.pos.x - this.size.x/2) % this.size.x)
				{
					this.pos.x -= (this.pos.x - this.size.x/2)  % this.size.x;
					this.now_dest = this.dest;
					return;
				}
				else if (this.speed / fps >= this.size.x - (this.pos.x - this.size.x/2)  % this.size.x)
				{
					this.pos.x += this.size.x - (this.pos.x - this.size.x/2)  % this.size.x;
					this.now_dest = this.dest;
					return;
				}
			}
			else
			{
				if (this.speed / fps >= (this.pos.y - this.size.y/2) % this.size.y)
				{
					this.pos.y -= (this.pos.y - this.size.y/2)  % this.size.y;
					this.now_dest = this.dest;
					return;
				}
				else if (this.speed / fps >= this.size.y - (this.pos.y - this.size.y/2)  % this.size.y)
				{
					this.pos.y += this.size.y - (this.pos.y - this.size.y/2)  % this.size.y;
					this.now_dest = this.dest;
					return;
				}
			}
		}

		var delta_pos = this.pos.copy();
		if (this.now_dest == 0) delta_pos.y += this.size.y / 2-1;
		if (this.now_dest == 2) delta_pos.y -= this.size.y / 2-1;
		if (this.now_dest == 1) delta_pos.x -= this.size.x / 2-1;
		if (this.now_dest == 3) delta_pos.x += this.size.x / 2-1;

		var field_cords = this.field.get_cell_cords_by_world_pos(delta_pos);
		if (field_cords === null) this.dead();

		var cell = new Cell(CellTypes.trail, field);
		cell.extra = {"player_id": this.id, "color": this.color.transparent(0.5)};
		var now_cell = this.field.field[field_cords.x][field_cords.y];

		if (now_cell !== null)
		{
			if (now_cell.type == CellTypes.player)
			{
				if (now_cell.extra["player_id"] == this.id)
				{
					if (this.can_dead)
					{
						this.trail.push(now_cell);
						var cell = new Cell(CellTypes.player, field);
						cell.extra = {"player_id": this.id, "color": this.color};

						this.score += fill_field(this.field, this.trail, cell, this.id);

						this.trail = [];
					}
					this.can_dead = false;
					var cell = new Cell(CellTypes.player, field);
					cell.extra = {"player_id": this.id, "color": this.color};
				}
			}
			else
			{
				this.can_dead = true;
				if (now_cell.type == CellTypes.trail)
					if (now_cell.extra["player_id"] == this.id && !now_cell.pos.equal(this.last_cell))
						this.dead()
			}
		}

		this.field.setcell(field_cords, cell);
		this.last_cell = field_cords;

		if (this.can_dead)
		{
			if (this.trail.length > 0)
			{
				if (!this.trail[this.trail.length - 1].pos.equal(cell.pos))
				{
					this.trail.push(cell);
				}
			}
			else
			{
				if (this.now_dest == 0)
				{
					this.trail.push(this.field.field[cell.pos.x][cell.pos.y+1]);
				}
				else if (this.now_dest == 1)
				{
					this.trail.push(this.field.field[cell.pos.x-1][cell.pos.y]);
				}
				else if (this.now_dest == 2)
				{
					this.trail.push(this.field.field[cell.pos.x][cell.pos.y-1]);
				}
				else if (this.now_dest == 3)
				{
					this.trail.push(this.field.field[cell.pos.x+1][cell.pos.y]);
				}

				this.trail.push(cell);
			}
		}

		if (this.now_dest == 0) this.pos.y -= Math.round(this.speed / fps);
		else if (this.now_dest == 1) this.pos.x += Math.round(this.speed / fps);
		else if (this.now_dest == 2) this.pos.y += Math.round(this.speed / fps);
		else if (this.now_dest == 3) this.pos.x -= Math.round(this.speed / fps);
	}

	draw (canvas, camera)
	{
		var ctx = canvas.getContext('2d');

		ctx.fillStyle = this.color.multiply(0.9).for_ctx();
		ctx.fillRect(Math.ceil((this.pos.x - camera.pos.x - this.size.x/2) * camera.scale + canvas.width / 2),
					 Math.ceil((this.pos.y - camera.pos.y - this.size.y/2) * camera.scale + canvas.height / 2),
					 this.size.x * camera.scale, this.size.y * camera.scale);

		ctx.fillStyle = this.color.multiply(1.1).for_ctx();
		ctx.fillRect(Math.ceil((this.pos.x - camera.pos.x - this.size.x/2) * camera.scale + canvas.width / 2),
					 Math.ceil((this.pos.y - camera.pos.y - this.size.y/2 - 20) * camera.scale + canvas.height / 2),
					 this.size.x * camera.scale, (this.size.y-10) * camera.scale);
	}
}