import {
  useElement,
  useStaleLayout,
  usePromise,
  useSelections,
  useApp,
  //useTheme,
  useModel,
} from "@nebula.js/stardust";
import definition from "./ext/ext";
import initialProperties from "./ext/initial-properties";
import data from "./utils/data";
import init from "./utils/initialize";
import { useAppLayout } from "@nebula.js/stardust";
import { useInteractionState } from "@nebula.js/stardust";

export default function supernova() {
  return {
    qae: {
      properties: initialProperties,
      data: data(),
    },
    component() {
      const element = useElement();
      const layout = useStaleLayout();
      const selections = useSelections();
      const app = useApp();
      const appLayout = useAppLayout();
      //const theme = useTheme(); // TODO: Check if we should use theme
      const model = useModel();
      const interactions = useInteractionState();

      //TODO: Need to check that this setup returns correct in printing
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
          return component.updatedData(layout, interactions?.edit, true);
        }
      }, [element, layout, selections, app, appLayout, model]);
    },
    ext: definition(),
  };
}
