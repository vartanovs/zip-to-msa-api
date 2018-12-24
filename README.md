# Zip to MSA API
This API allows users to submit a ZIP Code (5 digit number) and receive a JSON Object with the following:
* ZIP Code
* CBSA (Core Based Statistical Area) Code
* MSA (Metropolitan Statistical Area) Name
* Population in 2014
* Population in 2015

This output is generated using publicly available US Government Census and HUD Data.

## Public API
This API is hosted publicly on Amazon Web Services at the following URL:

```html
http://zip-to-msa-api-prod.mjr2sdfatp.us-west-2.elasticbeanstalk.com
```

## Local Hosting
Running this API from your local machine will require Docker and Docker-Compose.

From the terminal, navigate to the folder containing this project and run:
```sh
$ docker-compose up
```

For machines with Node and NPM installed locally, this command also works:
```sh
$ npm run docker-prod
```

Upon running the script above, you will observe the following in the terminal:
```sh
$ Creating api-server ... done
$ Attaching to api-server
...
api-server    | > zip-to-msa-api@1.0.0 start /usr/src/app
api-server    | > NODE_ENV=production ts-node src/server
api-server    | Server listening on PORT: 3000
```

This indicates that a server is running on your local machine.  
Navigate to http://localhost:3000/ and you will see the following message:
> Welcome to the Zip to MSA API.  
> Please send a GET request with a query parameter "zip" to "/api".

## Ruby Client API Access
This repository includes a Ruby client to access the PUBLIC API. To access the API:
1. Ensure you have the latest stable version of Ruby (2.5.3 as of 2018-12-24)
2. In the terminal, navigate to the directory containing this project and run the following two commands:
```sh
$ gem install httparty
$ ruby src/client/client.rb [5 DIGIT ZIP CODE]
```
The first command installs the Ruby Library httparty.  
In the second command, replace [5 DIGIT ZIP CODE] with an actual 5 digit zip code.

## Direct API Access
Regardless of whether you wish to use the PUBLIC API HOST or your LOCAL HOST, you may  issue a GET request to the following endpoint:
```html
HOST/api
```
With the following query parameter:
> zip: 5 digit number

**Example Valid Requests:**
```html
HOST/api?zip=32003
HOST/api?zip=90210
HOST/api?zip=90245
```

Expect the response to match the following JSON format:
```JSON
{
  "zip": "90210",
  "cbsa": "31080",
  "msaName": "Los Angeles-Long Beach-Anaheim, CA",
  "population2014": "13254397",
  "population2015": "13340068"
}
```

## Data Refresh
This API caches Government Census/HUD Data to improve response speed.  
To refresh the cache, call the API with an additional refresh query parameter with value true:  

**Example Refresh Request:**
```html
HOST/api?zip=12345&refresh=true
```

## Testing
```sh
$ docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## NPM Scripts
If you have Node and Node Package Manager installed locally, navigate to the project folder and the following scripts are available from the terminal:
```sh
$ npm install
```
This will install all project dependencies on your local machine. This is needed to run the application without the use of docker.
```sh
$ npm start
```
This will start the production server on PORT 3000.
```sh
$ npm run dev
```
This will start the development server on PORT 3000. The server will refresh in response to any changes to non-test files in the server directory.
```sh
$ npm test
```
This will run the test suite.
```sh
$ npm test-coverage
```
This will run the test suite and output a test coverage report.
```sh
$ npm run docker-prod
```
If Docker is installed, this will activate a docker container with all dependencies installed into a volume. The container will activate the production server.
```sh
$ npm run docker-dev
```
If Docker is installed, this will activate a docker container with all dependencies installed into a volume. The container will activate the development server.
```sh
$ npm run docker-test
```
If Docker is installed, this will activate a docker container with all dependencies installed into a volume. The container will run the test suite, generating a test coverage report, and then exit.
```sh
$ npm run docker-update
```
This will update the vartanovs/zip-to-msa-api image with the latest dependencies and scripts in package.json and push the image to Docker Hub. **Running this script is not recommended.**