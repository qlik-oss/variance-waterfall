import ConvertHypercube from "./converthypercube";
import picasso from 'picasso.js';
import pq from 'picasso-plugin-q';
import picassoHammer from 'picasso-plugin-hammer';

import bridgepicassospec from "./bridgepicassospec";
import ThemeManager from './theme';

import { enableSelectionOnFirstDimension } from './interactions.js';

var qlik = window.require('qlik');

export default ['$scope', '$element', function($scope, $element) {
  $scope.qlik = qlik;
  $scope.theme = null;
  $scope.updated = false;

  $scope.app = qlik.currApp(this);

  picasso.use(pq);
  picasso.use(picassoHammer);

  $scope.pic = picasso({
    renderer: {
      prio: ['canvas']
    },
    logger: { // experimental
      level: 4
    },
    style: ThemeManager.getPicassoTheme()
  });

  $scope.chart = $scope.pic.chart({
    element: $element.find('.lrp')[0],
    updated: () => {
      $scope.updated = true;
    },
    beforeUpdated: () => {
      $scope.updated = false;
    }
  });

  $scope.chartBrush
    = enableSelectionOnFirstDimension($scope, $scope.chart, 'highlight', $scope.layout);
  $scope.updatedData = function(layout, mode, dataUpdate) {
    let up = {};

    if (dataUpdate) {
      up.data = [{
        type: 'q',
        key: 'qHyperCube',
        data: ConvertHypercube.convertHypercube($scope.layout.qHyperCube)
      }];
    }

    const isEditMode = mode === 'edit';
    if (isEditMode || typeof $scope.chart.settings === 'undefined') {
      up.settings = bridgepicassospec(layout, $scope.$parent.options.direction, isEditMode);
    }

    $scope.chart.update(up);
  };
}];
