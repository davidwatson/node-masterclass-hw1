# Introduction

This is the first assignment in Pirple's Node.js Master Class. The intended
purpose of the course is to provide a deep dive into the underpinnings of
Node.js, without the need for any third-party libraries or frameworks. As a
result, **NPM may not be used**.

## Assignment #1 Details

Please create a simple "Hello World" API. Meaning:

1. It should be a RESTful JSON API that listens on a port of your choice. 

2. When someone posts anything to the route /hello, you should return a welcome
message, in JSON format. This message can be anything you want.

### Interpretation

The assignment leaves a bit open to interpretation:

* I am choosing to interpret "posts anything to the route /hello" as "issues a
  request using the HTTP POST verb to the route /hello, exactly."

* I am interpreting "JSON API" as "request and response bodies are expected to
  be in JSON format, with the appropriate Content-Type headers set."

* To demonstrate the consumption of JSON passed along the POST request body, I
  am allowing a "name" to be passed along for the endpoint to issue a (JSON)
  greeting to (see below).

* To prevent folks from needing to muck about with self-signed certificates,
  only HTTP is supported. A production-ready API would support HTTPS, perhaps
  exclusively.

## Additional Requirements

* Use the latest LTS release of Node.js 8.x. At the time of writing, this is
  Node v8.12.0.

* No third-party libraries, frameworks, or packages, including but not limited
  to those managed via NPM. Only the Node.js APIs may be used—anything else must
  be written by hand.

# Starting the API Server

From the project root, run `node ./index.js`. `NODE_ENV` can be set to either
"development" or "production" to run at localhost:3000 or localhost:8080,
respectively. The server runs in development mode by default.

# Endpoints

Only one endpoint is exposed by our API: /hello.

## POST /hello

Issues a greeting, optionally addressed to a named individual.

### Request Body Parameters

* name (string, optional) - The name to which the greeting should be addressed.
  Defaults to 'friend'. Note that invalid JSON will be discarded, causing the
  API to revert to the default behavior.

## Response Body Parameters

* statusCode (number) - The HTTP status code.

* message (string) - The message containing the greeting. If a name was
  provided, it will be used here.

### Usage

Receive a generic greeting:

`curl -X POST http://localhost:3000/hello`

Receive a greeting addressed to someone named Ada:

`curl -X POST -H "Content-Type: application/json" -d '{"name":"Ada"}' http://localhost:3000/hello`

### An Aside

POST is only used here to meet the original requirements of the assignment.

In a production application, this should really use the verb GET. No resource
is created or updated, and the request is idempotent: it can be invoked any
number of times, and it will always produce the same result. Allowing for the
name to be passed along the query string would satisfy the need for input.

