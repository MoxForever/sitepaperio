function fill_field (field, path, cell_instanse)
{
	var left_turns = 0,
		score = 0;

	for (var i = 0; i < path.length-2; i++)
	{
		var a = path[i].pos,
			b = path[i+1].pos,
			c = path[i+2].pos;

		if (a.x == b.x)
		{
			if (b.x == c.x) continue;
			else if (a.y < b.y)
			{
				if (b.x < c.x) left_turns += 1;
				else if (b.x > c.x) left_turns -= 1;
			}
			else
			{
				if (b.x < c.x) left_turns -= 1;
				else if (b.x > c.x) left_turns += 1;
			}
		}
		else
		{
			if (b.y == c.y) continue;
			else if (a.x < b.x)
			{
				if (b.y < c.y) left_turns -= 1;
				else if (b.y > c.y) left_turns += 1;
			}
			else
			{
				if (b.y < c.y) left_turns += 1;
				else if (b.y > c.y) left_turns -= 1;
			}
		}
	}

	if (left_turns > 0) left_turns = 1;
	if (left_turns < 0) left_turns = -1;

	if (left_turns == 0)
	{
		for (var i = 1; i < path.length - 1; i++)
		{
			field.setcell(path[i].pos, cell_instanse.copy());
			score += 1;
		}
	}
	else
	{
		for (var i = 0; i < path.length-2; i++)
		{
			var a = path[i].pos,
				b = path[i+1].pos,
				c = path[i+2].pos;

			field.setcell(b, cell_instanse.copy());

			if  (a.x == b.x && b.x == c.x)
			{
				if (c.y > a.y)
				{
					score += fill(field, new Vector(a.x+left_turns, a.y), cell_instanse);
				}
				else
				{
					score += fill(field, new Vector(a.x-left_turns, a.y), cell_instanse);
				}
			}
			else if (a.y == b.y && b.y == c.y)
			{
				if (c.x > a.x)
				{
					score += fill(field, new Vector(a.x, a.y-left_turns), cell_instanse);
				}
				else
				{
					score += fill(field, new Vector(a.x, a.y+left_turns), cell_instanse);
				}
			}
		}
	}

	return score;
}


function fill (field, pos, cell)
{
	if (field.field[pos.x][pos.y] !== null) return 0;

	field.setcell(pos, cell.copy());

	return fill(field, new Vector(pos.x+1, pos.y), cell) +
		   fill(field, new Vector(pos.x-1, pos.y), cell) +
		   fill(field, new Vector(pos.x, pos.y+1), cell) +
		   fill(field, new Vector(pos.x, pos.y-1), cell) + 1;
}


function can_fill (field, pos, cells)
{
	if (cells === undefined) cells = {};
	if (Object.keys(cells).length > 100) throw 'No';

	if (field.field[pos.x][pos.y] !== null) return 0;

	if (cells[pos] !== undefined) return 0;

	cells[pos] == 1;

	return can_fill(field, new Vector(pos.x+1, pos.y), cells) + can_fill(field, new Vector(pos.x-1, pos.y), cells) +
		   can_fill(field, new Vector(pos.x, pos.y+1), cells) + can_fill(field, new Vector(pos.x, pos.y-1), cells);
}