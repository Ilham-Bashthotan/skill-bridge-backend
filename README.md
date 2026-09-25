# Skill Bridge — Backend

REST API for **Skill Bridge**, an e-learning and career platform that connects students with mentors, courses, and job opportunities. Built with **NestJS**, **Prisma**, and **PostgreSQL**.

## Features

- **JWT authentication** with role-based access control for three roles: `admin`, `mentor`, and `student`
- **Courses**: course and material management, mentor assignment, per-material progress tracking, and certificates
- **Forum**: students ask questions, mentors and students answer
- **Consultations**: private question-and-answer sessions between students and mentors
- **Jobs**: admins post job openings that students can browse
- **Admin panel**: manage students, mentors, admins, courses, and jobs
- Request validation with `class-validator` and Zod, structured logging with Winston

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| ORM & Database | Prisma, PostgreSQL |
| Auth | Passport JWT, bcrypt |
| Validation | class-validator, class-transformer, Zod |
| Logging | nest-winston |
| Testing | Jest |

## Project Structure

```
src/
├── admin/                 # Admin panel endpoints
├── common/                # Auth guards, JWT strategy, roles, Prisma & validation services
├── course/                # Courses, materials, progress
├── consultations_question/
├── consultation_answer/
├── forum_question/
├── forum_answer/
├── job/
├── mentor/
├── student/
└── user/                  # Register & login
prisma/                    # Schema, migrations, seed
docs/                      # API specs and route map
test/                      # Jest specs per module
```

## Getting Started

```bash
npm install
# create a .env file with DATABASE_URL and JWT_SECRET
npx prisma migrate deploy
npm run start:dev
```

Or run with Docker: `docker compose up`.

Run tests:

```bash
npm run test
```

## Documentation

- API specifications per module: [`docs/api-spec/`](docs/api-spec)
- Route map: [`docs/routes.md`](docs/routes.md)
- Database design: [`docs/database.md`](docs/database.md)
