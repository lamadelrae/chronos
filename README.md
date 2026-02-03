# Chronos

A demand forecasting and sales analytics platform that predicts product demand using machine learning based on historical sales data.

## Overview

Chronos helps businesses optimize inventory management and understand sales patterns through:

- **Sales Analytics Dashboard** - Real-time metrics with month-over-month comparisons
- **ML-Based Demand Forecasting** - 10-day rolling predictions using Facebook Prophet
- **Automated Data Synchronization** - ETrade ERP integration with scheduled syncing
- **Multi-Tenant Architecture** - Company-scoped data isolation and user management

## System Architecture

Chronos follows a microservices architecture with five main services orchestrated via Docker Compose:

### Services

1. **chronos-ui** (Port 3000)
   - **Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS
   - **Purpose:** Web application frontend with authentication, dashboards, and analytics
   - **Features:** React Query for state management, Radix UI components, Recharts for visualization

2. **chronos-app-api** (Port 5001)
   - **Tech Stack:** ASP.NET Core, Entity Framework Core, SQL Server
   - **Purpose:** Main REST API with JWT authentication and business logic
   - **Features:** Swagger/OpenAPI, Quartz.NET scheduling, handler-based architecture

3. **chronos-data-science** (Port 8000)
   - **Tech Stack:** Python, Flask, Facebook Prophet, Pandas
   - **Purpose:** Machine learning service for demand forecasting
   - **Features:** Time series analysis, seasonal patterns, log transformation

4. **chronos-app-integration**
   - **Tech Stack:** .NET Background Service, Quartz.NET, SQLite
   - **Purpose:** Automated ETrade ERP data synchronization
   - **Features:** Batch processing, incremental sync, duplicate tracking

5. **mssql** (Port 14333)
   - **Tech Stack:** Microsoft SQL Server 2022
   - **Purpose:** Primary database for application data

## Prerequisites

- Docker (20.10 or higher)
- Docker Compose (2.0 or higher)
- Minimum 4GB RAM allocated to Docker
- Ports 3000, 5001, 8000, and 14333 available

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chronos
```

### 2. Configure Environment Variables

Set the database password in [compose.yaml](compose.yaml) or via environment variable:

```bash
export MSSQL_PASSWORD="YourSecurePassword123!"
```

The password must meet SQL Server requirements (uppercase, lowercase, numbers, special characters, minimum 8 characters).

### 3. Start Services

```bash
docker compose up
```

This will:

- Build all service images
- Start SQL Server and wait for health check
- Run database migrations
- Start the API, frontend, data science service, and integration worker

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5001
- **Swagger UI:** http://localhost:5001/swagger
- **Data Science API:** http://localhost:8000

### 5. First-Time Setup

On first run, the application will:

- Initialize the database schema via EF Core migrations
- Trigger immediate background jobs (predictions and ETrade sync)
- Be ready for user registration and login

### Stopping Services

```bash
docker compose down
```

To remove volumes and reset the database:

```bash
docker compose down -v
```

## API & Authentication

### Authentication Flow

Chronos uses JWT-based authentication:

1. **Login:** `POST /api/auth` with email and password
2. **Receive:** JWT token valid for 6 hours
3. **Authorize:** Include token in `Authorization: Bearer <token>` header

Passwords are hashed using SHA-256 before storage.

### Main Endpoints

#### Public

- `POST /api/auth` - User login

#### Authenticated (JWT Required)

- `GET /api/user/product` - List products (paginated, filterable, sortable)
- `GET /api/user/product/top-sold` - Top selling products
- `GET /api/user/prediction` - Fetch demand predictions
- `GET /api/user/metrics/sales` - Sales metrics with MoM comparison
- `GET /api/user/sale` - Sales history
- User and company management endpoints

#### Integration (Special Role Required)

- `POST /api/sync/product` - Create products from external system
- `PUT /api/sync/product` - Update products
- `POST /api/sync/sale` - Create sales from external system

### API Documentation

Full API documentation is available via Swagger UI at http://localhost:5001/swagger when the API service is running.

## Core Features

### Sales Analytics Dashboard

The dashboard provides comprehensive sales metrics:

- **Monthly Revenue** - Total sales with month-over-month percentage change
- **Sales Quantity** - Total items sold with MoM comparison
- **Average Ticket** - Average sale value with trend analysis
- **Products Sold** - Unique products sold count
- **Average Selling Price** - Mean product price across sales
- **Daily Breakdown Charts** - Visual comparison of current vs. previous month

Navigate to the dashboard after login to view real-time analytics.

### Product Demand Forecasting

Chronos predicts future product demand using Facebook Prophet:

#### Features

- **10-Day Rolling Forecast** - Daily predictions for the next 10 days
- **Seasonal Pattern Recognition** - Accounts for weekend effects and trends
- **Historical Comparison** - Predictions displayed alongside actual sales data
- **Per-Product Analysis** - Individual forecasts for each product

#### Machine Learning Model

- **Algorithm:** Facebook Prophet (time series forecasting)
- **Features:** Log transformation, day-of-week indicators, weekend regressors
- **Training Data:** Historical daily sales aggregated by product
- **Output:** Date and predicted quantity for 10 future days

Access predictions via the Analytics page after sales data is synced.

### Background Jobs

Chronos runs two automated background jobs using Quartz.NET:

#### Prediction Job

- **Schedule:** Every Sunday at 2:00 AM
- **Trigger:** Also runs immediately on application startup
- **Process:**
  1. Iterates through all companies
  2. Deletes previous predictions
  3. Aggregates daily sales statistics per product
  4. Calls data science service for ML predictions
  5. Stores new predictions in database

#### ETrade Integration Job

- **Schedule:** Every Monday at 2:00 AM
- **Trigger:** Also runs immediately on application startup
- **Process:**
  1. Syncs products from ETrade database (create/update)
  2. Syncs sales since last successful sync (incremental)
  3. Updates sync timestamp in SQLite tracking database
  4. Batch processing (1,000 records per batch)
  5. Concurrent processing with semaphore limits

Job execution is logged and can be monitored via application logs.

## Data Models

### Core Entities

All entities inherit from a base class with `Id` (Guid), `CreatedAt`, and `UpdatedAt` timestamps.

#### Company

- Multi-tenant base entity
- Fields: Name, SocialReason, CNPJ, Address, City, State, ZipCode
- Purpose: Data isolation and tenant management

#### User

- Scoped to Company
- Fields: Name, Email, Password (hashed)
- Purpose: Authentication and authorization

#### Product

- Scoped to Company
- Fields: Name, Price
- Relations: Many SaleItems, One Prediction

#### Sale

- Scoped to Company
- Fields: Date, Total
- Relations: Collection of SaleItems

#### SaleItem

- Line items for individual sales
- Fields: Quantity, Price, Total
- Relations: Product (FK), Sale (FK)

#### Prediction

- One per Product
- Relations: Collection of PredictionSales

#### PredictionSale

- Individual prediction data points
- Fields: Date, Quantity (predicted)
- Relations: Prediction (FK)

### Entity Relationships

```
Company
  ↓ (1:N)
  ├─ User
  ├─ Product ──→ Prediction ──→ PredictionSale (1:N)
  │     ↓ (1:N)
  └─ Sale ──→ SaleItem (1:N)
          ↓ (N:1)
       Product
```

## Development

### Service Dependencies

```
mssql (database)
  ↓
chronos-app-api (REST API)
  ↓
chronos-ui (frontend)

chronos-data-science (ML service, called by API)
chronos-app-integration (worker, writes to API)
```

### Rebuilding Services

After code changes, rebuild specific services:

```bash
# Rebuild all services
docker compose build

# Rebuild specific service
docker compose build chronos-app-api

# Rebuild and restart
docker compose up --build
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f chronos-app-api
```

### Database Migrations

Migrations are automatically applied on API startup. To create new migrations:

```bash
# Enter API container
docker compose exec chronos-app-api bash

# Add migration (requires .NET SDK)
dotnet ef migrations add MigrationName --project Chronos.Api
```

### Troubleshooting

**SQL Server won't start:**

- Ensure password meets complexity requirements
- Check Docker has sufficient memory (4GB minimum)
- Verify port 14333 is not in use

**API can't connect to database:**

- Wait for SQL Server health check to pass
- Check database password matches in connection string
- Review API logs: `docker compose logs chronos-app-api`

**Frontend shows connection errors:**

- Verify API is running on port 5001
- Check CORS configuration in API
- Clear browser cache and cookies

## License

[Specify your license here]

## Support

For issues, questions, or contributions, please [contact information or repository issues link].
