# 🏛️ Civic Issue Reporting System

A **Smart India Hackathon (SIH) 2025** project - A crowdsourced civic issue reporting and resolution platform that empowers citizens to report municipal problems and enables administrators to efficiently manage and resolve them.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Team](#team)

## 🎯 Overview

The Civic Issue Reporting System is a comprehensive web-based platform designed to bridge the gap between citizens and municipal authorities. It allows residents to report civic issues (road damage, street lights, water supply, etc.) with geolocation, photos, and voice notes, while providing administrators with powerful tools to track, assign, and resolve these issues efficiently.

### Key Stakeholders

- **Citizens**: Report issues, track status, receive updates
- **Administrators**: Manage issues, assign workers, view analytics
- **Workers**: Execute issue resolution tasks

## ✨ Features

### For Citizens (Users)
- ✅ User registration with Voter ID verification
- 📍 Report civic issues with GPS coordinates
- 📸 Attach photos and voice notes to reports
- 📊 Track issue status in real-time
- 🔔 Receive updates on reported issues
- 🗺️ View all personal reports with status

### For Administrators
- 📋 View all issues in assigned municipal area
- 🎯 Filter issues by category, status, or ward
- ⚡ Priority issue identification (SLA tracking)
- 👷 Assign issues to field workers
- 📈 Analytics dashboard with insights
- 👤 Manage worker profiles

### System Features
- 🔐 JWT-based authentication & authorization
- 🛡️ Role-based access control (RBAC)
- 📊 Issue status tracking with history
- ⏱️ Automated SLA deadline management
- 🔍 Priority classification based on age
- 📍 Geographic clustering by municipal area

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 21
- **Security**: Spring Security + JWT
- **Database**: MySQL
- **ORM**: Spring Data JPA (Hibernate)
- **Validation**: Jakarta Validation
- **Build Tool**: Maven

### Key Dependencies
```xml
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- MySQL Driver (mysql-connector-j)
- JWT (jjwt-api, jjwt-impl, jjwt-jackson)
- Lombok
```

## 🏗️ Architecture

```
civicissue/
├── src/main/java/com/civicissue/
│   ├── config/           # Security & JWT Configuration
│   ├── controller/       # REST API Controllers
│   │   ├── AuthController.java
│   │   ├── IssueController.java
│   │   ├── UserController.java
│   │   └── admin/
│   │       ├── AdminAuthController.java
│   │       ├── AdminIssueController.java
│   │       └── AnalyticsController.java
│   ├── dto/              # Data Transfer Objects
│   ├── entity/           # JPA Entities
│   │   ├── User.java
│   │   ├── Admin.java
│   │   ├── Issue.java
│   │   ├── Worker.java
│   │   └── IssueStatusHistory.java
│   ├── repository/       # Spring Data Repositories
│   ├── security/         # JWT & Security Components
│   ├── service/          # Business Logic
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── IssueService.java
│   │   └── admin/
│   │       ├── AdminService.java
│   │       ├── AdminAuthService.java
│   │       └── AnalyticsService.java
│   └── CivicissueApplication.java
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── README.md
```

## 🚀 Installation

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd civicissue
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE civic_issue_db;
   ```

3. **Configure Application**
   
   Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/civic_issue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   jwt.secret=yourSuperSecretKeyForJWTGenerationAtLeast256BitsLong
   ```

4. **Build the Project**
   ```bash
   ./mvnw clean install
   ```

5. **Run the Application**
   ```bash
   ./mvnw spring-boot:run
   ```

   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

6. **Access the API & Swagger UI**
   - Browser UI / Swagger: `http://localhost:8080/` (or `http://localhost:8080/swagger-ui/index.html`)
   - API endpoints: `http://localhost:8080/api/...`

7. **Run the React Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000/` in your browser.

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new citizen |
| POST | `/api/auth/login` | Login and receive JWT |

**Register Request:**
```json
{
  "voterId": "ABC1234567",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "password": "securePassword",
  "state": "Jharkhand",
  "district": "Ranchi",
  "municipalArea": "Ranchi Municipal Corporation"
}
```

**Login Request:**
```json
{
  "voterId": "ABC1234567",
  "password": "securePassword"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "id": 1,
  "voterId": "ABC1234567",
  "name": "John Doe"
}
```

#### Admin Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/register` | Register new admin |
| POST | `/api/admin/auth/login` | Admin login |

### User Endpoints (Requires JWT + ROLE_USER)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/issues` | Report new issue |
| GET | `/api/issues/my-issues` | Get user's reported issues |

**Create Issue Request:**
```json
{
  "description": "Street light not working near main road",
  "photoUrl": "https://example.com/photo.jpg",
  "voiceNoteUrl": "https://example.com/voice.mp3",
  "latitude": 23.3441,
  "longitude": 85.3096,
  "municipalWardNumber": 12,
  "municipalArea": "Ranchi Municipal Corporation",
  "category": "STREET_LIGHT"
}
```

### Admin Endpoints (Requires JWT + ROLE_ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/issues` | Get all issues in admin's area |
| GET | `/api/admin/issues/category/{category}` | Filter by category |
| GET | `/api/admin/issues/status/{status}` | Filter by status |
| GET | `/api/admin/issues/ward/{wardNumber}` | Filter by ward |
| GET | `/api/admin/issues/priority` | Get priority issues |
| PUT | `/api/admin/issues/{issueId}/status` | Update issue status |
| POST | `/api/admin/issues/{issueId}/assign` | Assign issue to worker |
| GET | `/api/admin/issues/workers` | Get all workers |
| POST | `/api/admin/issues/workers` | Create new worker |
| GET | `/api/admin/analytics` | Get analytics dashboard |

**Update Status Request:**
```json
{
  "status": "IN_PROGRESS",
  "comment": "Worker assigned, working on it"
}
```

**Assign Worker Request:**
```json
{
  "workerId": 1,
  "priority": "HIGH",
  "notes": "Urgent repair needed"
}
```

## 🗄️ Database Schema

### Entity Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │──────<│    Issue    │>──────│   Worker    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ voterId     │       │ reportId    │       │ name        │
│ name        │       │ user_id(FK) │       │ contact     │
│ email       │       │ description │       │ municipalArea│
│ phoneNumber │       │ photoUrl    │       │ createdAt   │
│ password    │       │ voiceNoteUrl│       └─────────────┘
│ state       │       │ latitude    │
│ district    │       │ longitude   │       ┌─────────────┐
│ municipalArea│      │ wardNumber  │       │    Admin    │
│ role        │       │ category    │       ├─────────────┤
│ createdAt   │       │ status      │       │ id (PK)     │
└─────────────┘       │ createdAt   │       │ govId       │
                      │ updatedAt   │       │ name        │
                      │ assignedWorker_id│   │ email       │
                      │ isUrgent    │       │ phone       │
                      └─────────────┘       │ password    │
                              │             │ workingMunicipalArea
                              │             │ role        │
                              ▼             │ createdAt   │
                      ┌─────────────┐       └─────────────┘
                      │IssueStatusHistory
                      ├─────────────┤
                      │ id (PK)     │
                      │ issue_id(FK)│
                      │ status      │
                      │ changedBy   │
                      │ comment     │
                      │ changedAt   │
                      └─────────────┘
```

## ⚙️ Configuration

### Application Properties

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/civic_issue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=yourSuperSecretKeyForJWTGenerationAtLeast256BitsLong
jwt.expiration=86400000

# Server Configuration
server.port=8080
spring.application.name=civicissue

# Business Logic Configuration
issue.priority.threshold-days=7
issue.sla.deadline-days=15
```

### Environment Variables

For production deployment, use environment variables:

```bash
export DB_URL=jdbc:mysql://localhost:3306/civic_issue_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
export DB_USERNAME=root
export DB_PASSWORD=secure_password
export JWT_SECRET=your_production_secret_key
```

## 🔒 Security

- **JWT Authentication**: Stateless authentication with JWT tokens
- **Role-Based Access Control**: Separate roles for USER and ADMIN
- **Password Security**: Encrypted password storage using BCrypt
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Jakarta Bean Validation for all inputs

## 📊 Issue Categories

- **ROAD**: Road damage, potholes, etc.
- **STREET_LIGHT**: Street light issues
- **DUSTBIN_OVERFLOW**: Waste management
- **WATER_SUPPLY**: Water supply problems
- **OTHERS**: Miscellaneous issues

## 🔄 Issue Status Flow

```
PENDING → IN_PROGRESS → RESOLVED
   ↓
REJECTED
```

## 👥 Team

**Smart India Hackathon 2025**

This project was developed as part of the Smart India Hackathon 2025, addressing the problem statement of creating a crowdsourced civic issue reporting and resolution system.

## 📄 License

This project is developed for Smart India Hackathon 2025. All rights reserved.

## 🤝 Contributing

This is a hackathon project. For contributions or suggestions, please contact the development team.

---

**Made with ❤️ for Smart India Hackathon 2025**
