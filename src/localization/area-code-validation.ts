const areaCodeValidation: Record<string, RegExp> = {
  "en": /^\d{5}([ ]\d{4})?$/,
  "en-US": /^\d{5}([ ]\d{4})?$/,
  "en-CA": /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/,
};

export default {...areaCodeValidation};
