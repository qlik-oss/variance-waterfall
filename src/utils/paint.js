import ThemeManager from "./theme";

export default async function (layout, component) {
  let isEditMode = component.options.interactionState === 2;
  component.updatedData(layout, isEditMode, true);
  this._pureLayout =
    this.backendApi.model.pureLayout || this.backendApi.model.layout;

  await component.updatedData(layout, isEditMode, true);
}
