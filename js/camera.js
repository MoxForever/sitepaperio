class Camera
{
	constructor ()
	{
		this.pos = new Vector(0, 0);
	}

	update (x, y)
	{
		this.pos = new Vector(x, y)
	}
}