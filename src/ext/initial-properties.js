// TODO: Fill in the rest of the json spec
export default {
  /**
   * Current version of this generic object definition
   * @type {string}
   */
  version: process.env.PACKAGE_VERSION,
  /**
   * @typedef
   */
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [
      {
        qWidth: 3,
        qHeight: 1000,
      },
    ],
  },
  /**
   * @type {boolean=}
   */
  showTitles: false,
  /**
   * @type {string=}
   */
  title: "",
  /**
   * @type {string=}
   */
  subtitle: "",
  /**
   * @type {string=}
   */
  footnote: "",
  /**
   * @type {boolean=}
   */
  disableNavMenu: false,
  /**
   * @type {boolean=}
   */
  showDetails: true,
  /**
   * @type {boolean=}
   */
  showDetailsExpression: false,
  gridlines: {
    auto: true,
    spacing: 2,
  },
  dataPoint: {
    showLabels: true,
  },
  labelsshow: true,
  startName: "Start value",
  endName: "End value",
  posName: "Positive variance",
  negName: "Negative variance",
  color: {
    auto: true,
    positiveValue: {
      paletteColor: {
        index: -1,
        color: "#4477aa",
      },
    },
    negativeValue: {
      paletteColor: {
        index: -1,
        color: "#cc6677",
      },
    },
    subtotal: {
      paletteColor: {
        index: -1,
        color: "#c3c3c3",
      },
    },
    subtotalEnd: {
      paletteColor: {
        index: -1,
        color: "#c3c3c3",
      },
    },
  },
  legend: {
    show: true,
    dock: "auto",
  },
  measureAxis: {
    show: "all",
    dock: "near",
    spacing: 1,
    autoMinMax: true,
    minMax: "min",
    min: 0,
    max: 10,
    title: "",
  },
  dimensionAxis: {
    show: "all",
    label: "auto",
    dock: "near",
  },
};
