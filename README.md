The environment file should look like the following example:

ROUTE=/bigfinite
DOCS=/bigfinite/docs
ENVIRONMENT=PT
HOST=localhost
PORT=80

MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=bigfinite
LOG_LEVEL=debug

SECRET=test

## To run

And finally you are able to run the project by executing this command:

```
$> npm start
```

If everything goes well, you'll see these 3 messages:

```
Connected to Firebase :)
Server will start running soon :)
Express server is up and running on port YOUR_PORT
```

## To run in Docker 
  docker-compose up -d
  make up (need make for this)
  
## HTTP exposed endpoints

This project exposes 7 endpoints, and those are listed below.

### User endpoints (sign in, sign up and sign out)

```
method: POST
url: "http://localhost:YOUR_PORT/login"
body: {
  username: 'username',
  password: 'password'
}
```

```
method: POST
url: "http://localhost:YOUR_PORT/signup"
body: {
  username: 'username',
  password: 'password'
}
```

```
method: POST
url: "http://localhost:YOUR_PORT/logout"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}
```
### Solutions endpoints

```
method: POST
url: "http://localhost:YOUR_PORT/solutions/"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

body: {
    "company":"4",
    "process":"i"
}
```

```
method: GET
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

```

```
method: PUT
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

body: {
    "process":"4",
}
```

```
method: DELETE
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

```

### Screens endpoints

```
method: POST
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID/screen/"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

body: {
 "screens":[{
     "width": "100px",
     "height":"200px",
     "page" :2,
     "title": "Pagina 1"
 ]}
```

```
method: GET
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID/screen"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

```

```
method: PUT
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID/screen/SCREEN_ID"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

body: {
    "width":"500"
}
```

```
method: DELETE
url: "http://localhost:YOUR_PORT/solutions/SOLUTION_ID/screen/SCREEN_ID"
required headers: {
	Authorization: 'Bearer YOUR_TOKEN'
}

```

