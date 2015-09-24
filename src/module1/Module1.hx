package module1;

import js.Browser;
import js.html.DivElement;
import module1.sub.Dependency1;

@:expose
class Module1 extends Dependency2 implements Interface1
{
	public var view:DivElement;
	public var sub:Dependency1;

	public function new() 
	{
		super();
		var doc = Browser.document;
		view = doc.createDivElement();
		view.className = 'module1';
		
		sub = new Dependency1();
		view.appendChild(sub.view);
	}
	
}