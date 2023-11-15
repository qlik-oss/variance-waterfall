class ConvertHypercube {
  static convertHypercube(hypercube) {
    let datapage = this.createDataPage(hypercube);

    let nums = datapage.qMatrix.map(r => r[2].qNum);
    let min = Math.min(...nums);
    let max = Math.max(...nums);

    let newHq = {
      qColumnOrder: [],
      qDataPages: [datapage],
      qDimensionInfo: [this.createDimensionInfo(hypercube.qDimensionInfo[0])],
      qEffectiveInterColumnSortOrder: [0, 1, 2],
      qMeasureInfo: [
        this.createMeasureInfo(hypercube.qMeasureInfo[0], min, max),
        this.createMeasureInfo(hypercube.qMeasureInfo[1], min, max),
        this.staticMeasureInfo()
      ],
      qMode: "S",
      qNoOfLeftDims: -1,
      qSize: {
        qcx: 4,
        qcy: hypercube.qSize.qcy + 2
      }
    };

    return newHq;
  }

  static createDimensionInfo(dimInfo) {
    return {
      cId: dimInfo.cId,
      qCardinal: dimInfo.qCardinal + 2,
      qCardinalities: {
        qCardinal: dimInfo.qCardinalities.qCardinal + 2,
        qHypercubeCardinal: dimInfo.qCardinalities.qHypercubeCardinal + 2
      },
      qDimensionType: dimInfo.qDimensionType,
      qFallbackTitle: dimInfo.qFallbackTitle,
      qGroupFallbackTitles: [dimInfo.qFallbackTitle],
      qGroupFieldDefs: [dimInfo.qGroupFieldDefs[0]],
      qGroupPos: 0,
      qGrouping: "N",
      qIsAutoFormat: dimInfo.qIsAutoFormat,
      qMax: dimInfo.qMax,
      qMin: dimInfo.qMin,
      qSortIndicator: dimInfo.qSortIndicator,
      qLocked: dimInfo.qLocked,
      qStateCounts: {
        qAlternative: dimInfo.qStateCounts.qAlternative,
        qDeselected: dimInfo.qStateCounts.qDeselected,
        qExcluded: dimInfo.qStateCounts.qExcluded,
        qLocked: dimInfo.qStateCounts.qLocked,
        qLockedExcluded: dimInfo.qStateCounts.qLockedExcluded,
        qOption: dimInfo.qStateCounts.qOption + 2,
        qSelected: dimInfo.qStateCounts.qSelected,
        qSelectedExcluded: dimInfo.qStateCounts.qSelectedExcluded,
      },
      qTags: dimInfo.qTags.map(i => i)
    };
  }

  static createMeasureInfo(mesInfo, min, max) {
    return {
      autoSort: true,
      cId: mesInfo.cId,
      numFormatFromTemplate: mesInfo.numFormatFromTemplate,
      qApproxMaxGlyphCount: mesInfo.qApproxMaxGlyphCount,
      qAttrDimInfo: mesInfo.qAttrDimInfo.map(i => i),
      qAttrExprInfo: mesInfo.qAttrExprInfo.map(i => i),
      qCardinal: mesInfo.qCardinal,
      qFallbackTitle: mesInfo.qFallbackTitle,
      qMax: max, //mesInfo.qMax,
      qMin: min, //mesInfo.qMin,
      qSortIndicator: mesInfo.qSortIndicator,
      qNumFormat: mesInfo.qNumFormat && {
        qDec: mesInfo.qNumFormat.qDec,
        qFmt: mesInfo.qNumFormat.qFmt,
        qThou: mesInfo.qNumFormat.qThou,
        qType: mesInfo.qNumFormat.qType,
        qUseThou: mesInfo.qNumFormat.qUseThou,
        qnDec: mesInfo.qNumFormat.qnDec,
      }
    };
  }

  static staticMeasureInfo() {
    return {
      qFallbackTitle: 'Variance',
    };
  }

  static createDataPage(hypercube) {
    if (!hypercube.qDataPages) {
      return {};
    }

    let idp = hypercube.qDataPages[0];
    let matrix = this.createMatrix(hypercube);
    let dp = {
      qArea: {
        qHeight: idp.qArea.qHeight + 2,
        qLeft: 0,
        qTop: 0,
        qWidth: 4
      },
      qMatrix: matrix,
      qTails: [{
        qUp: 0,
        qDown: 0
      }]
    };
    return dp;
  }

  static createMatrix(hypercube) {
    let im = hypercube.qDataPages[0].qMatrix;
    let om = im.map((r, ri) => {
      return [{
        qText: r[0].qText,
        qNum: r[0].qNum,
        qElemNumber: r[0].qElemNumber,
        qState: r[0].qState
      },
      {
        qText: "0",
        qNum: 0,
        qElemNumber: r[1].qElemNumber,
        qState: r[1].qState
      },
      {
        qText: r[1].qAttrExps.qValues[0].qText,
        qNum: r[1].qAttrExps.qValues[0].qNum,
        qElemNumber: r[2].qElemNumber,
        qState: r[2].qState
      },
      {
        qText: r[1].qAttrExps.qValues[0].qText,
        qNum: r[1].qAttrExps.qValues[0].qNum,
        qElemNumber: r[2].qElemNumber,
        qState: r[2].qState
      }
      ];
    });

    let firstbar = hypercube.qGrandTotalRow[0];
    let firstbarlabel = hypercube.qMeasureInfo[0];
    om.unshift([{
      qText: firstbarlabel.qFallbackTitle,
      qNum: "NaN",
      qElemNumber: -4,
      qState: "X"
    },
    {
      qText: "0",
      qNum: 0,
      qElemNumber: 0,
      qState: "L"
    },
    {
      qText: firstbar.qText,
      qNum: firstbar.qNum,
      qElemNumber: 0,
      qState: "L"
    },
    {
      qText: firstbar.qText,
      qNum: firstbar.qNum,
      qElemNumber: 0,
      qState: "L"
    }
    ]);

    let lastbar = hypercube.qGrandTotalRow[1];
    let lastbarlabel = hypercube.qMeasureInfo[1];

    om.push([{
      qText: lastbarlabel.qFallbackTitle,
      qNum: "NaN",
      qElemNumber: -5,
      qState: "X"
    },
    {
      qText: "0",
      qNum: 0,
      qElemNumber: 0,
      qState: "L"
    },
    {
      qText: lastbar.qText,
      qNum: lastbar.qNum,
      qElemNumber: 0,
      qState: "L"
    },
    {
      qText: lastbar.qText,
      qNum: lastbar.qNum,
      qElemNumber: 0,
      qState: "L"
    }
    ]);

    om.forEach((r, ri) => {
      if (ri > 0 && ri < om.length - 1) {
        r[1].qNum = om[ri - 1][2].qNum;
        r[2].qNum = om[ri - 1][2].qNum + r[2].qNum;
      }
    });

    return om;
  }
}

export default ConvertHypercube;
