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
		var reExport = ~/\$hx_exports\.([a-z0-9_]+) = \$/gi;
		var src = raw;
		var refs = new Array<String>();
		var indexes = new Array<Int>();
		var offset = 0;
		while (reExport.match(src))
		{
			var name = reExport.matched(1);
			refs.push(name);
			var pos = reExport.matchedPos();
			indexes.push(offset + pos.pos);
			src = reExport.matchedRight();
			offset += pos.pos + pos.len;
		}
		
		var insert = raw.lastIndexOf('})(typeof');
		if (insert < 0)
			throw 'Insertion point not found';
		src = addInjections(refs, indexes, raw.substr(0, insert))
			+ addRefs(refs, moduleName)
			+ addJoinPoint(raw.substr(insert));
		
		File.saveContent(output, src);
	}
	
	static function addInjections(refs:Array<String>, indexes:Array<Int>, src:String) 
	{
		var i = indexes.length - 1;
		while (i >= 0)
		{
			src = src.substr(0, indexes[i])
				+ 'var ${refs[i]} = ' 
				+ src.substr(indexes[i]);
			i--;
		}
		return src;
	}
	
	static function addRefs(refs:Array<String>, moduleName:String) 
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