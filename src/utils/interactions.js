import pq from "picasso-plugin-q";

var interactionsSetup = function () {
  "use strict";
  let rangeRef = "rangex";
  var interactions = [
    {
      type: "hammer",
      gestures: [
        {
          type: "Pan",
          options: {
            event: "range",
            direction: 2 | 4,
          },
          events: {
            rangestart: function (e) {
              if (typeof this.chart.component(rangeRef) != "undefined") {
                this.chart.component(rangeRef).emit("rangeStart", e);
              }
            },
            rangemove: function (e) {
              if (typeof this.chart.component(rangeRef) != "undefined") {
                this.chart.component(rangeRef).emit("rangeMove", e);
              }
            },
            rangeend: function (e) {
              if (typeof this.chart.component(rangeRef) != "undefined") {
                this.chart.component(rangeRef).emit("rangeEnd", e);
              }
            },
          },
        },
      ],
    },
    {
      type: "native",
      events: {
        mousemove: function (e) {
          const tooltip = this.chart.component("tooltip");
          tooltip.emit("show", e);
        },
        mouseleave: function (e) {
          const tooltip = this.chart.component("tooltip");
          tooltip.emit("hide");
        },
      },
    },
  ];

  return interactions;
};

var enableSelectionOnFirstDimension = function (selections, chart, brush) {
  var chartBrush = chart.brush(brush);

  chartBrush.on("start", (x) => {});
  chartBrush.on("update", (added, removed) => {
    var selection = pq.selections(chartBrush)[0];

    if (selection.method === "resetMadeSelections") {
      chartBrush.end();
      selections.clear();
    } else if (selection.method === "selectHyperCubeValues") {
      let addedvals = [];
      let removedvals = [];
      if (added.length > 0) {
        addedvals = added[0].values.filter((i) => i > -2);
      }
      if (removed.length > 0) {
        removedvals = removed[0].values.filter((i) => i > -2);
      }
      let list = addedvals.concat(removedvals);
      if (list.length !== 0) {
        selections.select(selection.params[1], list, true); // needs correct params
      }
    } else if (selection.method === "rangeSelectHyperCubeValues") {
      if (chartBrush.isActive) {
        selections, select(/*Range*/ selection.params[1], true); // needs correct params
      }
    }
  });
  return chartBrush;
};

export { interactionsSetup, enableSelectionOnFirstDimension };
