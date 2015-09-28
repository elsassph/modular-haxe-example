package util;

#if macro
import haxe.io.Path;
import haxe.macro.Compiler;
import haxe.macro.Context;
import sys.FileSystem;
import sys.io.File;

class Stub
{
	static public function modules() 
	{
		Context.onAfterGenerate(generated);
	}
	
	static private function generated() 
	{
		var output = Compiler.getOutput();
		var moduleName = Path.withoutDirectory(Path.withoutExtension(output));
		
		if (!FileSystem.exists(output)) return;
		var raw = File.getContent(output);
		var reExport = ~/\$hx_exports\.([a-z0-9_]+)/;
		var src = raw;
		var stubs = new Array<String>();
		var refs = new Array<String>();
		while (reExport.match(src))
		{
			var name = reExport.matched(1);
			refs.push(name);
			stubs.push('if (typeof $name == "undefined") var $name = {}\n');
			src = reExport.matchedLeft();
		}
		
		var insert = raw.lastIndexOf('})(typeof');
		if (insert < 0)
			throw 'Insertion point not found';
		src = raw.substr(0, insert) 
			+ stubs.join('') 
			+ addRefs(refs, moduleName)
			+ addJoinPoint(raw.substr(insert));
		
		File.saveContent(output, src);
	}
	
	static private function addRefs(refs:Array<String>, moduleName:String) 
	{
		var map = [for (ref in refs) '$ref:$ref'].join(',');
		return '$$hx_join._refs = ($$hx_join._refs || {}); $$hx_join._refs.$moduleName = {$map};\n';
	}
	
	static function addJoinPoint(src:String) 
	{
		return StringTools.replace(src,
			'typeof window != "undefined" ? window : exports' , 
			'typeof $$hx_join != "undefined" ? $$hx_join : $$hx_join = {}');
	}
	
}
#end