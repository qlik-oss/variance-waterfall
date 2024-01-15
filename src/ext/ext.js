export default function ext(env) {
  var colorsAndLegend = {
    translation: "properties.colorsAndLegend",
    type: "items",
    grouped: true,
    items: {
      colors: {
        type: "items",
        items: {
          autoColor: {
            ref: "color.auto",
            type: "boolean",
            translation: "properties.colors",
            component: "switch",
            defaultValue: true,
            options: [
              {
                value: true,
                translation: "Common.Auto",
              },
              {
                value: false,
                translation: "Common.Custom",
              },
            ],
          },
          positiveValueColor: {
            ref: "color.positiveValue.paletteColor",
            translation: "properties.waterfall.color.positiveValueColor",
            type: "object",
            component: "color-picker",
            dualOutput: true,
            defaultValue: {
              index: -1,
              color: "#4477aa",
            },
            show: (a) => !a.color.auto,
          },
          negativeValueColor: {
            ref: "color.negativeValue.paletteColor",
            translation: "properties.waterfall.color.negativeValueColor",
            type: "object",
            component: "color-picker",
            dualOutput: true,
            defaultValue: {
              index: -1,
              color: "#cc6677",
            },
            show: (a) => !a.color.auto,
          },
          subtotalColor: {
            ref: "color.subtotal.paletteColor",
            label: "Start value color",
            type: "object",
            component: "color-picker",
            dualOutput: true,
            defaultValue: {
              index: -1,
              color: "#c3c3c3",
            },
            show: (a) => !a.color.auto,
          },
          subtotalEndColor: {
            ref: "color.subtotalEnd.paletteColor",
            label: "End value color",
            type: "object",
            component: "color-picker",
            dualOutput: true,
            defaultValue: {
              index: -1,
              color: "#c3c3c3",
            },
            show: (a) => !a.color.auto,
          },
        },
      },
      legend: {
        type: "items",
        items: {
          show: {
            ref: "legend.show",
            type: "boolean",
            translation: "properties.legend.show",
            component: "switch",
            defaultValue: true,
            options: [
              {
                value: true,
                translation: "Common.Auto",
              },
              {
                value: false,
                translation: "properties.off",
              },
            ],
          },
          dock: {
            type: "string",
            component: "dropdown",
            ref: "legend.dock",
            translation: "properties.legend.position",
            options: [
              {
                value: "auto",
                translation: "Common.Auto",
              },
              {
                value: "right",
                translation: "properties.dock.right",
              },
              {
                value: "bottom",
                translation: "Common.Bottom",
              },
              {
                value: "left",
                translation: "properties.dock.left",
              },
              {
                value: "top",
                translation: "Common.Top",
              },
            ],
            defaultValue: "auto",
            show: (a) => a.legend.show,
          },
        },
      },
    },
  };

  var s = {
    type: "items",
    translation: "properties.presentation",
    grouped: true,
    items: {
      gridLines: {
        type: "items",
        snapshot: {
          tid: "property-gridLines",
        },
        items: {
          showGridLines: {
            ref: "gridlines.auto",
            type: "boolean",
            translation: "properties.gridLine.spacing",
            component: "switch",
            defaultValue: true,
            options: [
              {
                value: true,
                translation: "Common.Auto",
              },
              {
                value: false,
                translation: "Common.Custom",
              },
            ],
          },
          gridSpacing: {
            ref: "gridlines.spacing",
            type: "number",
            component: "dropdown",
            defaultValue: 2,
            options: [
              {
                value: 0,
                translation: "properties.gridLine.noLines",
              },
              {
                value: 2,
                translation: "properties.gridLine.medium",
              },
              {
                value: 3,
                translation: "properties.gridLine.narrow",
              },
            ],
            show: function e(t) {
              return t.gridlines && !t.gridlines.auto;
            },
          },
        },
      },
      showLabels: {
        ref: "dataPoint.showLabels",
        type: "boolean",
        translation: "properties.dataPoints.labelmode",
        component: "switch",
        defaultValue: true,
        options: [
          {
            value: true,
            translation: "Common.Auto",
          },
          {
            value: false,
            translation: "properties.off",
          },
        ],
        snapshot: {
          tid: "property-dataPoints",
        },
      },
      names: {
        type: "items",
        items: {
          showLabels: {
            ref: "labelsshow",
            type: "boolean",
            label: "Labels",
            component: "switch",
            defaultValue: true,
            options: [
              {
                value: true,
                translation: "Common.Auto",
              },
              {
                value: false,
                translation: "Common.Custom",
              },
            ],
          },
          startName: {
            ref: "startName",
            type: "string",
            label: "Start value label",
            expression: "optional",
            defaultValue: "Start value",
            show: function e(t) {
              return !t.labelsshow;
            },
          },
          endName: {
            ref: "endName",
            type: "string",
            label: "End value label",
            expression: "optional",
            defaultValue: "End value",
            show: function e(t) {
              return !t.labelsshow;
            },
          },
          posName: {
            ref: "posName",
            type: "string",
            label: "Positive label",
            expression: "optional",
            defaultValue: "Positive variance",
            show: function e(t) {
              return !t.labelsshow;
            },
          },
          negName: {
            ref: "negName",
            type: "string",
            label: "Negative label",
            expression: "optional",
            defaultValue: "Negative variance",
            show: function e(t) {
              return !t.labelsshow;
            },
          },
        },
      },
    },
  };

  var u = {
    uses: "axis.picasso.measureAxis",
    label: "Y-axis",
    items: {
      title: {
        ref: "measureAxis.title",
        type: "string",
        label: "Axis title",
        defaultValue: "",
        expression: "optional",
      },
    },
  };

  var c = {
    uses: "axis.picasso.dimensionAxis",
  };

  var d = {
    type: "items",
    component: "expandable-items",
    translation: "properties.addons",
    items: {
      dataHandling: {
        uses: "dataHandling",
        items: {
          suppressZero: null,
          calcCond: {
            uses: "calcCond",
          },
        },
      },
    },
  };

  let about = {
    component: "items",
    label: "About",
    items: {
      header: {
        label: "Variance waterfall",
        style: "header",
        component: "text",
      },
      paragraph1: {
        label: `Variance waterfall is a Qlik Sense chart used for displaying variance between two
          metrics, walking through a set of dimension values.`,
        component: "text",
      },
      paragraph2: {
        label:
          "Variance waterfall is based upon an extension created by Steven Pressland.",
        component: "text",
      },
    },
  };

  return {
    support: {
      snapshot: true,
      export: true,
      exportData: true,
      viewData: true,
    },
    definition: {
      type: "items",
      component: "accordion",
      items: {
        data: {
          uses: "data",
          items: {
            dimensions: {
              min: 1,
              max: 1,
              disabledRef: "",
              description: () => {
                return "Bridge dimension";
              },
            },
            measures: {
              uses: "measures",
              min: 2,
              max: 2,
              disabledRef: "",
              description: (a, b) => {
                return ["Start value", "End value"][b];
              },
            },
          },
        },
        sorting: {
          uses: "sorting",
        },
        addons: d,
        settings: {
          uses: "settings",
          items: {
            presentation: s,
            colors: colorsAndLegend,
            measureAxis: u,
            dimensionAxis: c,
          },
        },
        about,
      },
    },
  };
}
