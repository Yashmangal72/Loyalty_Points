<img width="1917" height="1076" alt="image" src="https://github.com/user-attachments/assets/26f807be-4fa0-4a21-8819-4c68665145cb" />

<img width="1917" height="1037" alt="image" src="https://github.com/user-attachments/assets/3d588166-cae4-45df-a4a5-1916850d13ff" />

<img width="1917" height="1028" alt="image" src="https://github.com/user-attachments/assets/8c9403e9-65bb-4070-9d6a-6bed61c3a089" />

<img width="1917" height="1030" alt="image" src="https://github.com/user-attachments/assets/1208fbd7-e1aa-4895-881d-16d2d473de70" />

<img width="1917" height="981" alt="image" src="https://github.com/user-attachments/assets/ac8ae0cd-c4b8-4dc3-9f04-d358b1399005" />

<img width="1917" height="983" alt="image" src="https://github.com/user-attachments/assets/93b15501-cd09-4241-b7ae-88f1364566a4" />




# BeanPoints — Café Loyalty Points System

A full-stack café loyalty management platform built with **React, Vite, Spring Boot, Spring Security, JWT and PostgreSQL**.

BeanPoints helps café staff register members, record purchases, calculate loyalty points, manage membership tiers, redeem rewards and maintain a transaction history.

---

## 1. Overview

BeanPoints is a staff-facing loyalty management system for a café chain.

The application supports:

- Staff registration and login
- JWT-based authentication
- Customer/member registration
- Member search
- Pagination and sorting
- Purchase recording
- Automatic loyalty point calculation
- Bronze, Silver, Gold and Platinum membership tiers
- Reward redemption
- Transaction history
- 90-day unused-point expiration
- PostgreSQL persistence
- React-based user interface

The implementation includes the base loyalty system plus:

- **Level 1 — T3 backward compatibility:** Platinum tier
- **Level 2 — T2 automation:** 90-day point expiration

Level 3 notification/outbox integration was intentionally left outside the implementation scope.

---

## 2. Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- CSS

### Backend

- Java 17
- Spring Boot 3.3.3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Bean Validation
- Lombok
- Maven

### Database

- PostgreSQL 16
- Hibernate / JPA

### Development

- Docker Compose
- Git / GitHub

---

## 3. Loyalty Rules

### Membership Tiers

| Tier | Lifetime Points | Points Earned |
|---|---:|---:|
| Bronze | 0–499 | 1 point / ₹100 |
| Silver | 500–1499 | 1.5 points / ₹100 |
| Gold | 1500–4999 | 2 points / ₹100 |
| Platinum | 5000+ | 0.3 points / ₹100 |

### Important Tier Behaviour

A member's tier is determined using **lifetime earned points**.

Redeeming points decreases the member's current redeemable balance, but does **not** decrease lifetime earned points.

Therefore, a member does not lose their historical tier progress simply because they redeem rewards.

---

## 4. Rewards

| Reward | Cost |
|---|---:|
| Free Coffee | 100 points |
| Free Dessert | 200 points |
| ₹100 Voucher | 500 points |

Only active rewards are exposed by the rewards endpoint.

---

## 5. Point Expiration

Earned points expire after **90 days** if they remain unused.

The system stores an `expiresAt` value against earned point transactions.

Instead of waiting 90 real days during testing, the application exposes:

```text
POST /clock
```

A simulated timestamp can be supplied to process expired points.

Example:

```bash
curl -X POST "http://localhost:8080/clock?at=2030-01-01T00:00:00"
```

The expiration process:

1. Finds earned transactions whose expiry time has passed.
2. Removes the applicable unused points from the member's current balance.
3. Creates a transaction recording the expiration.
4. Clears the processed expiry marker so the same earning transaction is not processed repeatedly.
5. Does not reduce lifetime earned points.

---

## 6. Authentication

Staff accounts can be registered through:

```text
POST /api/auth/register
```

Staff can then log in through:

```text
POST /api/auth/login
```

Login returns a JWT token.

Protected API requests require:

```text
Authorization: Bearer <JWT>
```

Passwords are stored using BCrypt hashing.

---

## 7. API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a staff account |
| POST | `/api/auth/login` | Public | Authenticate and receive JWT |

### Members

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/members` | Staff | Create a member |
| GET | `/api/members` | Staff | List/search members |
| GET | `/api/members/{id}` | Staff | Get member by ID |
| GET | `/api/members/phone/{phone}` | Staff | Find member by phone |

### Points

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/members/{memberId}/purchases` | Staff | Record purchase and earn points |
| POST | `/api/members/{memberId}/redeem` | Staff | Redeem a reward |
| GET | `/api/members/{memberId}/transactions` | Staff | View member transaction history |

### Rewards

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/rewards` | Public | List active rewards |

### Clock / Expiration

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/clock` | Public | Process point expiration against a supplied timestamp |

---

## 8. Search, Pagination and Sorting

The member list supports searching, pagination and sorting.

Example:

```text
GET /api/members?search=rahul&page=0&size=10&sortBy=name&direction=asc
```

Supported functionality includes:

- Search by member name
- Search by phone number
- Pagination
- Configurable page size
- Sorting
- Ascending / descending direction

Spring Data `Pageable` is used so the application does not need to load all members into memory.

---

## 9. Database Design

The main entities are:

```text
User
Member
Tier
Reward
PointsTransaction
```

### User

Stores staff authentication information.

### Member

Stores:

- Name
- Phone
- Email
- Current redeemable points
- Lifetime earned points
- Current tier
- Creation/update timestamps

### Tier

Stores:

- Tier name
- Minimum lifetime points
- Points multiplier

### Reward

Stores:

- Reward name
- Point cost
- Description
- Active status

### PointsTransaction

Stores the loyalty ledger, including:

- Member
- Transaction type
- Points changed
- Purchase amount
- Reward
- Description
- Balance after transaction
- Creation time
- Expiry time for earned points

---

## 10. Point Calculation

For a purchase:

```text
Points = Purchase Amount / 100 × Tier Multiplier
```

The calculated value is rounded to two decimal places.

Example:

```text
Bronze:
₹1,000 / 100 × 1.0 = 10 points

Silver:
₹1,000 / 100 × 1.5 = 15 points

Gold:
₹1,000 / 100 × 2.0 = 20 points
```

After earning points:

```text
currentPoints += pointsEarned
lifetimeEarnedPoints += pointsEarned
```

The tier is then recalculated using lifetime earned points.

---

## 11. Transaction Ledger

Every points-changing operation creates a `PointsTransaction`.

For example:

```text
Purchase
    ↓
EARN +10
    ↓
Balance after = 110
```

and:

```text
Reward redemption
    ↓
REDEEM -100
    ↓
Balance after = 10
```

This provides an auditable history of point changes.

---

## 12. Running the Project Locally

### Prerequisites

Install:

- Java 17+
- Maven
- Node.js / npm
- Docker
- PostgreSQL if not using Docker

---

### Step 1 — Start PostgreSQL

From the backend directory:

```bash
cd backend
docker compose up -d
```

The provided Docker Compose configuration creates:

```text
Database: loyalty_points
Username: postgres
Password: postgres
Port: 5432
```

---

### Step 2 — Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

---

### Step 3 — Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the Spring Boot backend.

---

## 13. Environment Variables

The backend supports the following environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONTEND_URL
```

Development defaults are provided in:

```text
backend/src/main/resources/application.properties
```

For production deployments, use a strong randomly generated JWT secret and externalised database credentials.

---

## 14. Project Structure

```text
Loyalty_Points/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── REASONING.md
└── AI_LOGS.md
```

---

## 15. Frontend Workflow

The main staff workflow is:

```text
Landing Page
     ↓
Register / Login
     ↓
Dashboard
     ↓
Members
     ↓
Search / Create Member
     ↓
Member Details
     ↓
Record Purchase
     ↓
Points Updated
     ↓
Redeem Reward
     ↓
Transaction History
```

The frontend communicates with the backend exclusively through REST APIs.

---

## 16. Implemented Scope

### Base System

- Member management
- Authentication
- Search
- Pagination
- Sorting
- Purchase processing
- Tier calculation
- Reward redemption
- Transaction history
- React UI
- PostgreSQL persistence

### Level 1 — T3 Backward Compatibility

Implemented:

- Platinum tier
- Lifetime threshold: 5000 points
- Multiplier: 0.3 points / ₹100
- Existing tiers retained
- Existing member balances retained
- Tier recalculation occurs when new points are earned

### Level 2 — T2 Automation

Implemented:

- 90-day expiration timestamps
- Expiration processing
- Balance adjustment
- Expiration transaction records
- Deterministic `/clock` endpoint for testing

### Level 3 — T1 Integration

The Notification Service / outbox integration was intentionally not implemented in this submission.

---

## 17. Testing

The primary user workflow was manually tested during development:

- Staff registration
- Staff login
- Member creation
- Member search
- Purchase recording
- Point calculation
- Tier progression
- Reward redemption
- Transaction history
- Backend compilation
- PostgreSQL connectivity
- Point expiration mechanism

A purchase flow was also used to verify movement from Bronze to Silver after lifetime points crossed the 500-point threshold.

---

## 18. Engineering Notes

The implementation intentionally keeps the domain model straightforward for a time-constrained hands-on exercise.

Point expiry is implemented using transaction-level `expiresAt` timestamps rather than a full point-lot allocation system.

A production-grade implementation could introduce dedicated point lots with FIFO/FEFO consumption rules to precisely determine which earning batches are consumed first when partial redemptions occur.

The current approach prioritises:

- Clear domain entities
- Persistent transaction history
- Testability
- Simple REST APIs
- Maintainable Spring services
- A functional staff UI

---

## 19. Future Features

Three possible next features for the platform are:

### Customer Mobile App

Allow customers to view their points, tier, rewards and transaction history directly from their phones.

### Personalized Offers

Use customer purchase behaviour to provide targeted offers and promotions.

### Analytics

Provide café owners with insights into customer retention, spending behaviour, reward usage and loyalty programme performance.

---

## 20. Documentation

Additional engineering decisions are documented in:

```text
REASONING.md
```

The AI-assisted development conversation required by the assignment is documented separately in:

```text
AI_LOGS.md
```

`AI_LOGS.md` should contain the complete required conversation in its original/unmodified form.

---

## 21. Author

Built as a full-stack hands-on implementation using:

**React + Spring Boot + PostgreSQL**

