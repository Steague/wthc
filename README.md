# Walmart Labs Take-home-Challenge

This is a Walmart Labs take-home challenge. It uses Docker for Redis and as the web server. Please have port 3000 available to run this application.

# Bootstrapping the Installation

* First, make sure you have Docker downloaded and working.
* Clone this repository.
* Navigate to the root of the cloned repository.
* Run the following command to install required packages onto the web/services servers.

```docker-compose -f docker-compose.builder.yml run --rm install```

* Run the following command to start the web/services servers

```docker-compose up```

* Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.


# Testing
Run the following command from the root directory of the cloned repository.

`yarn run test`
