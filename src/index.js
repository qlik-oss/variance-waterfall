import initialProperties from "./initial-properties.js";
import template from "./template.html";
import definition from "./definition.js";
import controller from "./controller.js";
import paint from "./paint.js";
import resize from "./resize.js";
import support from "./support.js";
import { initVarianceCube } from "./dataset";

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
