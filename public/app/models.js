/*!
* @(#)models.js
* @author: Diego Guevara <diegoguevara.github.io>
* Rest Api Service factory
* Configurcion de conexion a recursos restful del Backend
*/

/* global appModels */

/**
 * Rest Api service access
 * @factory
 * @param {object} $resource Angularjs $resource object
 */
appModels.factory('RestfulResources', ['$resource',
    function ($resource) {
        return {
            
            Vehicles : $resource('/api/leads/page/0'),
            Models : $resource('/api/leads/choices/year/:brand', { brand: '@brand' }),
            References : $resource('/api/leads/choices/model/:brand/:model', { brand: '@brand', model : '@model' }),
            
            Search : $resource('/api/leads/page/0'),

            MeData : $resource('/api/leads/me'),

            FormData : $resource('/api/leads/page/1'),

            Compare : $resource('/api/leads/compare')
        };
    }
]);