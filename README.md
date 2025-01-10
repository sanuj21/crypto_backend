# Crypto Backend Service

Service Side application to fetch the data from the crypto API and store it in the database, and provide the processed data.

## Installation

1. Clone the repository

```bash
git clone
```

3. Create a `.env` file in the root directory and add the following environment variables

```bash
  DATABASE=<MongoDB URI>
  PORT=<Port number>

```

3. Run the following command to start the application

```bash
docker compose up --build
```

## Deployment

Deployed on AWS: [Crypto Backend Service](http://35.154.248.91/)

## Task 1

Utliized Cron Job to fetch the data from the API every 2 hour and store it in the database.

## API Endpoints (Task 2 and Task 3)

#### **GET /stats**

- **Description**: Get the latest data of particular crypto.
- **Request**:

  - **params**: coin=bitcoin

- **Response**:

  ```json
  {
    "status": "success",
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
  }
  ```

#### **GET /deviation**

- **Description**: Get the deviation of the crypto data.

- **Request**:

  - **params**: coin=bitcoin

- **Response**:

  ```json
  {
    "status": "success",
    "deviation": 3.4
  }
  ```
