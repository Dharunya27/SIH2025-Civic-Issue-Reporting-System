# 🏙️ Crowdsourced Civic Issue Reporting & Resolution System

> **Smart India Hackathon (SIH) 2025** — Problem Statement ID: SIH25128 | Team: SyntaxSena 2.O

A full-stack web application that empowers citizens to report municipal civic issues (potholes, broken streetlights, dustbin overflows, water supply problems) with GPS geotagging, while providing municipal administrators a real-time dashboard to track, assign field workers, and resolve issues within SLA deadlines.

---

## 📸 Features

### 🧑‍💻 Citizen Portal
- **One-click issue reporting** with automatic GPS location capture
- **Category selection** — Road, Street Light, Dustbin Overflow, Water Supply, Others
- **Municipal area & ward auto-fill** from geolocation
- **My Issues tracker** — view submitted issues with live status updates
- **Voter ID–based authentication** with secure JWT tokens

### 🛡️ Administrator Portal
- **Real-time analytics dashboard** — total issues, pending, in-progress, resolved counts
- **Advanced filtering** — filter by status, category, priority (composable, all filters work together)
- **SLA/Priority alerts** — auto-flagged issues nearing the 15-day resolution deadline
- **Worker management** — register field workers (electricians, plumbers, masons) and assign them to issues
- **Status update workflow** — Pending → In Progress → Resolved / Rejected with admin comments
- **Audit trail** — full status change history per issue

### 🔒 Security
- JWT-based stateless authentication (24h token expiry)
- BCrypt password hashing
- Role-based access control (ROLE_USER / ROLE_ADMIN)
- Auto-clear expired tokens on frontend

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17+ · Spring Boot 3.5 · Spring Security · Spring Data JPA |
| **Frontend** | React 19 · TypeScript · Vite · Lucide Icons |
| **Database** | MySQL 8.0 |
| **Auth** | JWT (jjwt) · BCrypt |
| **API Docs** | Swagger UI (OpenAPI 3) |
| **Build** | Maven (backend) · npm (frontend) |

---

## 📁 Project Structure

```
SIH/
├── SIH_2025_civic_issue_reporting_reporting_system/   # Spring Boot Backend
│   ├── src/main/java/com/civicissue/
│   │   ├── config/          # Security, JWT filter, OpenAPI config
│   │   ├── controller/      # REST APIs (Auth, Issues, Admin)
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA Entities (User, Admin, Issue, Worker)
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT util, UserDetails, UserPrincipal
│   │   └── service/         # Business logic (Auth, Issues, Admin)
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Navbar, AuthModal, CitizenDashboard, AdminDashboard
│   │   ├── api.ts           # API client with JWT interceptor
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── App.tsx          # Root component with routing
│   │   └── index.css        # Full CSS design system
│   ├── vite.config.ts       # Vite config with API proxy
│   └── package.json
│
├── start.bat                 # Launch both servers (Windows)
├── stop.bat                  # Stop all servers (Windows)
├── .gitignore
└── README.md                 # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Java JDK | 17 or higher | `java -version` |
| Node.js | 18 or higher | `node -v` |
| npm | 9 or higher | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |

### 1. Database Setup

```sql
-- Open MySQL CLI or MySQL Workbench and run:
CREATE DATABASE civic_issue_db;
```

### 2. Configure Backend

Edit `SIH_2025_civic_issue_reporting_reporting_system/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/civic_issue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Start Backend (Terminal 1)

```bash
cd SIH_2025_civic_issue_reporting_reporting_system
./mvnw spring-boot:run        # Linux/Mac
mvnw.cmd spring-boot:run      # Windows
```

Wait until: `Started CivicissueApplication` (runs on **port 8080**)

### 4. Start Frontend (Terminal 2)

```bash
cd frontend
npm install        # first time only
npm run dev
```

Runs on **http://localhost:3000**

### 5. Quick Launch (Windows)

Just double-click **`start.bat`** — it opens both servers automatically.  
To stop: double-click **`stop.bat`**.

---

## 🌐 Application URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | React Frontend (Citizen & Admin UI) |
| http://localhost:8080/swagger-ui/index.html | Swagger API Documentation |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register citizen (Voter ID) |
| POST | `/api/auth/login` | Citizen login |
| POST | `/api/admin/auth/register` | Register admin (Gov ID) |
| POST | `/api/admin/auth/login` | Admin login |

### Citizen (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/issues` | Report a new civic issue |
| GET | `/api/issues/my-issues` | Get my reported issues |

### Admin (requires JWT + ROLE_ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/issues` | All issues in municipal area |
| GET | `/api/admin/issues/category/{category}` | Filter by category |
| GET | `/api/admin/issues/status/{status}` | Filter by status |
| GET | `/api/admin/issues/ward/{wardNumber}` | Filter by ward |
| GET | `/api/admin/issues/priority` | SLA priority flagged issues |
| PUT | `/api/admin/issues/{id}/status` | Update issue status |
| POST | `/api/admin/issues/{id}/assign` | Assign worker to issue |
| GET | `/api/admin/issues/workers` | List field workers |
| POST | `/api/admin/issues/workers` | Register new worker |
| GET | `/api/admin/analytics` | Dashboard analytics |

---

## 🎯 Issue Categories

| Category | Example Issues |
|----------|---------------|
| `ROAD` | Potholes, broken roads, speed breakers |
| `STREET_LIGHT` | Non-functional lights, broken poles |
| `DUSTBIN_OVERFLOW` | Overflowing bins, garbage not collected |
| `WATER_SUPPLY` | Pipe leaks, no water supply, contamination |
| `OTHERS` | Drainage, encroachment, noise complaints |

## 📊 Issue Lifecycle

```
PENDING  →  IN_PROGRESS  →  RESOLVED
   ↓                           
REJECTED                       
```

- **15-day SLA**: Issues unresolved beyond 15 days are auto-flagged as **Priority**
- **7-day threshold**: Early warning alert for approaching deadlines

---

## 👥 Team — SyntaxSena 2.O

| Name | Role |
|------|------|
| Dhineshkumar I | Full Stack Developer |
| Dharunya V | Database & Tester |

---

## 📄 License

This project is built for **Smart India Hackathon 2025** educational purposes.

---

<p align="center">
  <b>Built with ❤️ for Smart India Hackathon 2025</b><br>
  <i>Empowering citizens. Enabling governance.</i>
</p>

