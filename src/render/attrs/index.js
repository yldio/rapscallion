const { isFunction } = require("lodash/fp");

const { hasOwn } = require("../util");
const htmlStringEscape = require("../escape-html");
const transformAttrKey = require("./transform-attr-key");
const { renderStyleAttribute } = require("./style");

const attrsNotToRender = {
  children: true,
  dangerouslySetInnerHTML: true
};

const attrsWithExplicitBoolValue = [
  "aria-expanded",
  "aria-haspopup"
];

/**
 * Render an object of key/value pairs into their HTML attribute equivalent.
 *
 * @param      {Object}  attrs   Attributes in object form.
 *
 * @return     {String}          Generated HTML attribute output.
 */
function renderAttrs (attrs) {
  const attrString = [];

  for (let attrKey in attrs) {
    if (
      hasOwn(attrs, attrKey) &&
      !attrsNotToRender[attrKey]
    ) {
      let attrVal = attrs[attrKey];
      const explicitBooleanValue = attrsWithExplicitBoolValue.includes(attrKey);

      if (
        attrVal === undefined ||
        attrVal === null ||
        (
          attrVal === false &&
          !(explicitBooleanValue)
        ) ||
        isFunction(attrVal) ||
        (
          typeof attrVal === "object" &&
          !(Object.keys(attrVal).length > 0)
        )
      ) {
        continue;
      }

      attrKey = transformAttrKey(attrKey);
      if (
        (
          attrVal === true &&
          !(explicitBooleanValue)
        ) ||
        attrVal === undefined ||
        attrVal === null
      ) {
        attrVal = "";
      } else if (attrKey === "style" && typeof attrVal === "object") {
        attrVal = `="${renderStyleAttribute(attrVal)}"`;
      } else if (typeof attrVal === "string") {
        attrVal = `="${htmlStringEscape(attrVal)}"`;
      } else {
        attrVal = `="${attrVal}"`;
      }

      attrString.push(` ${attrKey}${attrVal}`);
    }
  }

  return attrString.join("");
}

module.exports = renderAttrs;
