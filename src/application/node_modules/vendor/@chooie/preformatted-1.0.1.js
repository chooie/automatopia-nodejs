module.exports = function preformatted(template, ...expressions) {
  const text = buildStringWithExpressionsFromTemplate(template, expressions);
  const lines = text.split("\n");

  if (!isMultilined(lines)) return text;

  return standardizeIndentationByFirstLine(lines);
};

function buildStringWithExpressionsFromTemplate(template, expressions) {
  return template.reduce(function(accumulator, part, i) {
    return accumulator + expressions[i - 1] + part;
  });
}

function isMultilined(lines) {
  return lines.length > 1;
}

function standardizeIndentationByFirstLine(lines) {
  const firstLine = lines[1];
  const firstLineIndentLevel = getIndexOfFirstNonWhiteSpaceCharacter(firstLine);
  const linesLessExcessIndent = removeExcessIndent(lines, firstLineIndentLevel);
  return combineLinesByNewLineAndTrim(linesLessExcessIndent);
}

function removeExcessIndent(lines, firstLineIndentLevel) {
  return lines.map(function(line) {
    let firstCharIndex = getIndexOfFirstNonWhiteSpaceCharacter(line);
    let lineIndentLevel = firstLineIndentLevel;

    if (firstCharIndex < firstLineIndentLevel) {
      lineIndentLevel = firstCharIndex;
    }

    return line.slice(lineIndentLevel);
  });
}

function combineLinesByNewLineAndTrim(linesLessExcessIndent) {
  return linesLessExcessIndent
    .reduce(function(accumulator, line) {
      let newText = accumulator + line + "\n";
      return newText;
    }, "")
    .trim();
}

function getIndexOfFirstNonWhiteSpaceCharacter(text) {
  let indexOfFirstNonWhiteSpaceCharacter;

  for (let i = 0; i < text.length; i += 1) {
    if (!isWhiteSpaceCharacter(text[i])) {
      indexOfFirstNonWhiteSpaceCharacter = i;
      break;
    }
  }
  return indexOfFirstNonWhiteSpaceCharacter || 0;

  function isWhiteSpaceCharacter(character) {
    return character === " " || character === "\n";
  }
}
