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
- Possible errors from route handlers/middlewares should be handled efficiently.
- The best way is to wrap the request handlers to try catch blocks

# Ep-6 Database, Schema, and Models

## Connecting to a database
- A mongodb cluster is to be created first, and connected to application using the connection string.
- Database connections are made in separate file to maintain code structure.
- It should be noted that the database connection is made before listening to the port. Because once the server starts listening to the port, it starts receiving requests, and if any requests comes and DB is not connected, it will be a major issue. 
- DB connection should return a promise, and it needs to be handled appropriately.

## Creating a schema and a model
- A Schema is the skeletal structure of a collection. For example, the User schema contains attributes like fname, lname, mailid, age, gender, etc.
- The attributes should be defined inside the schema along with their type. For example, [fname: {type: String}, lname: {type: String}... ]
- After creating a schema, a model should be created.
- A model is like a class, which helps to interact with the collection by creating instances. 

- Once the model and schema are created, it is time to add data to the database. 
- The database name should be given in the connection string. ===> "mongodb+srv://username:<Password>@practice.plnh4xg.mongodb.net/**DB name**?retryWrites=true&w=majority&appName=practice"
- While creating an instance for the model, new keyword should be used. const user = new User({fname: virat, lname: Kohli, ...})
- The new instance can be saved to the DB using the command Instance.save(). 
- If any attributes in the incoming data is not found in th schema, it'll be ignored by mongoose, and only the attributes in the schema are stored to the database. 
- With each instance, _id is added automatically by mongoose. 
- The collection name is automatically modified by mongoDB into plural form. 
- The DB actions should always be wrapped inside try catch blocks. 

## Dynamic data insertion

- Instead of hardcoding the user details in the code every single time, the values can be passed from the request. 
- Request.body contains the data need to be inserted, in the JSON format. 
- JSON is different from JS object, as JSON is a widely used data format, that is used among different languages. But JS object is the internal data structure of javascript. 
- Originally data sent from the request is in the form of readable datastreams. 
- To convert the datastreams to JSON, there is a middleware in express. That is express.json().
- The middleware should be used at the start of the program, so that it can be used by all the route handlers in the app. **app.use(express.json())**
- After converting the data from request into JSON, a new instance can be created by using const user = new user(req.body);
- Any DB operations return a promise. So, they should be handled with async await, and wrapped inside try catch blocks. 


## Fetch, update, and deletion of data

- There is a lot of mehtods inside models. To find all data, find by filters, update data based on filters, replace, delete, ..... etc. 
- The conditions can be passed by request body, and can be used as filter. 

