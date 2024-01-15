import picasso from "picasso.js";
import pq from "picasso-plugin-q";
import picassoHammer from "picasso-plugin-hammer";
import Hammer from "hammerjs";

import bridgepicassospec from "./bridgepicassospec";
import ThemeManager from "./theme";

import { initVarianceCube } from "./dataset_needs_work";
import { enableSelectionOnFirstDimension } from "./interactions";

export default function init({
  element,
  app,
  appLayout,
  model,
  selections,
  options,
}) {
  const localeInfo = appLayout.qLocaleInfo;
  picasso.use(pq);
  picasso.use(picassoHammer(Hammer));
  const pic = picasso({
    renderer: {
      prio: ["canvas"],
    },
    logger: {
      // experimental
      level: 4,
    },
    style: ThemeManager.getPicassoTheme(),
  });
  const chart = pic.chart({
    element,
    updated: () => {
      //$scope.updated = true; // TODO: NEED TO CHECK WHAT THESE ARE FOR?
    },
    beforeUpdated: () => {
      //$scope.updated = false;
    },
  });

  const chartBrush = enableSelectionOnFirstDimension(
    selections,
    chart,
    "highlight"
  );
  const updatedData = async function (layout, isEditMode, dataUpdate) {
    const data = {
      type: "q",
      key: "qHyperCube",
      config: {
        localeInfo,
      },
      data: await initVarianceCube({ layout, app, model }),
    };
    const ds = picasso.data("q")(data);

    let up = {};

    if (dataUpdate) {
      up.data = [data];
    }

    if (isEditMode || typeof chart.settings === "undefined") {
      up.settings = bridgepicassospec(
        chart.element,
        layout,
        options.direction,
        !isEditMode &&
          !layout.snapshotData &&
          !layout.qHyperCube.qDimensionInfo[0].qLocked,
        ds
      );
    }

    chart.update(up);
  };
  return { pic, chart, chartBrush, updatedData };
}
