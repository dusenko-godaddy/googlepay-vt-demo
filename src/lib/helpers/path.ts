//
// path.js
// object path fetcher
//

/**
 * Accesses a key deep down in a nested object.
 * @param {Object} obj - the object
 * @param {String} p - the key to access
 * @param {*} def - the default value
 */
export function path(obj: any, p: string, def?: any): any {
  const ret: any = p.split(".").reduce((o: { [key: string]: string }, key: string): {
    [key: string]: string;
  } => {
    return o && o[key] !== undefined ? o[key] : (undefined as any);
  }, obj);

  return ret !== undefined ? ret : def;
}
