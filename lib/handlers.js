/**
 * Handlers to be associated with routes.
 * 
 * Each handler may accept a data object with the relevant details of the
 * request, and must return an object representing the response. At minimum,
 * it must have a statusCode key, with a corresponding integer value for the
 * returned HTTP status code (usually, but not always, 200). Failing to supply
 * an integer status will result in the server returning a 500.
 */

const parseJson = require('./parse_json');

/**
 * Collection of handlers.
 */
const handlers = {
  hello: {
    post: (data) => {
      const { name } = parseJson(data.requestBody) || {};
      const response = {
        responseBody: {
          message: `Hello there, ${(name) ? name : 'friend'}!`,
          statusCode: 200
        },
        responseStatus: 200
      };
      return response;
    }
  }
}

module.exports = handlers;