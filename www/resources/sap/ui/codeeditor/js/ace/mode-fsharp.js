ace.define("ace/mode/fsharp_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text_highlight_rules").TextHighlightRules;var F=function(){var k=this.createKeywordMapper({"variable":"this","keyword":'abstract|assert|base|begin|class|default|delegate|done|downcast|downto|elif|else|exception|extern|false|finally|function|global|inherit|inline|interface|internal|lazy|match|member|module|mutable|namespace|open|or|override|private|public|rec|return|return!|select|static|struct|then|to|true|try|typeof|upcast|use|use!|val|void|when|while|with|yield|yield!|__SOURCE_DIRECTORY__|as|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|include|method|mixin|object|parallel|process|protected|pure|sealed|tailcall|trait|virtual|volatile|and|do|end|for|fun|if|in|let|let!|new|not|null|of|endif',"constant":"true|false"},"identifier");var f="(?:(?:(?:(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.))|(?:\\d+))(?:[eE][+-]?\\d+))|(?:(?:(?:\\d+)?(?:\\.\\d+))|(?:(?:\\d+)\\.)))";this.$rules={"start":[{token:"variable.classes",regex:'\\[\\<[.]*\\>\\]'},{token:"comment",regex:'//.*$'},{token:"comment.start",regex:/\(\*/,push:"blockComment"},{token:"string",regex:"'.'"},{token:"string",regex:'"""',next:[{token:"constant.language.escape",regex:/\\./,next:"qqstring"},{token:"string",regex:'"""',next:"start"},{defaultToken:"string"}]},{token:"string",regex:'"',next:[{token:"constant.language.escape",regex:/\\./,next:"qqstring"},{token:"string",regex:'"',next:"start"},{defaultToken:"string"}]},{token:["verbatim.string","string"],regex:'(@?)(")',stateName:"qqstring",next:[{token:"constant.language.escape",regex:'""'},{token:"string",regex:'"',next:"start"},{defaultToken:"string"}]},{token:"constant.float",regex:"(?:"+f+"|\\d+)[jJ]\\b"},{token:"constant.float",regex:f},{token:"constant.integer",regex:"(?:(?:(?:[1-9]\\d*)|(?:0))|(?:0[oO]?[0-7]+)|(?:0[xX][\\dA-Fa-f]+)|(?:0[bB][01]+))\\b"},{token:["keyword.type","variable"],regex:"(type\\s)([a-zA-Z0-9_$\-]*\\b)"},{token:k,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+\\.|\\-\\.|\\*\\.|\\/\\.|#|;;|\\+|\\-|\\*|\\*\\*\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|<-|="},{token:"paren.lpar",regex:"[[({]"},{token:"paren.rpar",regex:"[\\])}]"}],blockComment:[{regex:/\(\*/,token:"comment.start",push:"blockComment"},{regex:/\*\)/,token:"comment.end",next:"pop"},{defaultToken:"comment"}]};this.normalizeRules();};o.inherits(F,T);e.FSharpHighlightRules=F;});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(r,e,a){"use strict";var o=r("../../lib/oop");var R=r("../../range").Range;var B=r("./fold_mode").FoldMode;var F=e.FoldMode=function(c){if(c){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end));}};o.inherits(F,B);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(s,f,b){var l=s.getLine(b);if(this.singleLineBlockCommentRe.test(l)){if(!this.startRegionRe.test(l)&&!this.tripleStarBlockCommentRe.test(l))return"";}var c=this._getFoldWidgetBase(s,f,b);if(!c&&this.startRegionRe.test(l))return"start";return c;};this.getFoldWidgetRange=function(s,f,b,c){var l=s.getLine(b);if(this.startRegionRe.test(l))return this.getCommentRegionBlock(s,l,b);var m=l.match(this.foldingStartMarker);if(m){var i=m.index;if(m[1])return this.openingBracketBlock(s,m[1],b,i);var d=s.getCommentFoldRange(b,i+m[0].length,1);if(d&&!d.isMultiLine()){if(c){d=this.getSectionRange(s,b);}else if(f!="all")d=null;}return d;}if(f==="markbegin")return;var m=l.match(this.foldingStopMarker);if(m){var i=m.index+m[0].length;if(m[1])return this.closingBracketBlock(s,m[1],b,i);return s.getCommentFoldRange(b,i,-1);}};this.getSectionRange=function(s,b){var l=s.getLine(b);var c=l.search(/\S/);var d=b;var f=l.length;b=b+1;var g=b;var m=s.getLength();while(++b<m){l=s.getLine(b);var i=l.search(/\S/);if(i===-1)continue;if(c>i)break;var h=this.getFoldWidgetRange(s,"all",b);if(h){if(h.start.row<=d){break;}else if(h.isMultiLine()){b=h.end.row;}else if(c==i){break;}}g=b;}return new R(d,f,g,s.getLine(g).length);};this.getCommentRegionBlock=function(s,l,b){var c=l.search(/\s*$/);var d=s.getLength();var f=b;var g=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var h=1;while(++b<d){l=s.getLine(b);var m=g.exec(l);if(!m)continue;if(m[1])h--;else h++;if(!h)break;}var i=b;if(i>f){return new R(f,c,i,l.length);}};}).call(F.prototype);});ace.define("ace/mode/fsharp",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/fsharp_highlight_rules","ace/mode/folding/cstyle"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text").Mode;var F=r("./fsharp_highlight_rules").FSharpHighlightRules;var C=r("./folding/cstyle").FoldMode;var M=function(){T.call(this);this.HighlightRules=F;this.foldingRules=new C();};o.inherits(M,T);(function(){this.lineCommentStart="//";this.blockComment={start:"(*",end:"*)",nestable:true};this.$id="ace/mode/fsharp";}).call(M.prototype);e.Mode=M;});(function(){ace.require(["ace/mode/fsharp"],function(m){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=m;}});})();
