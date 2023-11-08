import ThemeManager from './theme';
import { interactionsSetup } from './interactions.js';

export default function (element, layout, direction, isInteractable, ds) {
  let labels = {
    startvalue: layout.labelsshow ? "Start Value" : layout.startName,
    endvalue: layout.labelsshow ? "End Value" : layout.endName,
    negative: layout.labelsshow ? "Negative Variance" : layout.negName,
    positive: layout.labelsshow ? "Positive Variance" : layout.posName
  };

  let colors = {
    startvalue: layout.color.auto
      ? ThemeManager.colorOther(2)
      : ThemeManager.colorFromPicker(layout.color.subtotal.paletteColor),
    endvalue: layout.color.auto
      ? ThemeManager.colorOther(2)
      : ThemeManager.colorFromPicker(layout.color.subtotalEnd.paletteColor),
    negative: layout.color.auto
      ? ThemeManager.colorFromSeq(1)
      : ThemeManager.colorFromPicker(layout.color.negativeValue.paletteColor),
    positive: layout.color.auto
      ? ThemeManager.colorFromSeq(0)
      : ThemeManager.colorFromPicker(layout.color.positiveValue.paletteColor)
  };

  let ltr = true;
  let dockLeft = 'left';
  let dockRight = 'right';
  if (direction === 'rtl') {
    ltr = false;
    dockLeft = 'right';
    dockRight = 'left';
  }

  const shouldUseFormat = (measureInfo) => !measureInfo.isCustomFormatted && (measureInfo.qIsAutoFormat || measureInfo.qNumFormat.qType === 'U');

  const setFormatCell = (cell, field) => {
    const measureInfo = ds.field(field).raw();
    const formatter = ds.field(field).formatter();
    const useFormatter = shouldUseFormat(measureInfo);
    const formatCell = (cell) => (cell.qNum === 'NaN' ? '-' : formatter(cell.qText));
    return (useFormatter ? formatCell(cell) : cell.qText);
  };
  
  const startLabelFn = (cell) => {
    const field = 'qMeasureInfo/1';
    return setFormatCell(cell, field);
  };

  const endLabelFn = (cell) => {
    const field = 'qMeasureInfo/0';
    return setFormatCell(cell, field);
  };

  return {
    interactions: (!isInteractable ? [] : interactionsSetup()),
    scales: {
      v: {
        data: {
          fields: ['qMeasureInfo/0', 'qMeasureInfo/1']
        },
        type: 'linear',
        invert: true,
        expand: 0.01,
        min: !layout.measureAxis.autoMinMax
          && (layout.measureAxis.minMax == 'min' || layout.measureAxis.minMax == 'minMax')
          ? layout.measureAxis.min : NaN,
        max: !layout.measureAxis.autoMinMax
          && (layout.measureAxis.minMax == 'max' || layout.measureAxis.minMax == 'minMax')
          ? layout.measureAxis.max : NaN,
        include: [0],
        spacing: 0.5,
        ticks: {
          distance: layout.measureAxis.spacing * 150
        },
        minorTicks: {
          count: 1
        }
      },
      t: {
        data: {
          extract: {
            field: 'qDimensionInfo/0'
          }
        },
        type: 'band',
        invert: !ltr,
        padding: 0.2
      }
    },
    components: [{
      type: 'text',
      show: (layout.measureAxis.show != 'none'
        && layout.measureAxis.show != 'labels'
        && layout.measureAxis.title != ""),
      text: layout.measureAxis.title,
      layout: {
        dock: layout.measureAxis.dock === 'near' ? dockLeft : dockRight,
        displayOrder: 1
      },
      style: {
        text: {
          fontSize: "13px",
          fontFamily: ThemeManager.getPicassoTheme()['$font-family'],
        }
      },
    },
    {
      type: 'text',
      show: (layout.dimensionAxis.show != 'none' && layout.dimensionAxis.show != 'labels'),
      text: layout.qHyperCube.qDimensionInfo[0].qFallbackTitle,
      layout: {
        dock: layout.dimensionAxis.dock === 'near' ? 'bottom' : 'top',
        displayOrder: 1
      },
      style: {
        text: {
          fontSize: "13px",
          fontFamily: ThemeManager.getPicassoTheme()['$font-family']
        }
      },
    },
    {
      type: 'axis',
      key: 'xaxis',
      scale: 't',
      layout: {
        dock: layout.dimensionAxis.dock === 'near' ? 'bottom' : 'top',
        displayOrder: 0
      },
      brush: {
        trigger: (!isInteractable ? [] : [{
          on: 'tap',
          contexts: ['highlight'],
          globalPropagation: 'stop',
          propagation: 'stop'
        }])
      },
      settings: {
        labels: {
          show: (layout.dimensionAxis.show != 'none' && layout.dimensionAxis.show != 'title'),
          mode: layout.dimensionAxis.label,
          tiltAngle: ltr ? 40 : -40
        },
        ticks: {
          show: true,
        },
        line: {
          show: true,
        },
      }
    },
    {
      type: 'axis',
      scale: 'v',
      layout: {
        dock: layout.measureAxis.dock === 'near' ? dockLeft : dockRight,
        displayOrder: 0
      },
      settings: {
        labels: {
          show: (layout.measureAxis.show != 'none' && layout.measureAxis.show != 'title'),
          mode: layout.measureAxis.label,
        },
        ticks: {
          show: (layout.measureAxis.show != 'none' && layout.measureAxis.show != 'title'),
        },
        minorTicks: {
          /* Toggle minor-ticks on/off */
          show: true, // Optional
          /* Size of the ticks in pixels. */
          tickSize: 3, // Optional
          /* Space in pixels between the ticks and the line. */
          margin: 0, // Optional
        },
        line: {
          show: true,
        },
      }
    },
    {
      type: 'box',
      key: 'bars',
      layout: {
        displayOrder: 1
      },
      data: { 
        extract: {
          field: 'qDimensionInfo/0',
          props: {
            start: {
              field: 'qMeasureInfo/0',
              label: startLabelFn
            },
            end: {
              field: 'qMeasureInfo/1',
              label: endLabelFn
            },
            var: {
              field: 'qMeasureInfo/2',
              label: endLabelFn
            }
          }
        }
      },
      brush: {
        trigger: (!isInteractable ? [] : [{
          on: 'tap',
          contexts: ['highlight'],
          globalPropagation: 'stop',
          propagation: 'stop'
        }]),
        consume: [{
          context: 'highlight',
          filter: function (d) {
            return d.data.value >= -2;
          },
          style: {
            inactive: {
              opacity: 0.3
            }
          }
        }]
      },
      settings: {
        major: {
          scale: 't'
        },
        minor: {
          scale: 'v'
        },
        orientation: 'vertical',
        box: {
          width: 1,
          minHeightPx: 2,
          fill: function (d) {
            if (d.datum.value === -4) {
              return colors.startvalue;
            } else if (d.datum.value === -5) {
              return colors.endvalue;
            } else {
              if (d.datum.var.value < 0) {
                return colors.negative;
              } else {
                return colors.positive;
              }
            }
          }
        }
      }
    },
    {
      key: 'p',
      type: 'point',
      data: {
        extract: {
          field: 'qDimensionInfo/0',
          props: {
            mm: {
              field: 'qMeasureInfo/1'
            },
          }
        }
      },
      settings: {
        x: {
          scale: 't',
          fn: function (d) {
            if (ltr) {
              return d.scale(d.datum.value)
                + (d.scale.bandwidth())
                + ((d.scale.step() - d.scale.bandwidth()) / 2);
            } else {
              return d.scale(d.datum.value) - ((d.scale.step() - d.scale.bandwidth()) / 2);
            }
          }
        },
        y: {
          scale: 'v',
          ref: 'mm'
        },
        opacity: function (d) {
          if (d.datum.value === d.data.items[d.data.items.length - 1].value) {
            return 0;
          } else {
            return 1;
          }
        },
        size: function (d) {
          if (d.datum.value === d.data.items[d.data.items.length - 1].value) {
            return 0;
          } else {
            return d.scale.step();
          }
        },
        fill: "none",
        shape: "line",
        stroke: "#7b7a78",
        /*function(d) {
          return ThemeManager.colorFromTheme(14);
        },*/
        strokeDasharray: "4 4",
        strokeWidth: 1,
        sizeLimits: {
          maxRelExtent: 1,
        }
      }
    },
    {
      type: 'grid-line',
      show: (layout.gridlines.auto || layout.gridlines.spacing > 0),
      y: {
        scale: 'v'
      },
      ticks: {
        show: (layout.gridlines.auto || layout.gridlines.spacing > 1),
        strokeWidth: 1,
      },
      minorTicks: {
        show: (!layout.gridlines.auto && layout.gridlines.spacing > 2),
        strokeWidth: 1
      }
    },
    {
      type: 'labels',
      show: layout.dataPoint.showLabels,
      layout: {
        displayOrder: 2 // must be larger than the displayOrder for the 'bars' component
      },
      settings: {
        sources: [{
          component: 'bars',
          selector: 'rect', // select all 'rect' shapes from the 'bars' component
          strategy: {
            type: 'bar', // the strategy type
            settings: {
              direction: function ({
                data
              }) { // data argument is the data bound to the shape in the referenced component
                return data && data.end.value > data.start.value ? 'up' : 'down';
              },
              fontSize: 12,
              align: 0.5,
              justify: 1,
              labels: [{
                label({
                  data
                }) {
                  return data ? data.end.label : '';
                },
                placements: [ // label placements in prio order. Label will be placed in the first place it fits into
                  {
                    position: 'inside',
                    fill: '#fff',
                    align: 0.5,
                    justify: 0.98,
                  },
                  {
                    position: 'outside',
                    fill: '#666',
                    align: 0.5,
                    justify: 0.01,
                  },
                  {
                    position: 'opposite',
                    fill: '#666',
                    align: 0.5,
                    justify: 0.01,
                  }
                ]
              }]
            }
          }
        }]
      }
    },
    {
      scale: {
        type: 'categorical-color',
        data: [labels.startvalue, labels.positive, labels.negative, labels.endvalue],
        range: [colors.startvalue, colors.positive, colors.negative, colors.endvalue]
      },
      key: 'legend',
      type: 'legend-cat',
      show: layout.legend.show,
      layout: {
        dock: layout.legend.dock === "auto" ? "top" : layout.legend.dock,
        displayOrder: 2
      },
      mounted() {
        const nextEl = element.querySelector('[data-component-key=legend][data-action=next]');
        if (nextEl) {
          nextEl.addEventListener('click', () => this.emit('next'));
        }
        const prevEl = element.querySelector('[data-component-key=legend][data-action=prev]');
        if (prevEl) {
          prevEl.addEventListener('click', () => this.emit('prev'));
        }
      },
      settings: {
        layout: { // Optional
          /* Maximum number of columns (vertical) or rows (horizontal) */
          size: 1, // Optional
          /* Layout direction. Either `'ltr'` or `'rtl'` */
          direction: direction, // Optional
          /* Initial scroll offset */
          scrollOffset: 0, // Optional
        },
        /* Settings applied per item */
        item: { // Optional
          /* Whether to show the current item */
          show: true, // Optional
          label: { // Optional
            /* Word break rule, how to apply line break if label text overflows its maxWidth property. Either `'break-word'` or `'break-all'` */
            wordBreak: 'none', // Optional
            /* Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak) */
            maxLines: 2, // Optional
            /* Maximum width of label, in px */
            maxWidth: 136, // Optional
          },
          shape: { // Optional
            type: 'square', // Optional
            size: 12, // Optional
          },
        },
        navigation: {
          button: {
            class: { 'lui-fade-button': true },
            content: (h, state) => {
              return h('span', {
                'class': `lui-icon lui-icon--triangle-${state.direction}`
              });
            }
          }
        }
      }
    },
    {
      key: 'rangex',
      layout: {
        displayOrder: 5
      },
      type: 'brush-range',
      settings: {
        brush: 'highlight',
        direction: 'horizontal',
        scale: 't',
        target: {
          component: 'xaxis'
        },
        bubbles: {
          align: 'start'
        },
      }
    },
    {
      key: 'tooltip',
      layout: {
        displayOrder: 6
      },
      type: 'tooltip',
      settings: {
        filter: nodes => nodes.filter(node => node.key === 'bars'),
        extract: ({ node }) => node.data.var.label,
        content: ({ h, data }) => h('div', {}, data),
        afterShow({ element }) {
          element.children[0].style.opacity = 1;
          element.children[1].style.opacity = 1;
        },
        onHide({ element }) {
          element.children[0].style.opacity = 0;
          element.children[1].style.opacity = 0;
        },
        placement: {
          type: 'pointer',
          area: 'target'
        }
      },
      style: {
        content: {
          backgroundColor: 'rgba(64, 64, 64, 0.8)',
          opacity: 0,
          transition: 'opacity 50ms ease-in'
        },
        arrow: {
          color: 'rgba(64, 64, 64, 0.8)',
          opacity: 0,
          transition: 'opacity 50ms ease-in'
        }
      }
    }]
  };
}
