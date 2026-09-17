
### 2. Create `REASONING.md`

Paste:

```markdown
# Engineering Reasoning

## 1. Architecture

I chose a React + Spring Boot + PostgreSQL architecture.

React provides the staff-facing interface while Spring Boot exposes REST APIs and contains the business logic. PostgreSQL provides persistent storage for members, tiers, rewards, users and transaction history.

This separation keeps UI concerns separate from loyalty business rules.

## 2. Database Design

The loyalty system uses separate entities for:

- Members
- Tiers
- Rewards
- Points transactions
- Authentication users

The `Member` entity stores both:

- `currentPoints`
- `lifetimeEarnedPoints`

This distinction is important because redeeming points should reduce the usable balance but should not reduce the lifetime points used for determining a customer's tier.

Transactions are persisted separately to provide an audit trail.

## 3. Tier Calculation

Tier selection is based on lifetime earned points.

After a purchase:

1. Calculate points using the member's current multiplier.
2. Add the points to the current balance.
3. Add the points to lifetime earned points.
4. Recalculate the tier.
5. Persist the member and transaction.

The highest configured tier whose minimum lifetime threshold has been reached is selected.

## 4. Backward Compatibility / Platinum

The original Bronze, Silver and Gold tiers are retained.

Platinum was added with:

- Minimum lifetime points: 5000
- Multiplier: 0.3 points per ₹100

Existing members are not reset when Platinum is introduced. Their stored balances, lifetime points and existing tiers remain unchanged unless a subsequent points calculation causes them to qualify for a different tier.

## 5. Point Expiration

For the 90-day expiration requirement, earned transactions contain an `expiresAt` timestamp.

A clock endpoint allows the system to process expiration against a supplied timestamp:

`POST /clock`

This makes the feature deterministic and testable without waiting 90 real days.

When an earned transaction reaches its expiry time:

1. The member's available balance is reduced.
2. An expiration transaction is recorded.
3. The original expiry marker is cleared so it is not processed repeatedly.

Expiration does not reduce lifetime earned points because expired points were earned historically and tier qualification is based on lifetime earnings.

## 6. Why Use a Transaction Ledger

Every earn and redemption operation creates a `PointsTransaction`.

This provides an audit history instead of only storing a changing numeric balance.

The transaction stores the resulting balance using `balanceAfter`, making the member's point history easier to inspect.

## 7. Authentication

Staff authentication uses Spring Security with BCrypt password hashing and JWT tokens.

Public endpoints are limited to authentication and active rewards. Staff operations require an authenticated staff role.

The frontend stores the JWT and attaches it to API requests through an Axios interceptor.

## 8. Search and Pagination

Member search is implemented through Spring Data JPA.

Search can match member name or phone number.

Pagination and sorting are handled using Spring's `Pageable`, avoiding the need to load every member into memory.

## 9. Frontend Design

The frontend focuses on the workflows most relevant to café staff:

- Login
- Registration
- Dashboard
- Member management
- Member details
- Purchase recording
- Reward redemption
- Transaction history

The interface communicates with the REST API rather than directly accessing the database.

## 10. Scope Decision

The task contained a third integration level involving a Notification Service and outbox.

Due to the limited implementation window, I prioritised the core loyalty functionality and the two compatibility/automation requirements:

- Level 1 — Platinum tier
- Level 2 — 90-day point expiration

The Level 3 notification/outbox integration was intentionally not implemented.

## 11. Trade-offs

The expiration implementation uses transaction-level expiry timestamps rather than a more complex point-lot allocation system.

A production system with partial redemptions across multiple earning batches could use dedicated point lots and FIFO/FEFO allocation to determine exactly which earned points are consumed first.

For this implementation, the transaction ledger keeps the design small, understandable and testable within the available development time.

## 12. Testing Approach

The main user workflow was manually verified:

1. Staff registration/login
2. Member creation
3. Member search
4. Purchase recording
5. Point calculation
6. Tier progression
7. Reward redemption
8. Transaction history
9. Backend compilation/startup
10. Point expiration through the clock endpoint

The application is designed so the `/clock` endpoint can be used to deterministically test expiration behaviour.