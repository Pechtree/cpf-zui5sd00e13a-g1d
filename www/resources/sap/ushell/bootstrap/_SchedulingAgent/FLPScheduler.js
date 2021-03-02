// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/_SchedulingAgent/state","sap/base/util/LoaderExtensions","sap/base/Log","sap/ushell/Config"],function(s,L,a,C){"use strict";var S={Loaded:"loaded",Wait:"wait",Step:"step",Error:"error",BlockDone:"blockDone",Start:"start",Done:"done",Skipped:"skipped"};var b="sap/ushell/bootstrap/_SchedulingAgent/LoadingConfiguration.json";var c="sap/ushell/bootstrap/_SchedulingAgent/StepConfiguration.json";function g(){return C.last("/core/shell/model/currentState/stateName");}var F={oSchedule:{iBlockIndex:0,aBlocksLoading:[]},initializeSchedule:function(){var p=L.loadResource(c,{async:true});var d=L.loadResource(b,{async:true});var P=Promise.all([p,d]).then(function(v){var o=v[0];var l=v[1];var e=this._validateConfig(l,o);if(e){this.oSchedule.oBlocks=l.LoadingBlocks;this.oSchedule.oSteps=o;this.oSchedule.aBlockOrder=l.OrderOfLoadingBlocks;this.oSchedule.iBlockIndex=0;s.setForModule(s.id.module.flpScheduler.id,s.id.module.flpScheduler.Initialized,"Schedule validated");}else{s.setForModule(s.id.module.flpScheduler.id,s.id.module.flpScheduler.WrongConfiguration,"Configuration error");}return e;}.bind(this));return P;},getNextLoadingStep:function(){var o={sStatus:S.Start,oContent:{}};if(this.oSchedule.aBlocksLoading.length===0){var l=this._startLoadingBlock();if(l){o.sStatus=S.Done;return o;}}var A=true;var d=false;var e,f,h,j,k,m,I,n,p;for(var i=0;i<this.oSchedule.aBlocksLoading.length;i++){e=this.oSchedule.aBlocksLoading[i];f=this.oSchedule.oBlocks[e];h=f.iStepIndex;j=f.LoadingSteps[h];k=h===f.LoadingSteps.length-1;m=this._checkAndUpdateAsyncQueue(f);p=s.isStepLoaded(j.LoadingStep)||s.isStepSkipped(j.LoadingStep);n=s.isStepLoading(j.LoadingStep);A=m.bAllStepsDone&&p;d=m.bAStepIsLoading||n;if((n&&!j.canBeLoadedAsync)||(d&&k)){o.sStatus=S.Wait;continue;}if(!k||!p&&!n){if(p||(j.canBeLoadedAsync&&n)){h+=1;}o=this._prepareStepForLoading(f,e,h);}if(A&&k){I=this.oSchedule.aBlocksLoading.indexOf(e);this.oSchedule.aBlocksLoading.splice(I,1);o.sStatus=S.BlockDone;this.oSchedule.iBlockIndex+=1;s.setForLoadingBlock(e,s.id.loadingBlock.Done,"","Block removed from loading queue");}if(o.sStatus!==S.wait){break;}}return o;},dumpSchedule:function(){a.debug(JSON.stringify(this.oSchedule));},_loadingIsEnabled:function(d){var e;if(Array.isArray(d.oConfig.excludedFLPStates)){if(d.oConfig.excludedFLPStates.indexOf(g())>-1){return false;}}if(Array.isArray(d.oConfig.mandatoryFLPStates)&&d.oConfig.mandatoryFLPStates.length!==0){if(d.oConfig.mandatoryFLPStates.indexOf(g())===-1){return false;}}function f(o){return o.path&&C.last(o.path)!==o.assertionValue;}if(d.oConfig.configSwitch){e=[].concat(d.oConfig.configSwitch);if(e.some(f)){return false;}}return true;},_checkAndUpdateAsyncQueue:function(d){var t=[];var e,f,h;var A=true;var j=false;for(var i=0;i<d.aAsyncStepsLoading.length;i++){h=d.aAsyncStepsLoading[i];e=s.isStepLoaded(h)||s.isStepSkipped(h);f=s.isStepLoading(h);if(f){t.push(h);}A=A&&e;j=j||f;}d.aAsyncStepsLoading=t;return{bAllStepsDone:A,bAStepIsLoading:j};},_startLoadingBlock:function(){var l=false;if(this.oSchedule.iBlockIndex<this.oSchedule.aBlockOrder.length){var n=this.oSchedule.aBlockOrder[this.oSchedule.iBlockIndex];this.oSchedule.aBlocksLoading.push(n);this.oSchedule.oBlocks[n].iStepIndex=0;this.oSchedule.oBlocks[n].aAsyncStepsLoading=[];s.setForLoadingBlock(n,s.id.loadingBlock.Prepared,"","Block added to the loading queue.");}else{l=true;}return l;},_prepareStepForLoading:function(d,e,f){var h;var o={sStatus:S.Step,oContent:d.LoadingSteps[f],oConfig:this.oSchedule.oSteps[d.LoadingSteps[f].LoadingStep]};if(!this._loadingIsEnabled(o)){o.sStatus=S.Skipped;d.iStepIndex=f;s.setForLoadingStep(o.oContent.LoadingStep,s.id.loadingStep.Skipped,"","Step set to skipped");return o;}var D=this._checkDependencies(o,e);if(D.bMissing){o.sStatus=S.Error;}else if(D.bAllLoaded){s.setForLoadingStep(o.oContent.LoadingStep,s.id.loadingStep.Prepared,"","Step prepared for control unit");h=o.oContent.canBeLoadedAsync;d.iStepIndex=f;if(h){s.setForLoadingStep(o.oContent.LoadingStep,s.id.loadingStep.Prepared,"","Step set on the async loading queue");d.aAsyncStepsLoading.push(o.oContent.LoadingStep);}}else{o.sStatus=S.Wait;s.setForLoadingStep(o.oContent.LoadingStep,s.id.loadingStep.WaitingForDependencies,"","Step missing dependencies");}return o;},_checkDependencies:function(d,e){var D={bAllLoaded:true,bMissing:false};if(d.oConfig.Dependencies){for(var i=0;i<d.oConfig.Dependencies.length;i++){D.bAllLoaded=D.bAllLoaded&&s.isStepLoaded(d.oConfig.Dependencies[i]);if(!s.isStepLoaded(d.oConfig.Dependencies[i])&&!s.isStepLoading(d.oConfig.Dependencies[i])){s.setForLoadingStep(d.oContent.LoadingStep,s.id.loadingStep.Aborted,d.oConfig.Dependencies[i],"Missing a dependency");s.setForLoadingBlock(e,s.id.loadingBlock.Aborted,d.oConfig.Dependencies[i],"A step is missing a dependency");s.setForModule(s.id.module.flpScheduler.id,s.id.module.flpScheduler.LoadingAborted,"Dependencies can not be resolved: a dependency isn't loading before it is required.");D.bMissing=true;D.bAllLoaded=false;break;}}}return D;},_validateConfig:function(l,d){var e=l&&l.OrderOfLoadingBlocks&&l.LoadingBlocks&&l.OrderOfLoadingBlocks.length&&d;if(!e){return false;}var B=l.OrderOfLoadingBlocks.reduce(function(f,h){f=f&&l.LoadingBlocks[h];if(f){var o=l.LoadingBlocks[h];var i=true;if(o.LoadingSteps){var k;for(var j=0;j<o.LoadingSteps.length;j++){k=o.LoadingSteps[j].LoadingStep;i=i&&d[k];}}f=f&&i;}return!!f;},true);return B;}};return F;},false);