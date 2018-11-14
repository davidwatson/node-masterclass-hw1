/**
 * Launches a server that offers a simple, RESTful, "Hello World" JSON API.
 *
 * Whenever someone POSTs to the route /hello, a welcome message is returned in
 * JSON format. All other routes will 404.
 */

// Node.js Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Own Dependencies
const config = require('./lib/config');
const router = require('./lib/router');
const handlers = require('./lib/handlers');

// Configure the server.
const httpServer = http.createServer((req, res) => {
  // Parse the request URL for later use.
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const {query} = parsedUrl;

  // Get the HTTP verb used.
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;

  // Get the request body as chunks are brought in, if any.
  const decoder = new StringDecoder('utf8');
  let requestBody = '';
  req.on('data', (chunk) => {
    requestBody += decoder.write(chunk);
  });

  // Once we have the entire request, we can respond.
  req.on('end', () => {
    // Make sure we flush the internal buffer from the last decoder.write(),
    // in case it's holding an incomplete UTF-8 character. It'll be replaced
    // with an appropriate substitution character and appended to the end of
    // our buffer, completing the request body.
    requestBody += decoder.end();

    // Construct the request data for our router to consume.
    const data = {
      method: method,
      path: path,
      query: query,
      headers: headers,
      requestBody: requestBody
    }

    /**
     * Send the response to the client.
     * 
     * @param {*} body - A JSON string to send, or an object to be stringified.
     * @param {number} status - An HTTP status code. Defaults to 200.
     */
    const sendResponse = (body, status = 200) => {
      // Return 500 with an error if we receive a non-number status
      const isValidStatus = typeof(status) === 'number';
      const resStatus = isValidStatus ? status : 500;
      const resBody = isValidStatus ?
        (typeof(body) === 'string' ? body : JSON.stringify(body)) :
        { error: 'Internal Server Error', message: 'A non-numeric HTTP status code was returned.' };
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(resStatus);
      res.end(resBody);
    }

    // When we receive a request, route it, and send the appropriate response.
    const {responseBody, responseStatus} = router.route(path, data, method);
    sendResponse(responseBody, responseStatus);
  });
});

// Register routes and their handlers.
router.register('/hello', 'post', handlers.hello.post);

// Start listening on the port defined by our config and environment variables. 
httpServer.listen(config.port, () => console.log(`Server is listening on port ${config.port} in ${config.envName} mode.`));

