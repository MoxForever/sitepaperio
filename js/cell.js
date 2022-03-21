class CellTypes {
	constructor (id, name)
	{
		this.id = id;
		this.name = name;
		this.extra = null;
	}

	static get_player (pl_id, color)
	{
		var cell = new CellTypes(0, "player");
		cell.extra = {"pl_id": pl_id, "color": color};
		return cell;
	}

	static get_trail (pl_id, color)
	{
		var cell = new CellTypes(1, "trail");
		cell.extra = {"pl_id": pl_id, "color": color};
		return cell;
	}

	static get_unbreakable()
	{
		return new CellTypes(2, "unbreakable");
	}
}


class Cell
{
	constructor (type, field, pos)
	{
		this.type = type;
		this.field = field;
		this.pos = pos
	}
}