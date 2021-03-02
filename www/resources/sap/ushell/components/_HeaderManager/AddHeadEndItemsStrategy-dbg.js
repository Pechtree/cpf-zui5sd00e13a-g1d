// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log"
], function (Log) {
    "use strict";

    function fnValidateAddingHeadEndItems (aExistingIds, aIdsToAdd) {
        var allocatedItemSpace = 0,
            index,
            sId;

        if (!aExistingIds || !aIdsToAdd) {
            return false;
        }

        // Check that the controls with the given ids exist
        var bNotExist = aIdsToAdd.some( function (sId) {
            var bNotFound = !sap.ui.getCore().byId(sId);
            if (bNotFound) {
                Log.warning("Failed to find control with id '{id}'".replace("{id}", sId));
            }
            return bNotFound;
        });
        if (bNotExist) {
            return false;
        }

        //we always allow to create the overflow button
        if (aIdsToAdd.length === 1 && aIdsToAdd[0] === "endItemsOverflowBtn"){
            return true;
        }
        for (index = 0; index < aExistingIds.length; index++) {
            sId = aExistingIds[index];
            if (sId !== "endItemsOverflowBtn"){
                //increment the counter but not consider the overflow button
                allocatedItemSpace++;
            }

            if (allocatedItemSpace + aIdsToAdd.length > 6) {
                jQuery.sap.log.warning("maximum of six items has reached, cannot add more items.");
                return false;
            }
            if (aIdsToAdd.indexOf(sId) > -1) {
                return false;
            }
        }

        return true;
    }

    function fnAddHeadEndItems (aCurrentlyExistingItems, aIdsToAdd) {
        //copy original array
        var aNewItems = aCurrentlyExistingItems.slice(0);
        //in order to always keep the same order of buttons in the shell header, we will sort them by their Id's
        // sorting order: 1. sf, 2.copilot 3. Notification(last) and up to 6 items
        aNewItems.sort();
        aNewItems = aNewItems.concat(aIdsToAdd);
        var notificationIndex = aNewItems.indexOf("NotificationsCountButton");
        if (notificationIndex != -1){
            aNewItems.splice(notificationIndex, 1);
            aNewItems.splice(aNewItems.length, 0, "NotificationsCountButton");
        }
        var coPilotIndex = aNewItems.indexOf("copilotBtn");
        if ( coPilotIndex!= -1 ) {
            aNewItems.splice(coPilotIndex,1);
            if (aNewItems.indexOf("sf") != -1) {
                //put co-pilot next to "sf" if exists, else, make it the first in the header
                aNewItems.splice( 1, 0, "copilotBtn" );
            } else {
                aNewItems.splice( 0, 0, "copilotBtn" );
            }
        }
        //the search button must remain in the first position, so moving it to the front.
        var sfIndex = aNewItems.indexOf("sf");
        if (sfIndex != -1){
            aNewItems.splice(sfIndex, 1);
            aNewItems.splice(0, 0, "sf");
        }

        return aNewItems;
    }

    function execute (aCurrentValue, aValueToAdjust) {
        var aResult = aCurrentValue;

        if (fnValidateAddingHeadEndItems(aCurrentValue, aValueToAdjust)) {
            aResult = fnAddHeadEndItems(aCurrentValue, aValueToAdjust);
        }

        return aResult;
    }

    return {
        execute: execute
    };

});
