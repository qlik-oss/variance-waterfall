import ThemeManager from "./theme";

export default function ($element, layout) {
  let app = this.$scope.qlik.currApp(this);
  let isEditMode = this.$scope.options.interactionState === 2;
  this.$scope.updatedData(layout, isEditMode, true);
  this._pureLayout = this.backendApi.model.pureLayout || this.backendApi.model.layout;
  return app.theme.getApplied().then(async (qTheme) => {
    this.$scope.theme = qTheme;
    ThemeManager.setAppTheme(this.$scope.theme);
    await this.$scope.updatedData(layout, isEditMode, true);
    return this.$scope.qlik.Promise.resolve();
  });
}
