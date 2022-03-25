class Vector
{
	constructor (x, y)
	{
		this.x = x;
		this.y = y;
	}

	static random(from, to)
	{
		if (from.x > to.x) var x_cords = [to.x, from.x];
		else var x_cords = [from.x, to.x];

		if (from.y > to.y) var y_cords = [to.y, from.y];
		else var y_cords = [from.y, to.y];

		return new Vector(Math.round(x_cords[0] + Math.random()*(x_cords[1] - x_cords[0])),
						  Math.round(y_cords[0] + Math.random()*(y_cords[1] - y_cords[0])));
	}

	equal (other)
	{
		return this.x == other.x && this.y == other.y;
	}

	copy ()
	{
		return new Vector(this.x, this.y);
	}
}