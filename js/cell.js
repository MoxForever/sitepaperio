class CellTypes {
	static player = new CellTypes(0, "player");
	static trail = new CellTypes(1, "trail");
	static unbreakable = new CellTypes(2, "unbreakable");

	constructor (id, name)
	{
		this.id = id;
		this.name = name;
	}
}


class Cell
{
	constructor (type, field)
	{
		this.type = type;
		this.field = field;
		this.extra = {};
		this.pos = null;
	}

	get_color ()
	{
		if (this.type.id == 2) return new Color(68, 68, 68);
		else if (this.type.id == 1 || this.type.id == 0) return this.extra["color"];
	}

	copy ()
	{
		var copy = new Cell(this.type, this.field);
		copy.extra = this.extra;
		return copy;
	}
}