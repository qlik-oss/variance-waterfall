import picasso from 'picasso.js';
import pq from 'picasso-plugin-q';
import picassoHammer from 'picasso-plugin-hammer';

import bridgepicassospec from "./bridgepicassospec";
import ThemeManager from './theme';

import { initVarianceCube } from './dataset';
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
  $scope.updatedData = async function(layout, isEditMode, dataUpdate) {
    let up = {};

    if (dataUpdate) {
      up.data = [{
        type: 'q',
        key: 'qHyperCube',
        data: await initVarianceCube($scope, layout)
      }];
    }

    if (isEditMode || typeof $scope.chart.settings === 'undefined') {
      up.settings = bridgepicassospec(
        $scope.chart.element,
        layout,
        $scope.$parent.options.direction,
        !isEditMode && !$scope.backendApi.isSnapshot && !layout.qHyperCube.qDimensionInfo[0].qLocked);
    }

    $scope.chart.update(up);
  };
}];
