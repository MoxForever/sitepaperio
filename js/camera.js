class Camera
{
	constructor ()
	{
		this.pos = new Vector(0, 0);
		this.scale = 1
	}

	update (x, y)
	{
		this.pos = new Vector(x, y)
	}
}