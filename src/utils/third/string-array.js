// 将字符串转成数组（特别是带有 emoji 的字符串），参考： https://www.cnblogs.com/wzybnzy/p/7569113.html

let rsAstralRange = '\\ud800-\\udfff',
    rsZWJ = '\\u200d',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
let reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');

let rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsOptVar = '[' + rsVarRange + ']?',
    rsCombo = '[' + rsComboRange + ']',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    reOptMod = rsModifier + '?',
    rsAstral = '[' + rsAstralRange + ']',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
let reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * 字符串转数组，能正常分离 emoji 比如：🏌🏿
 */
export function stringToArray (val) { // 字符串转成数组
    return hasUnicode(val)
        ? unicodeToArray(val)
        : asciiToArray(val);
}

export function hasUnicode (val) {
    return reHasUnicode.test(val);
}

export function unicodeToArray (val) {
    return val.match(reUnicode) || [];
}

export function asciiToArray (val) {
    return val.split('');
}