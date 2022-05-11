import qs from "qs";

import { merge } from "./merge";
import { path } from "./path";
import { isObject } from "./is-object";

import themes from "../themes/index";

import { UrlParams } from "../types/url-params";

export const parseUrlParams = (urlParams: string): UrlParams => {
  const params: UrlParams = qs.parse(urlParams);

  if (!params || !isObject(params)) {
    return {};
  }

  // convert string true and false to boolean
  Object.keys(params).forEach((key) => {
    if (params[key] === "true" || params[key] === "false") {
      params[key] = params[key] === "true";
    }
  });

  if (isObject(params.displayComponents)) {
    // convert string true and false to boolean
    Object.keys(params.displayComponents).forEach((key) => {
      if (
        params.displayComponents[key] === "true" ||
        params.displayComponents[key] === "false"
      ) {
        params.displayComponents[key] = params.displayComponents[key] === "true";
      }
    });
  }

  const theme: string = path(params, "style.theme");

  if (theme && theme in themes) {
    params.style = merge(params.style, themes[theme]);
    // override using custom css if any
    if (isObject(params.customCss)) {
      const customCss = { ...params.style, ...params.customCss };
      params.style = customCss;
    }
    // use custom css even if a "theme" is not designated
  } else if (params.customCss) {
    const customCss = { ...params.style, ...params.customCss };
    params.style = customCss;
  }

  return params;
}
