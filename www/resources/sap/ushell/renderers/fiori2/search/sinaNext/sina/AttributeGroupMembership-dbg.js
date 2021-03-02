/* global sinaDefine */
sinaDefine(['../core/core', './SinaObject'], function (core, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                group: {
                    required: true
                },
                attribute: {
                    required: true
                },
                nameInGroup: {
                    required: true
                }
            }
        }
    });
});
