/**
 * Exposes a "singleton" router for the Hello World API.
 * 
 * Recall that require() isn't guaranteed to return the same object instance
 * every time. It will return an object from the cache, using the path of the
 * required file as the cache key. This means inconsistencies in case may cause
 * two or more routers to be instantiated, despite them requiring the same code.
 * 
 * In other words, make sure you're being consistent with case in your require()
 * calls, in the event you need to require() this router in multiple places. 
 * It's functional for our purposes, but incorrect to call it a true singleton. 
 */

/**
 * WeakMaps for HellowWorldRouter private member routes.
 * 
 * Note that we use WeakMap instead of Map, so they can be garbage collected
 * if the associated HelloWorldRouter object goes away.
 */
const _routes = new WeakMap();
const _defaultRoute = new WeakMap();

/**
 * Router class for the Hello World API.
 * 
 * The router allows for registering handlers to route and HTTP method tuples.
 */
class HelloWorldRouter {
  /**
   * Construct the router.
   */
  constructor() {
    /**
     * Default 404 handler.
     * 
     * @return {object} - A response object with a message of "Not Found" and a
     *   statusCode of 404.
     */
    const notFoundHandler = () => {
      const response = {
        responseBody: {
          message: 'Not Found',
          statusCode: 404
        },
        responseStatus: 404      
      };
      return response;
    };

    // Set the default route's handler, and initialize the _routes dictionary.
    _defaultRoute.set(this, notFoundHandler);
    _routes.set(this, {});
  }

  /**
   * Register a handler function to a route-method tuple.
   * 
   * Note that this is a naive implementation: registering a route will clobber
   * any handlers previously attached to that route and method!
   * 
   * @param {string} route - The route to map.
   * @param {string} method - The HTTP method to bind the handler to. 
   * @param {function} handlerFn - The handler function to attach to the route.
   *   When the router receives a request at the given route, we'll call this
   *   function.
   */
  register(route, method, handlerFn) {
    // JavaScript object keys can't be empty. Add a leading slash to be sure.
    const routeKey = `/${route}`;
    const verb = method.toLowerCase();
    const routes = _routes.get(this);
    const newRoutes = {
      [route]: {
        [verb]: handlerFn
      }
    };

    // Merge the current routes with the new one.
    _routes.set(this, {...routes, ...newRoutes});
  }

  /**
   * Perform routing and invoke a handler for a given path and verb.
   * 
   * Note that our routing here is especially primitive, and only performs an
   * exact match lookup on both. A more robust approach would tokenize the path,
   * and perform matching based on defined routes while allowing for wildcard
   * replacement (for instance, /people/{person_id}/comments).
   * 
   * @param {string} path - The path from which routing information should be
   *   extracted. The corresponding handler will be invoked if one exists.
   *   Otherwise, the default handler will be invoked instead.
   * @param {object} data - The data object to pass to the handler. It contains
   *   summary information about the request, including the body (if any).
   * @param {object} method - Optional. The HTTP method used to make the
   *   request. Defaults to 'get'.
   * @return {object} - The result of the invoked handler: an object
   *   representing the resource returned.
   */
  route(path, data, method = 'get') {
    const verb = method.toLowerCase();

    // Object keys can't be empty, so we prefix with a leading slash.
    const routeKey = `/${path}`;
    const routes = _routes.get(this);
    const defaultHandler = _defaultRoute.get(this);

    console.log(`Routing to ${routeKey} using verb ${verb}`);
    const currentRoute = routes[routeKey] || {};
    const currentHandler = currentRoute[verb] || null;

    // Invoke the route's handler if it exists, or the default handler if not.
    return typeof(currentHandler) === 'function' ? currentHandler(data) : defaultHandler(); 
  }
}

const router = new HelloWorldRouter();

module.exports = router;