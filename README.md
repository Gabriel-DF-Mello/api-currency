## Project setup

```bash
# set up environment
$ docker-compose up

# install dependencies
$ npm install

# copy the .env file for local execution
$ cp .env.example .env
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage
The project has 2 endpoints which are as follows:

### Convert currency:
POST request example:
```sh
   curl --location --request POST 'localhost:3000/currency/convert' \
		--header 'Content-Type: application/json' \
		--data '{
				"source_currency": "USD",
				"target_currency": "EUR",
				"amount": 100
		}'
```

response example: 
```json
	{
		"currency": "EUR",
		"amount": 85.11
	}
```

### Health check: 
GET request example:
```sh
	curl --location --request GET 'localhost:3000/health'
```