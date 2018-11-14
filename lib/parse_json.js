/**
 * Exposes a safe wrapper over JSON.parse(), with proper exception handling.
 */

 /**
  * Safely parse a JSON string.
  * 
  * Generally, we want to avoid using long runs of try/catch whenever we can,
  * as it can have an adverse impact on performance. This function keeps it as
  * brief as possible, handles errors gracefully, and still allows for
  * conditional assignment using const: the object if parsing succeeds, and null
  * if it fails.
  * 
  * @param {string} jsonStr - The stringified JSON to parse.
  * @return {object} - An object representing the parsed JSON, or null if the
  *   parsing fails. 
  */
const parse = (jsonStr) => {
  try {
    const parsedJson = JSON.parse(jsonStr);
    return parsedJson;
  }
  catch (e) {
    // Handle the exception by returning null. Failure to parse means no data.
    return null;
  }
}

module.exports = parse;