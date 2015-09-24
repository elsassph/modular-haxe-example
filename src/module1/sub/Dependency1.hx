package module1.sub;

import js.Browser;
import js.html.Text;

class Dependency1
{
	public var view:Text;

	public function new() 
	{
		var doc = Browser.document;
		view = doc.createTextNode("Hello module1");
	}
	
}