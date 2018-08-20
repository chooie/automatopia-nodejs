module.exports = function cssObjectToString(object) {
  return cssObjectToStringRecursive(object, 0).trim();
};

function cssObjectToStringRecursive(object, indentLevel) {
  return buildCssForEachSelector(object, indentLevel);
}

function buildCssForEachSelector(object, indentLevel) {
  let stringToReturn = "";
  Object.keys(object).forEach(function(selectorKey) {
    const styles = object[selectorKey];
    stringToReturn += leftPad(selectorKey + " {\n", indentLevel);

    if (typeof styles === "string") {
      stringToReturn += cssAttributesFromString(styles, indentLevel);
    } else {
      stringToReturn += buildCssForSelector(styles, indentLevel);
    }
    stringToReturn += leftPad("}\n", indentLevel);
  });
  return stringToReturn;
}

function cssAttributesFromString(text, indentLevel) {
  const lines = text.split("\n");
  const indentedLines = lines.map(function(line) {
    return leftPad(line, indentLevel + 2);
  });
  return combineLinesByNewLineAndTrim(indentedLines);
}

function buildCssForSelector(stylesValueObject, indentLevel) {
  let stringToReturn = "";

  Object.keys(stylesValueObject).forEach(function(style) {
    const styleValue = stylesValueObject[style];

    if (typeof styleValue === "object") {
      stringToReturn += cssObjectToStringRecursive(
        { [style]: styleValue },
        indentLevel + 2
      );
    } else {
      stringToReturn += leftPad(style + `: ${styleValue};\n`, indentLevel + 2);
    }
  });
  return stringToReturn;
}

function leftPad(text, indentLevel) {
  if (!indentLevel && indentLevel !== 0 && indentLevel < 0) {
    throw new Error(`Expected positive indent but got '${indentLevel}'.`);
  }
  return " ".repeat(indentLevel) + text;
}

function combineLinesByNewLineAndTrim(lines) {
  return lines.reduce(function(accumulator, line) {
    let newText = accumulator + line + "\n";
    return newText;
  }, "");
}
