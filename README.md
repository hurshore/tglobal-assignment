# Department Management API

A robust NestJS GraphQL API for managing departments and sub-departments, built with TypeORM and PostgreSQL.

## Features

- JWT-based authentication
- Department management (CRUD operations)
- Sub-department management (CRUD operations)
- Input validation
- Pagination support
- PostgreSQL database with TypeORM
- GraphQL API with NestJS

## Prerequisites

- Node.js (v20.11.1 or later)
- Docker and Docker Compose
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tglobal-assignment
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from template:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tglobal
JWT_SECRET=your-secret-key
```

## Running the Application

1. Start the PostgreSQL database:

```bash
docker-compose up -d
```

2. Start the application:

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The GraphQL playground will be available at: http://localhost:3000/graphql

## Initial Setup

1. Create an admin user using the CLI:

```bash
npm run cli -- create-user --username admin --password admin123
```

2. Get an authentication token by logging in:

```graphql
mutation {
  login(username: "admin", password: "admin123") {
    access_token
  }
}
```

Use the returned token in the HTTP Headers for subsequent requests:

```json
{
  "Authorization": "Bearer your-token-here"
}
```

## Example GraphQL Operations

### Departments

1. Create a Department:

```graphql
mutation {
  createDepartment(
    input: {
      name: "Finance"
      subDepartments: [{ name: "Accounting" }, { name: "Budget" }]
    }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

2. Get All Departments (with pagination):

```graphql
query {
  departments(pagination: { page: 1, limit: 10 }) {
    items {
      id
      name
      subDepartments {
        id
        name
      }
    }
    total
    page
    limit
    hasMore
  }
}
```

3. Get Department by ID:

```graphql
query {
  department(id: 1) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

4. Get Department by Name:

```graphql
query {
  departmentByName(name: "Finance") {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

5. Update Department:

```graphql
mutation {
  updateDepartment(input: { id: 1, name: "Financial Services" }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

6. Delete Department:

```graphql
mutation {
  removeDepartment(id: 1)
}
```

### Sub-Departments

1. Create a Sub-Department:

```graphql
mutation {
  createSubDepartment(departmentId: 1, input: { name: "Tax" }) {
    id
    name
    department {
      id
      name
    }
  }
}
```

2. Get All Sub-Departments:

```graphql
query {
  subDepartments {
    id
    name
    department {
      id
      name
    }
  }
}
```

3. Get Sub-Department by ID:

```graphql
query {
  subDepartment(id: 1) {
    id
    name
    department {
      id
      name
    }
  }
}
```

4. Update Sub-Department:

```graphql
mutation {
  updateSubDepartment(input: { id: 1, name: "Tax Planning" }) {
    id
    name
    department {
      id
      name
    }
  }
}
```

5. Delete Sub-Department:

```graphql
mutation {
  removeSubDepartment(id: 1)
}
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid input validation
- Duplicate department/sub-department names
- Non-existent departments/sub-departments
- Authentication errors
- Database constraints

## Security

- All endpoints (except login) are protected with JWT authentication
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive data
- Input validation is enforced for all operations

## Development

- Run tests: `npm run test`
- Run e2e tests: `npm run test:e2e`
- Run linting: `npm run lint`
- Format code: `npm run format`

## Database Management

- Reset database: `docker-compose down -v && docker-compose up -d`
- View logs: `docker-compose logs -f postgres`

## Deployment to Render

1. Sign up for a [Render](https://render.com) account if you haven't already.

2. Fork this repository to your GitHub account.

3. From your Render dashboard:

   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub account if you haven't already
   - Select your forked repository
   - Click "Connect"

4. Render will automatically:

   - Create a PostgreSQL database
   - Deploy the web service
   - Set up the environment variables

5. Once deployed, you'll need to:

   - Get the database credentials from the Render dashboard
   - Create an admin user using the Render shell:
     ```bash
     npm run cli -- create-user --username admin --password your-password
     ```
   - Access your API at: `https://your-service-name.onrender.com/graphql`

6. Important environment variables to set in Render dashboard:
   - `JWT_SECRET`: Generate a secure random string
   - All database variables will be automatically set

## Render Configuration

The `render.yaml` file in the repository root configures:

- A web service running the NestJS application
- A PostgreSQL database
- Automatic environment variable linking
- Build and start commands

To modify the deployment configuration, edit the `render.yaml` file.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
