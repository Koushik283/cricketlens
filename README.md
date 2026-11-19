# CricketLens 🏏
### ODI Cricket Analytics and Management System

CricketLens is a web-based cricket analytics and management platform designed to manage ODI cricket data and provide meaningful statistical insights into teams, players, and matches. The application combines a relational database using MySQL with MongoDB for feedback storage and uses a modern web interface built with Next.js.

The project demonstrates practical implementation of DBMS concepts including relational database design, SQL queries, joins, aggregate functions, views, triggers, stored procedures, stored functions, CTEs, transactions, and NoSQL database operations.

---

## 🎯 Project Objectives

- Manage ODI cricket teams, players, venues, and matches.
- Display player and team statistics through an interactive dashboard.
- Calculate batting and bowling statistics.
- Allow administrators to add players and schedule matches.
- Allow administrators to complete matches and record innings and scorecards.
- Implement role-based access control for Admin and Viewer users.
- Demonstrate advanced SQL and MongoDB database operations.

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Node.js

### Databases
- MySQL – Relational database for cricket data.
- MongoDB – NoSQL database for feedback.

### Authentication & Security
- JWT Authentication
- bcrypt password hashing
- HTTP-only cookies
- Role-based authorization

---

## ✨ Features

### Dashboard
- Overview of teams, players, matches, and cricket statistics.
- Recent match information.
- Top player statistics.

### Teams
- View participating ODI teams.
- Explore team information.

### Players
- Browse player information.
- View batting and bowling details.

### Matches
- View match details, participating teams, venue, result, and status.

### Statistics
- Player run and wicket leaderboards.
- Batting average.
- Strike rate.
- Bowling economy.
- Highest individual score.
- Team performance statistics.

### User Authentication
- User registration and login.
- Password hashing.
- JWT-based authentication.
- Viewer and Admin roles.

### Admin Panel
- Add new players.
- Schedule matches.
- Manage scheduled matches.
- Enter innings and scorecard information.
- Complete matches and update match results.

### Feedback
- Submit feedback through the application.
- Store feedback using MongoDB.

---

## 🗄️ Database Design

### MySQL Tables

| Table | Description |
|---|---|
| APP_USER | Stores user accounts and roles |
| TEAM | Stores cricket team information |
| PLAYER | Stores player information |
| VENUE | Stores venue details |
| CRICKET_MATCH | Stores match details and results |
| INNINGS | Stores innings-level statistics |
| SCORECARD | Stores individual player performance data |

### MongoDB

MongoDB is used for storing application feedback in the `match_feedback` collection.

---

## 📚 DBMS Concepts Implemented

### 1. Joins
Used to combine data from multiple tables such as players, teams, matches, innings, and scorecards.

### 2. Aggregate Functions
Functions such as `SUM()`, `COUNT()`, `AVG()`, and `MAX()` are used for statistical calculations and reporting.

### 3. Views
Views provide reusable queries for database reports.

Implemented views:
- `PLAYER_CAREER_STATS`
- `MATCH_RESULTS`
- `INNINGS_SUMMARY`

### 4. Triggers
Triggers are used to perform validation when records are inserted into relevant tables, including match, innings, and scorecard data.

### 5. Stored Procedures
Stored procedures are implemented for reusable database operations such as retrieving player career statistics, players by team, match details, and top run scorers.

### 6. Stored Functions
Stored functions calculate cricket-related values such as:

- Batting Average
- Strike Rate
- Bowling Economy

### 7. Common Table Expressions (CTEs)
CTEs are used to structure complex analytical queries in the Admin SQL Analytics section.

### 8. Transactions
Transactions are used to maintain consistency during match completion. Innings records, scorecard entries, and match status updates are handled as a single logical operation.

### 9. Indexes
Indexes are implemented to improve data retrieval performance for selected database queries.

### 10. MongoDB CRUD and Aggregation
MongoDB operations demonstrate:
- Insert
- Find
- Update
- Delete
- Sorting
- Limiting
- Aggregation

---

## 🔐 Authentication and Authorization

CricketLens provides two user roles:

### Viewer
- View teams, players, matches, and statistics.
- Access regular application features.

### Admin
- Access administrative functionality.
- Add players.
- Schedule matches.
- Manage matches.
- Enter match scorecards.
- Complete scheduled matches.
- Access database analytics and reports.

Passwords are hashed using bcrypt, and authentication is handled using JWT tokens stored in HTTP-only cookies.

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- MySQL Server
- MongoDB Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Koushik283/cricketlens.git
```

### 2. Navigate to the Project Directory

```bash
cd cricketlens/cricketlens-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=CricketLens_New

MONGODB_URI=mongodb://127.0.0.1:27017

JWT_SECRET=your_secure_secret
```

Replace the placeholder values with your local configuration.

**Do not commit `.env.local` to GitHub.**

### 5. Setup MySQL Database

Run the SQL files provided in the `Sql Files` folder in the appropriate order to create the database, tables, insert data, and configure the required database objects.

### 6. Start MySQL and MongoDB

Ensure that both database servers are running.

### 7. Start the Development Server

```bash
npm run dev
```

### 8. Open the Application

Visit:

http://localhost:3000

---

## 📁 Project Structure

```text
cricketlens-frontend/
│
├── Diagrams/
│
├── Sql Files/
│   ├── Creation.sql
│   ├── Insertion.sql
│   ├── Views.sql
│   ├── Triggers.sql
│   ├── Procedures.sql
│   ├── Functions.sql
│   ├── Transactions.sql
│   ├── Indexes.sql
│   └── Complex_Queries.sql
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── players/
│   │   │   ├── teams/
│   │   │   ├── matches/
│   │   │   ├── statistics/
│   │   │   ├── dashboard/
│   │   │   └── feedback/
│   │   │
│   │   ├── admin/
│   │   ├── players/
│   │   ├── teams/
│   │   ├── matches/
│   │   ├── statistics/
│   │   ├── login/
│   │   ├── register/
│   │   └── feedback/
│   │
│   ├── components/
│   └── lib/
│       ├── db.ts
│       ├── mongodb.ts
│       └── auth.ts
│
├── .env.local
├── package.json
└── README.md
```

---

## 👥 Team Members

| SRN | Name |
|---|---|
| PES1UG24CS128 | C Sreekrishna Koushik |
| PES1UG24CS135 | C Rohan |
| PES1UG24CS139 | D Pranav Sai |

---

## 📌 Academic Project

CricketLens was developed as a Database Management Systems (DBMS) Level 3 project to demonstrate database design, SQL programming, relational and NoSQL database integration, backend development, and application-level database operations.

---

## ⚠️ Data Disclaimer

The cricket data used in the project is illustrative/synthetic data intended for academic demonstration and testing purposes. It is not an official historical ODI dataset.

---

## 📄 Documentation

The repository contains SQL implementation files and database diagrams for understanding the database design and implementation.

