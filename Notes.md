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

## 