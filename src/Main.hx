package;

import js.Browser;
import js.html.DivElement;
import module1.Module1;
import module1.sub.Dependency1;
import util.Require;

class Main 
{
	var root:DivElement;
	var currentSub:Dependency1;
	
	static function main() 
	{
		var app = new Main();
	}
	
	public function new()
	{
		var doc = Browser.document;
		root = doc.createDivElement();
		root.className = 'main';
		doc.body.appendChild(root);
		
		var link = doc.createAnchorElement();
		link.href = '#';
		link.onclick = loadContent;
		link.innerText = 'Load module';
		root.appendChild(link);
	}
	
	function loadContent(_) 
	{
		Require.module('module1').then(moduleLoaded, moduleFailed);
		return false;
	}
	
	function moduleLoaded(name:String) 
	{
		trace('Module $name loaded');
		var module = new Module1();
		currentSub = module.sub;
		root.appendChild(module.view);
	}
	
	function moduleFailed(name:String) 
	{
		trace('Module $name failed');
	}
	
}