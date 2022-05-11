export function merge(dest: any, source: any) {
  if (source === null || typeof source !== "object") {
    return dest !== null && typeof dest === "object" ? dest : source;
  } else if (
    source.constructor === Date ||
    source.constructor === RegExp ||
    source.constructor === Function ||
    source.constructor === String ||
    source.constructor === Number ||
    source.constructor === Boolean
  ) {
    return new source.constructor(source);
  } else if (source.constructor !== Object && source.constructor !== Array) {
    return source;
  }

  dest = dest || new source.constructor();

  /* jshint ignore:start */
  for (var name in source) {
    dest[name] = typeof source[name] !== "undefined" ? merge(dest[name], source[name]) : dest[name];
  }
  /* jshint ignore:end */

  return dest;
}
