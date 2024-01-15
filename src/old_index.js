import initialProperties from "./legacy/initial-properties.js";
import template from "./template.html";
import definition from "./legacy/definition.js";
import controller from "./legacy/controller.js";
import paint from "./legacy/paint.js";
import resize from "./legacy/resize.js";
import support from "./legacy/support.js";
import { initVarianceCube } from "./legacy/dataset.js";

export default {
  initialProperties: initialProperties,
  template: template,
  support: support,
  definition: definition,
  controller: controller,
  paint: paint,
  resize: resize,
  setSnapshotData: async function (snapshotLayout) {
    snapshotLayout.snapshotData.varianceCube = await initVarianceCube(
      this,
      snapshotLayout
    );
    return snapshotLayout;
  },
  clearSelectedValues() {
    this.$scope.chartBrush.clear();
  },
};
