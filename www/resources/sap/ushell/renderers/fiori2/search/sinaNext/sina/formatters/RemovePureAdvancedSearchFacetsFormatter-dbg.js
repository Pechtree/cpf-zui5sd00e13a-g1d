/* global sinaDefine */
sinaDefine(['../../core/core', './Formatter', '../../core/util'], function (core, Formatter, util) {
    "use strict";

    return Formatter.derive({

        initAsync: function () {},
        format: function (resultSet) {
            return util.removePureAdvancedSearchFacets(resultSet);
        },
        formatAsync: function (resultSet) {
            resultSet = util.removePureAdvancedSearchFacets(resultSet); //find emails phone nrs etc and augment attribute if required
            return core.Promise.resolve(resultSet);
        }

    });

});
