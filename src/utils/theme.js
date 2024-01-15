const colors = [
  "rgba(0,0,0,0)",
  "#ffffff",
  "#46c646",
  "#276e27",
  "#b6d7ea",
  "#7db8da",
  "#4477aa",
  "#8e477d",
  "#ffcf02",
  "#f8981d",
  "#f93f17",
  "#633d0c",
  "#b0afae",
  "#7b7a78",
  "#545352",
  "#000000"
];

const colorseq = [
  "#4477aa",
  "#cc6677",
  "#c3c3c3"
];

class ThemeManager {
  static setAppTheme(theme) {
    ThemeManager.qlikTheme = theme;
  }

  static getPicassoTheme() {
    var style = {
      '$font-family': '"QlikView Sans", sans-serif',
      '$font-color': "#595959"
    };

    return style;
  }

  static colorFromPicker(picker) {
    if (picker.index === -1) {
      return picker.color;
    } else {
      return this.colorFromTheme(picker.index);
    }
  }

  static colorFromTheme(index) {
    if (typeof ThemeManager.qlikTheme != 'undefined') {
      const colors = ThemeManager.qlikTheme.properties.palettes.ui[0].colors;
      let i = index;
      if (colors[0] !== "none") {
        i--;
      }
      return ThemeManager.qlikTheme.properties.palettes.ui[0].colors[i];
    } else {
      return colors[index];
    }
  }

  static colorFromSeq(index) {
    if (typeof ThemeManager.qlikTheme != 'undefined') {
      return ThemeManager.qlikTheme.properties.palettes.data[0].scale[1][index];
    } else {
      return colorseq[index];
    }
  }

  static colorOther() {
    if (typeof ThemeManager.qlikTheme != 'undefined') {
      return ThemeManager.qlikTheme.properties.dataColors.othersColor;
    } else {
      return "#c3c3c3";
    }
  }
}

export default ThemeManager;
