# API Specification


This document describes the RESTful API endpoints for the platform, including request and response examples for both success and error cases.

---

## Authentication
Some endpoints require authentication. For these endpoints, include the following HTTP header:

```
Authorization: Bearer <token>
```

The token is obtained from the `/login` endpoint.

---

## Auth & Users

### POST /login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```
**Success Response:**
```json
{
  "token": "jwt_token",
  "user": { "id": 1, "name": "User", "role": "student" }
}
```
**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### POST /register
**Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "08123456789",
  "password": "string"
}
```
**Success Response:**
```json
{
  "message": "Registration successful",
  "user": { "id": 1, "name": "User Name", "email": "user@example.com" }
}
```
**Error Response:**
```json
{
  "error": "Email already exists"
}
```

---

## Admin Panel /admin

### GET /admin/dashboard
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "users_count": 100,
  "courses_count": 10,
  "jobs_count": 5
}
```

### GET /admin/users/students
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "name": "Student 1", "email": "student1@example.com", "education_level": "SMA" }
]
```

### GET /admin/users/mentors
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "name": "Mentor 1", "email": "mentor1@example.com", "expertise": "Math", "is_active": true }
]
```

### GET /admin/users/admins
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "name": "Admin 1", "email": "admin1@example.com", "position": "super admin" }
]
```

### GET /admin/jobs/list
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Job Title", "company": "Company", "location": "Jakarta" }
]
```

### POST /admin/jobs/create
**Headers:**
```
Authorization: Bearer <token>
```
**Request:**
```json
{
  "title": "Job Title",
  "description": "Job description",
  "company": "Company Name",
  "requirements": "Requirements",
  "location": "Jakarta"
}
```
**Success Response:**
```json
{
  "message": "Job created successfully",
  "job_id": 1
}
```
**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

### GET /admin/courses/list
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Course Title", "duration": "4 weeks" }
]
```

### POST /admin/courses/create
**Headers:**
```
Authorization: Bearer <token>
```
**Request:**
```json
{
  "title": "Course Title",
  "description": "Description",
  "duration": "4 weeks"
}
```
**Success Response:**
```json
{
  "message": "Course created successfully",
  "course_id": 1
}
```
**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

### PUT /admin/courses/:courseId/edit
**Headers:**
```
Authorization: Bearer <token>
```
**Request:**
```json
{
  "title": "New Title",
  "description": "New Description",
  "duration": "6 weeks"
}
```
**Success Response:**
```json
{
  "message": "Course updated successfully"
}
```
**Error Response:**
```json
{
  "error": "Course not found"
}
```

---

## Students /student

### GET /student/dashboard
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "enrolled_courses": 3,
  "completed_courses": 1,
  "certificates": 1
}
```

### GET /student/courses/enrolled
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Course Title", "progress": 80 }
]
```

### GET /student/courses/:courseId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Description",
  "progress": 80
}
```
**Error Response:**
```json
{
  "error": "Course not found"
}
```

### GET /student/courses/:courseId/materials
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Material 1", "material_type": "video" }
]
```

### GET /student/courses/:courseId/certificate
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "certificate_url": "https://.../certificate.pdf",
  "issued_at": "2025-09-06T00:00:00Z"
}
```
**Error Response:**
```json
{
  "error": "Certificate not available"
}
```

### GET /student/jobs/list
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Job Title", "company": "Company" }
]
```

### GET /student/jobs/:jobId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "title": "Job Title",
  "description": "Description",
  "company": "Company",
  "requirements": "Requirements",
  "location": "Jakarta"
}
```
**Error Response:**
```json
{
  "error": "Job not found"
}
```

### GET /student/forum/questions
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Question Title", "created_at": "2025-09-06T00:00:00Z" }
]
```

### GET /student/forum/:questionsId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "title": "Question Title",
  "content": "Question content",
  "answers": [
    { "id": 1, "user": "Mentor 1", "content": "Answer content" }
  ]
}
```
**Error Response:**
```json
{
  "error": "Question not found"
}
```

### GET /student/consultations/list
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "job_topic": "Job Title", "status": "open" }
]
```

### GET /student/consultations/:consultationId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "job_topic": "Job Title",
  "messages": [
    { "id": 1, "user": "Mentor 1", "message": "Consultation reply" }
  ]
}
```
**Error Response:**
```json
{
  "error": "Consultation not found"
}
```

---

## Mentors /mentor

### GET /mentor/dashboard
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "assigned_courses": 2,
  "consultations": 1
}
```

### GET /mentor/courses/assigned
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Course Title" }
]
```

### GET /mentor/courses/:courseId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Description"
}
```
**Error Response:**
```json
{
  "error": "Course not found"
}
```

### GET /mentor/courses/:courseId/materials
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Material 1", "material_type": "video" }
]
```

### GET /mentor/courses/:courseId/students
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "name": "Student 1", "progress": 80 }
]
```

### GET /mentor/forum/questions
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "title": "Question Title", "created_at": "2025-09-06T00:00:00Z" }
]
```

### GET /mentor/forum/:questionsId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "title": "Question Title",
  "content": "Question content",
  "answers": [
    { "id": 1, "user": "Mentor 1", "content": "Answer content" }
  ]
}
```
**Error Response:**
```json
{
  "error": "Question not found"
}
```

### GET /mentor/consultations/list
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
[
  { "id": 1, "job_topic": "Job Title", "status": "open" }
]
```

### GET /mentor/consultations/:consultationId
**Headers:**
```
Authorization: Bearer <token>
```
**Success Response:**
```json
{
  "id": 1,
  "job_topic": "Job Title",
  "messages": [
    { "id": 1, "user": "Student 1", "message": "Consultation question" }
  ]
}
```
**Error Response:**
```json
{
  "error": "Consultation not found"
}
```

---

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-06*
