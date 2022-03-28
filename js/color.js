class Color
{
	constructor (r, g, b, a=1)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	multiply (x)
	{
		return new Color(this.r * x, this.g * x, this.b * x, this.a);
	}

	transparent (a)
	{
		return new Color(this.r, this.g, this.b, a)
	}

	for_ctx ()
	{
		return "rgba(" + this.r + "," + this.g + ","+ this.b + ","+ this.a + ")"
	}

	static random()
	{
		return new Color(Math.floor(Math.random()*256), 
						 Math.floor(Math.random()*256),
						 Math.floor(Math.random()*256))
	}
}