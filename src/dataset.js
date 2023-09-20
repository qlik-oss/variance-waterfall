import ConvertHypercube from "./converthypercube";
import qlik from "qlik";

function createCube(definition, app) {
  return new Promise((resolve) => {
    app.createCube(definition, resolve);
  });
}

export async function initVarianceCube(component, layout) {
  if (component.backendApi.isSnapshot) {
    return layout.snapshotData.varianceCube;
  }

  const app = qlik.currApp(component);
  const properties = await component.backendApi.getProperties();

  // If this is a master object, fetch the hyperCubeDef of the original object
  let hyperCubeDef = properties.qExtendsId
    ? (await app.getObjectProperties(properties.qExtendsId)).properties.qHyperCubeDef
    : properties.qHyperCubeDef;
  hyperCubeDef = JSON.parse(JSON.stringify(hyperCubeDef));
  hyperCubeDef.qStateName = layout.qStateName;

  const measures = hyperCubeDef.qMeasures;
  let expression;
  if (
    JSON.stringify(measures[0].qDef.qNumFormat) === JSON.stringify(measures[1].qDef.qNumFormat)
    && measures[0].qDef.qNumFormat
  ) {
    let formatter;
    switch (measures[0].qDef.qNumFormat.qType) {
      case "D":
        formatter = "Date";
        break;
      case "IV":
        formatter = "Interval";
        break;
      default:
        formatter = "Num";
        break;
    }

    // Measures are using the same format, so use that
    expression = `${formatter}(Column(2) - Column(1), '${measures[0].qDef.qNumFormat.qFmt}')`;
  } else {
    // Measures aren't using the same format, so use default
    expression = "Column(2) - Column(1)";
  }

  if (
    !measures[0].qAttributeExpressions || measures[0].qAttributeExpressions.length === 0 
    || measures[0].qAttributeExpressions[0].qExpression !== expression
  ) {
    // Update properties with the new expression
    hyperCubeDef.qMeasures[0].qAttributeExpressions = [
      { qAttribute: true, qExpression: expression, qLibraryId: "" },
    ];
  }

  const cubeModel = await createCube(hyperCubeDef, app);
  const varianceCube = ConvertHypercube.convertHypercube(cubeModel.qHyperCube);
  app.destroySessionObject(cubeModel.qInfo.qId);
  return varianceCube;
}
