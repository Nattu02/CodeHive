# Ep-4 Routing and route handlers

- Initialize the project by the command 'npm init'
- Install express using the command 'npm i express'
- Configure the server by requiring express and listen to the port
- Request handlers can be written as app.use(PATH, HANDLER_FUNCTION)

## Routing
- The order of routes is very inportant
- The route 'app.use()' overrides all the other and it will be executed for any api call.
- To specify the HTTP method call, GET, POST, PUT, DELETE, PATCH, can be used with required handler functions.
- The exact path will be searched from the top, and if found, it will be used. For example '/' is equivalent to '/xyz', '/abc', '/test'.. and so on. Anything can be given after the / of the available paths.
- Paths can also be regex. For example '/ab+c' ==> '/abc', '/abbbbc', '/abbbbbbbbbbbc'.... Like this a lot of regex can be used. 
- Dynamic routes can also be given. '/user/:id' This can be recieved as a part of req.params. 

# Ep-5 Middlewares and error handling

## Multiple routes
- app.use('/route', route handler =>{})  => Signature for creating a route
- There can be any number of route handles for a single route.
- To create a following route handler, the previous handler must have an additional parameter 'next'.
- app.use('/route', (req, res, next) =>{RH... next()}, (req, res, next) =>{RH... res.send(".....")})
- If 'next' is not there and the request is not sending any response, it will stay hanging.
- If there is a res.send and next is called, it will throw an error. 

## Middlewares
- The intermediate functions between a route is called and the response is send, are called middlewares. 
- There can be any number of middlewares
- The final function where the response is send is named as request handler. 

## Why middlewares?
- In cases like admin authorization, '/admin/getUserData', '/admin/deleteUser', ... etc, it is mandatory to check the authority of admin for every route. So, instead of writing the same auth code in each request handler, it can be written as a separate middleware and can be called everytime the '/admin' route is called. 
- app.use('/admin', (req, res, next) => {auth}). This will be called for every route with '/admin' if it kept on top of the file. 