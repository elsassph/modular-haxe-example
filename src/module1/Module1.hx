package module1;

import module1.sub.Dependency1;

@:expose
@:keep
class Module1 extends Dependency2 implements Interface1
{
	public var sub:Dependency1;

	public function new() 
	{
		super();
		view.className = 'module1';
		
		sub = new Dependency1();
		view.appendChild(sub.view);
	}
	
}