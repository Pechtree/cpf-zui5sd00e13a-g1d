sap.ui.define(['sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer'],function(E){"use strict";jQuery.sap.declare('sap.ushell.renderers.fiori2.search.eventlogging.SinaLogConsumer');var m=sap.ushell.renderers.fiori2.search.eventlogging.SinaLogConsumer=function(){this.init.apply(this,arguments);};m.prototype=jQuery.extend(new E(),{init:function(s){this.sinaNext=s;},logEvent:function(e){this.sinaNext.logUserEvent(e);}});return m;});
