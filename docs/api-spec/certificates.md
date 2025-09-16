# Certificates API Specification

This document describes the RESTful API endpoints for certificate management. Certificates are issued per (student[user], course) pair using the unified users model.

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /certificates
Get certificates for the current user (student).

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `course_id` (optional): Filter by specific course

**Success Response:**
```json
{
  "certificates": [
    {
      "id": 1,
      "student_id": 1,
      "course_id": 1,
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "certificate_url": "https://certificates.skillbridge.com/cert_123.pdf",
      "created_at": "2025-09-10T00:00:00Z",
      "updated_at": "2025-09-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Student not found"
}
```

### GET /certificates/:certificateId
Get specific certificate details.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "id": 1,
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "course": {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn basic programming concepts"
  },
  "certificate_url": "https://certificates.skillbridge.com/cert_123.pdf",
  "created_at": "2025-09-10T00:00:00Z",
  "updated_at": "2025-09-10T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Certificate not found or unauthorized"
}
```

### POST /certificates/generate
Generate a certificate for a completed course.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Request:**
```json
{
  "course_id": 1
}
```

**Success Response:**
```json
{
  "message": "Certificate generated successfully",
  "certificate": {
    "id": 2,
    "student_id": 1,
    "course_id": 1,
    "certificate_url": "https://certificates.skillbridge.com/cert_124.pdf",
    "created_at": "2025-09-13T00:00:00Z",
    "updated_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Course not completed or already has certificate"
}
```

// Verification by code is not modeled in the schema and is omitted.

### GET /certificates/download/:certificateId
Download certificate PDF file.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
Binary PDF file with appropriate headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="certificate_programming_john_doe.pdf"
```

**Error Response:**
```json
{
  "error": "Certificate not found or unauthorized"
}
```

### GET /certificates/admin/all
Get all certificates (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `course_id` (optional): Filter by course
- `student_id` (optional): Filter by student
- `date_from` (optional): Filter by issue date from
- `date_to` (optional): Filter by issue date to

**Success Response:**
```json
{
  "certificates": [
    {
      "id": 1,
      "student": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "course": {
        "id": 1,
        "title": "Introduction to Programming"
      },
      "certificate_url": "https://certificates.skillbridge.com/cert_123.pdf",
  "created_at": "2025-09-10T00:00:00Z",
  "updated_at": "2025-09-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### POST /certificates/admin/generate/:studentId/:courseId
Generate certificate for a specific student and course (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "Certificate generated successfully",
  "certificate": {
    "id": 5,
    "student_id": 1,
    "course_id": 1,
    "certificate_url": "https://certificates.skillbridge.com/cert_125.pdf",
    "created_at": "2025-09-13T01:00:00Z",
    "updated_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Student has not completed the course"
}
```

### DELETE /certificates/admin/:certificateId
Revoke/delete a certificate (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "Certificate revoked successfully"
}
```

**Error Response:**
```json
{
  "error": "Certificate not found"
}
```

### GET /certificates/statistics
Get certificate statistics for current student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "total_certificates": 3,
  "certificates_this_month": 1,
  "certificates_this_year": 3,
  "latest_certificate": {
    "id": 3,
    "course_title": "Web Development Basics",
    "created_at": "2025-09-08T00:00:00Z"
  }
}
```

### GET /certificates/admin/statistics
Get overall certificate statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_certificates_issued": 450,
  "certificates_this_month": 35,
  "certificates_this_year": 420
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

// Regeneration and verification codes are not modeled and are omitted.

---

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-16*
