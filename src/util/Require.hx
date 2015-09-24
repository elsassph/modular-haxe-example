package util;

import js.Browser;
import js.Promise;

class Require
{
	static var loaded:Map<String, Promise<String>> = new Map();
	
	static public function module(name:String, loadCss:Bool = true):Promise<String>
	{
		if (loaded.exists(name)) 
			return loaded.get(name);
		
		var p = new Promise<String>(function(resolve, reject) {
			var doc = Browser.document;
			var pending = loadCss ? 2 : 1;
			
			function resourceLoaded() 
			{
				if (--pending == 0) 
					resolve(name);
			}
			function resourceFailed()
			{
				reject(name);
			}
			
			if (loadCss)
			{
				var css = doc.createLinkElement();
				css.rel = 'stylesheet';
				css.onload = resourceLoaded;
				css.onerror = resourceFailed;
				css.href = '$name.css';
				doc.body.appendChild(css);
			}
			
			var script = doc.createScriptElement();
			script.onload = resourceLoaded;
			script.src = '$name.js';
			script.onerror = resourceFailed;
			doc.body.appendChild(script);
		});
		
		loaded.set(name, p);
		return p;
	}
	
}