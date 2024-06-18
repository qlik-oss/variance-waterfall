export default function ($element, layout) {
  // eslint-disable-next-line no-underscore-dangle
  if (this._pureLayout !== this.backendApi.model.pureLayout) {
    return this.paint($element, layout);
  }
  let isEditMode = this.$scope.options.interactionState === 2;
  this.$scope.updatedData(layout, isEditMode, false);
  return this.$scope.qlik.Promise.resolve();
}
