sinaDefine(['../../core/core','./Formatter','../../core/util'],function(c,F,u){"use strict";return F.derive({initAsync:function(){},format:function(r){return u.removePureAdvancedSearchFacets(r);},formatAsync:function(r){r=u.removePureAdvancedSearchFacets(r);return c.Promise.resolve(r);}});});
