# Consultations Answers API Specification

This document describes the RESTful API endpoints for consultation answer management. Answers are created by mentors (users with role=mentor).

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /consultations/answers
Get list of consultation answers with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `consultations_question_id` (optional): Filter by specific consultation question
- `mentor_id` (optional): Filter by mentor who answered
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "consultations_question_id": 1,
      "mentor_id": 2,
      "message": "Based on the job requirements for the Frontend Developer position, I recommend focusing on these key areas...",
      "mentor": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor",
        "bio": "Frontend Developer",
        "experience": "5 years"
      },
      "consultation_question": {
        "id": 1,
        "title": "Frontend Developer Advice",
        "message": "I'm interested in applying for the Frontend Developer position...",
        "student": {
          "id": 1,
          "name": "John Doe"
        }
      },
      "created_at": "2025-09-10T11:00:00Z",
      "updated_at": "2025-09-10T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "total_pages": 13
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid filter parameters"
}
```

### GET /consultations/answers/:answerId
Get detailed information about a specific consultation answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "consultations_question_id": 1,
  "mentor_id": 2,
  "message": "Based on the job requirements for the Frontend Developer position, I recommend focusing on these key areas:\n\n1. React\n2. JavaScript ES6+\n3. CSS frameworks\n4. Git",
  "mentor": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "mentor",
    "bio": "Experienced frontend developer",
    "experience": "5+ years"
  },
  "consultation_question": {
    "id": 1,
    "title": "Frontend Developer Advice",
    "message": "I'm interested in applying for the Frontend Developer position. Could you provide guidance on what specific skills I should focus on?",
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "created_at": "2025-09-10T11:00:00Z",
  "updated_at": "2025-09-13T02:15:00Z"
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### POST /consultations/answers
Create a new consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "consultations_question_id": 1,
  "message": "For the Backend Developer position, I recommend focusing on..."
}
```

**Success Response:**
```json
{
  "message": "Consultation answer created successfully",
  "answer": {
    "id": 25,
    "consultations_question_id": 1,
    "mentor_id": 2,
    "message": "For the Backend Developer position, I recommend focusing on...",
    "created_at": "2025-09-13T01:45:00Z",
    "updated_at": "2025-09-13T01:45:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation question not found or message is required"
}
```

### PUT /consultations/answers/:answerId
Update an existing consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Request:**
```json
{
  "message": "Updated answer with more detailed explanations and additional resources..."
}
```

**Success Response:**
```json
{
  "message": "Consultation answer updated successfully",
  "answer": {
    "id": 1,
    "consultations_question_id": 1,
    "mentor_id": 2,
    "message": "Updated answer with more detailed explanations...",
    "created_at": "2025-09-10T11:00:00Z",
    "updated_at": "2025-09-13T02:15:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### DELETE /consultations/answers/:answerId
Delete a consultation answer.

**Headers:**
```
Authorization: Bearer <mentor_or_admin_token>
```

**Success Response:**
```json
{
  "message": "Consultation answer deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Consultation answer not found or unauthorized"
}
```

### GET /consultations/answers/statistics
Get consultation answers statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_answers": 285,
  "answers_this_month": 45,
  "answers_this_year": 285
}
```

**Error Response:**
```json
{
  "error": "Unauthorized access"
}
```

### GET /consultations/answers/search
Search consultation answers by content.

**Query Parameters:**
- `q`: Search query (message content)
- `consultations_question_id` (optional): Filter by specific question
- `mentor_id` (optional): Filter by mentor who answered
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "consultations_question_id": 1,
      "message": "Based on the job requirements for the Frontend Developer position...",
      "mentor": {
        "name": "Jane Smith",
        "role": "mentor"
      },
      "relevance_score": 0.94,
      "created_at": "2025-09-10T11:00:00Z"
    }
  ],
  "search_metadata": {
    "query": "frontend developer",
    "total_results": 12,
    "search_time_ms": 28
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

**Error Response:**
```json
{
  "error": "Search query is required"
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

*Last updated: 2025-09-16*
