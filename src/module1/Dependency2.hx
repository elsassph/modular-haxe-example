package module1;

import common.BaseModule;

class Dependency2 extends BaseModule
{

	public function new() 
	{
		super();
		trace('Module1 is up');
	}
	
}