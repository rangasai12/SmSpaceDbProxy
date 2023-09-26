# Generic Database Proxy - REST API for CRUD on SQL Database

## Overview
This project implements a generic REST API for performing CRUD (Create, Read, Update, Delete) operations on a SQL database using JavaScript and Node.js. The API dynamically builds and validates the database schema based on a provided JSON schema file. It supports multiple tables and data types.

### Technical Requirements
- Create, Read, Update, and Delete SQL statements map to the following API endpoints:
  - `POST /:collection`
  - `GET /:collection/:id`
  - `POST /:collection/:id`
  - `DELETE /:collection/:id`

- The project checks for the existence of tables specified in the schema and creates/adds columns if not detected.

- The database can be a local SQLite instance or can be defined using a Dockerfile.

## Project Structure
The project consists of the following components:

- **`server`**: Contains the server-side code for the REST API.
  - **`app.js`**: Defines the Express.js server and routes.
  - **`database.js`**: Manages the SQLite database connection and schema initialization.
  - **`schema/schema.json`**: The schema definition in JSON format.
  - **`routes`**: Contains route handlers for CRUD operations.
  
- **`test`**: Contains test cases for the API.
  - **`api.test.js`**: Tests the CRUD operations and data validation.

## Getting Started
1. Clone the repository:

    ```bash
    git clone https://github.com/rangasai12/SmSpaceDbProxy.git
    ```

2. Install dependencies:

    ```bash
    cd project-directory
    npm install
    ```

3. Create a schema JSON file (e.g., `schema/schema.json`) to define your database schema.

4. Start the server:

    ```bash
    node app.js
    ```

5. The API will be accessible at `http://localhost:3001/collection`.

## API Endpoints

### Create a Record
- **Endpoint:** `POST /:collection`
- **Example:** `POST /users`
- **Request Body:** JSON data conforming to the schema.
- **Response:** JSON with the ID of the created record.

### Read a Record
- **Endpoint:** `GET /:collection/:id`
- **Example:** `GET /users/1`
- **Response:** JSON data for the requested record.

### Update a Record
- **Endpoint:** `POST /:collection/:id`
- **Example:** `POST /users/1`
- **Request Body:** JSON data to update the record.
- **Response:** JSON with a success message.

### Delete a Record
- **Endpoint:** `DELETE /:collection/:id`
- **Example:** `DELETE /users/1`
- **Response:** JSON with a success message.

## Testing
To run tests, use the following command:

```bash
npm test
```

## Docker Support

You can build a Docker container for this project using the provided Dockerfile.

### Build the Docker image:

```bash
docker build -t database-proxy .
docker run -p 3001:3001 database-proxy

```

## Additional Changes for Concurrent Environment

If the application is intended to run in a concurrent environment, such as handling multiple simultaneous requests from multiple clients, the following changes should be considered:


1. **Thread Safety**: Ensure that your database access code and schema initialization code are thread-safe.

2. **Concurrency Control**: Implement concurrency control mechanisms to prevent conflicts when multiple clients try to update the same records simultaneously.

3. **Request Isolation**: Ensure that each incoming request is isolated from others to prevent interference between requests.

4. **Rate Limiting**: Consider implementing rate limiting or throttling to prevent excessive requests from a single client.

