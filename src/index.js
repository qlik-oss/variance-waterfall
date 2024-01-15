import {
  useElement,
  useStaleLayout,
  usePromise,
  useSelections,
  useApp,
  useTheme,
  useModel,
} from "@nebula.js/stardust";
import definition from "./ext/ext";
import initialProperties from "./ext/initial-properties";
import data from "./utils/data";
//import resize from "./legacy/resize.js";
//import { initVarianceCube } from "./legacy/dataset.js";
import init from "./utils/initialize";
import { useAppLayout } from "@nebula.js/stardust";
import { useInteractionState } from "@nebula.js/stardust";

/* OLD Root */
/*
export const thing = {
  resize: resize, // Don't think we need this, but if we do there is a useRect hook from Nebula that triggers on resize
  setSnapshotData: async function (snapshotLayout) {
    // should be replaced with onTakeSnapshot from stardust
    snapshotLayout.snapshotData.varianceCube = await initVarianceCube(
      this,
      snapshotLayout
    );
    return snapshotLayout;
  },
  clearSelectedValues() {
    // Dunno what this is
    this.$scope.chartBrush.clear();
  },
};*/

export default function supernova() {
  return {
    qae: {
      properties: initialProperties,
      data: data(),
    },
    component() {
      const element = useElement();
      // old element: <div class="lrp" id="container" style="height:100%;position:relative;"></div>

      const layout = useStaleLayout();
      const selections = useSelections();
      const app = useApp();
      const appLayout = useAppLayout();
      const theme = useTheme();
      const model = useModel();
      const interactions = useInteractionState();

      usePromise(() => {
        if (app && appLayout && model && selections && element) {
          const component = init({
            element,
            layout,
            app,
            appLayout,
            model,
            selections,
            options: { direction: "rtl" }, // Not sure if this is correct
          });

          /*{
            beginSelections: (root) => {
              if (!selections.isActive()) {
                selections.begin("/qHyperCubeDef");
                if (root) {
                  root.classList.toggle("in-selections");
                }
              }
            },
            selectValues: (dim, values, toggle) => {
              selections.select({
                method: "selectHyperCubeValues",
                params: ["/qHyperCubeDef", dim, values, toggle],
              });
            },
          };*/
          return component.updatedData(layout, interactions?.edit, true);
        }
      }, [element, layout, selections, app, appLayout, model]);
    },
    ext: definition(),
  };
}
