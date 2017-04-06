/*!
 * @(#)homeCtrl.js
 * @author: Diego Guevara <diegoguevara.github.io>
 * Home View Controller
 */

/* global, appControllers */

'use strict';

/**
 * 
 * @controller home_index_ctrl
 * @param  {object}     $scope              {@link https://docs.angularjs.org/guide/scope}
 * @param  {object}     RestfulResources    {@link appModels}
 */
appControllers.controller(
    'home_index_ctrl',
    ['$scope', 'RestfulResources',
    function ($scope, RestfulResources) {

        $scope.brand_list = [];
        $scope.model_list = null;
        $scope.reference_list = null;

        $scope.selected_brand = '';
        $scope.selected_model = '';
        $scope.selected_reference = '';

        $scope.medata = {};

        $scope.fields_data = {};
        $scope.form_data = {};

        $scope.show_result = false;
        $scope.show_form = false;

        $scope.propertyName = 'companyName';
        $scope.reverse = false;

        $scope.compare_result = null;


        $scope.getVehicles = () => {
            RestfulResources.Vehicles.get({ }, function (data_) {
                let brand_array = _.find( data_.fields, { id : 'brand'});
                $scope.brand_list = brand_array.values;
            });
        }

        $scope.getVehicles();


        $scope.getModels = () => {
            $scope.model_list = null;
            $scope.reference_list = null;
            $scope.selected_model = '';
            $scope.selected_reference = '';
            $scope.show_result = false;
            $scope.show_form = false;

            if( !$scope.selected_brand ) return;

            RestfulResources.Models.query({ brand : $scope.selected_brand }, function (data_) {
                $scope.model_list = data_;
            });
        }

        $scope.getReferences = () => {
            $scope.reference_list = null;
            $scope.selected_reference = '';
            $scope.show_result = false;
            $scope.show_form = false;
            
            if( !$scope.selected_model ) return;

            RestfulResources.References.query({ brand : $scope.selected_brand, model : $scope.selected_model }, function (data_) {
                $scope.reference_list = data_;
            });
        }


        $scope.search = () => {

            RestfulResources.Search.save(
                { 
                    brand : $scope.selected_brand,
                    modelYear: $scope.selected_model,
                    model : $scope.selected_reference,
                    platform:"computer",
                    referrer:"Direct",

                }, function (data_) {
                $scope.getMeData();
                $scope.show_form = true;
                $scope.getFormData();
            });
        }

        $scope.getMeData = () => {
            RestfulResources.MeData.get({ }, function (data_) {
                $scope.medata = data_;
            });
        }


        $scope.getFormData = () => {
            RestfulResources.FormData.get({ }, function (data_) {
                $scope.fields_data = data_;
            });
        }

        $scope.onSubmit = () => {
            RestfulResources.FormData.save($scope.form_data, function (data_) {
                $scope.getMeData();
                $scope.compare();
            });
        }

        $scope.compare = () => {
            RestfulResources.Compare.save({}, function (data_) {
                console.log(data_);
                $scope.show_result = true;
                $scope.compare_result = data_.quotes;
                $scope.getMeData();
                $('[data-toggle="tooltip"]').tooltip();
            });
        }

        
    }
]);