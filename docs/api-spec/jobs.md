# Jobs API Specification

This document describes the RESTful API endpoints for job management in the platform.

---

## Authentication
Some endpoints require authentication. Include the following HTTP header when required:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /jobs
Get list of all available jobs.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by job title or company
- `location` (optional): Filter by location
- `company` (optional): Filter by company

**Success Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Join our team as a Frontend Developer...",
      "company": "Tech Solutions Inc",
      "requirements": "React, JavaScript, HTML, CSS",
      "location": "Jakarta",
      "admin": {
        "id": 1,
        "user": {
          "name": "Admin User"
        }
      },
      "created_at": "2025-09-13T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid pagination parameters"
}
```

### GET /jobs/:jobId
Get detailed information about a specific job.

**Success Response:**
```json
{
  "id": 1,
  "title": "Frontend Developer",
  "description": "Join our team as a Frontend Developer working on cutting-edge web applications. You will be responsible for creating responsive user interfaces...",
  "company": "Tech Solutions Inc",
  "requirements": "- 2+ years experience with React\n- Strong knowledge of JavaScript\n- Experience with HTML5 and CSS3\n- Familiarity with Git",
  "location": "Jakarta",
  "admin": {
    "id": 1,
    "user": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "position": "content manager"
  },
  "created_at": "2025-09-13T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Job not found"
}
```

### POST /jobs
Create a new job posting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "title": "Backend Developer",
  "description": "We are looking for a skilled Backend Developer to join our team...",
  "company": "Innovation Labs",
  "requirements": "Node.js, Express, MongoDB, API development experience",
  "location": "Bandung"
}
```

**Success Response:**
```json
{
  "message": "Job created successfully",
  "job": {
    "id": 2,
    "admin_id": 1,
    "title": "Backend Developer",
    "description": "We are looking for a skilled Backend Developer to join our team...",
    "company": "Innovation Labs",
    "requirements": "Node.js, Express, MongoDB, API development experience",
    "location": "Bandung",
    "created_at": "2025-09-13T01:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

### PUT /jobs/:jobId
Update an existing job posting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "title": "Senior Frontend Developer",
  "description": "Updated job description...",
  "company": "Tech Solutions Inc",
  "requirements": "Updated requirements...",
  "location": "Jakarta (Remote possible)"
}
```

**Success Response:**
```json
{
  "message": "Job updated successfully",
  "job": {
    "id": 1,
    "title": "Senior Frontend Developer",
    "description": "Updated job description...",
    "company": "Tech Solutions Inc",
    "requirements": "Updated requirements...",
    "location": "Jakarta (Remote possible)",
    "created_at": "2025-09-13T00:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Job not found or unauthorized"
}
```

### DELETE /jobs/:jobId
Delete a job posting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "message": "Job deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Job not found or unauthorized"
}
```

### GET /jobs/admin/my-posts
Get job postings created by the current admin.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (active, inactive)

**Success Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Join our team as a Frontend Developer...",
      "company": "Tech Solutions Inc",
      "location": "Jakarta",
      "created_at": "2025-09-13T00:00:00Z",
      "applications_count": 15,
      "views_count": 120
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "total_pages": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### GET /jobs/search
Advanced job search with multiple filters.

**Query Parameters:**
- `q`: Search query (title, description, company)
- `location`: Filter by location
- `company`: Filter by company
- `requirements`: Search in requirements
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, title, company)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "description": "Join our team as a Frontend Developer...",
      "company": "Tech Solutions Inc",
      "requirements": "React, JavaScript, HTML, CSS",
      "location": "Jakarta",
      "created_at": "2025-09-13T00:00:00Z",
      "relevance_score": 0.95
    }
  ],
  "search_metadata": {
    "query": "frontend developer",
    "total_results": 8,
    "search_time_ms": 45
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "total_pages": 1
  }
}
```

**Error Response:**
```json
{
  "error": "Search query is required"
}
```

### GET /jobs/statistics
Get job posting statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_jobs": 25,
  "active_jobs": 22,
  "jobs_this_month": 5,
  "jobs_this_year": 25,
  "top_companies": [
    {
      "company": "Tech Solutions Inc",
      "job_count": 8
    },
    {
      "company": "Innovation Labs",
      "job_count": 5
    }
  ],
  "top_locations": [
    {
      "location": "Jakarta",
      "job_count": 12
    },
    {
      "location": "Bandung",
      "job_count": 7
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "count": 5
    },
    {
      "month": "2025-08",
      "count": 8
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### GET /jobs/companies
Get list of companies with job postings.

**Success Response:**
```json
{
  "companies": [
    {
      "name": "Tech Solutions Inc",
      "job_count": 8,
      "latest_job": {
        "id": 1,
        "title": "Frontend Developer",
        "created_at": "2025-09-13T00:00:00Z"
      }
    },
    {
      "name": "Innovation Labs",
      "job_count": 5,
      "latest_job": {
        "id": 2,
        "title": "Backend Developer",
        "created_at": "2025-09-12T00:00:00Z"
      }
    }
  ]
}
```

### GET /jobs/locations
Get list of job locations.

**Success Response:**
```json
{
  "locations": [
    {
      "location": "Jakarta",
      "job_count": 12
    },
    {
      "location": "Bandung",
      "job_count": 7
    },
    {
      "location": "Surabaya",
      "job_count": 4
    },
    {
      "location": "Remote",
      "job_count": 2
    }
  ]
}
```

### POST /jobs/:jobId/bookmark
Bookmark a job for later viewing (student only).

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Job bookmarked successfully",
  "bookmark": {
    "id": 1,
    "student_id": 1,
    "job_id": 1,
    "created_at": "2025-09-13T01:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Job already bookmarked"
}
```

### DELETE /jobs/:jobId/bookmark
Remove job bookmark (student only).

**Headers:**
```
Authorization: Bearer <student_token>
```

**Success Response:**
```json
{
  "message": "Job bookmark removed successfully"
}
```

**Error Response:**
```json
{
  "error": "Bookmark not found"
}
```

### GET /jobs/bookmarks
Get bookmarked jobs for current student.

**Headers:**
```
Authorization: Bearer <student_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "bookmarks": [
    {
      "id": 1,
      "job": {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Solutions Inc",
        "location": "Jakarta",
        "created_at": "2025-09-13T00:00:00Z"
      },
      "bookmarked_at": "2025-09-13T01:30:00Z"
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

---

## Error Response (General)
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

*Last updated: 2025-09-13*
