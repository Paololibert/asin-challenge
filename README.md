# ASIN Take Home Challenge

## Project Overview

This project is designed to import data from an XLSX file into a database using Node.js. It includes services for reading XLSX files, importing data into a database, and listing and sorting records. The project uses Prisma as the ORM and PostgreSQL as the database.

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd asin-take-home-challenge
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the database:

   ```sh
   npx prisma migrate dev
   ```

## Usage

### Import Data from XLSX File

To import data from an XLSX file, run the following command:

```sh
node src/services/xlsx.service.js --file <path-to-xlsx-file>
```

### Import Data from Standard Input

To import data from standard input, run the following command:

```sh
cat <path-to-xlsx-file> | node src/services/xlsx.service.js
```

### List Records

To list all records in the database, use the `listRecords` function from `db.service.js`.

### Docker Environment

This project includes a Docker environment for easy setup and deployment. To start the Docker environment, run the following command:

```sh
docker-compose up
```

This will start a PostgreSQL database and the Node.js application.

## Testing

To run the tests, use the following command:

```sh
npm test
```

