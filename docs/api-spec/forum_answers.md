# Forum Answers API Specification

This document describes the RESTful API endpoints for forum answer management in the platform.

---

## Authentication
All endpoints require authentication. Include the following HTTP header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### GET /forum/answers
Get list of forum answers with filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `question_id` (optional): Filter by specific question
- `user_id` (optional): Filter by user who answered
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, likes_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "user_id": 2,
      "content": "React hooks are functions that let you use state and other React features in functional components...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor"
      },
      "question": {
        "id": 1,
        "title": "How to implement React hooks?"
      },
      "likes_count": 5,
      "is_liked": false,
      "created_at": "2025-09-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 85,
    "total_pages": 9
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid filter parameters"
}
```

### GET /forum/answers/:answerId
Get detailed information about a specific answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "id": 1,
  "question_id": 1,
  "user_id": 2,
  "content": "React hooks are functions that let you use state and other React features in functional components. Here's a detailed explanation:\n\n1. useState: Manages component state\n2. useEffect: Handles side effects...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "mentor",
    "expertise": "Programming and Web Development"
  },
  "question": {
    "id": 1,
    "title": "How to implement React hooks?",
    "content": "I'm having trouble understanding...",
    "student": {
      "user": {
        "name": "John Doe"
      }
    }
  },
  "likes_count": 5,
  "is_liked": false,
  "created_at": "2025-09-10T10:30:00Z"
}
```

**Error Response:**
```json
{
  "error": "Answer not found"
}
```

### POST /forum/answers
Create a new forum answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "question_id": 1,
  "content": "Based on my experience, here are some best practices for API design:\n\n1. Use clear and consistent naming conventions\n2. Implement proper HTTP status codes\n3. Version your APIs..."
}
```

**Success Response:**
```json
{
  "message": "Answer created successfully",
  "answer": {
    "id": 15,
    "question_id": 1,
    "user_id": 2,
    "content": "Based on my experience, here are some best practices for API design...",
    "created_at": "2025-09-13T01:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Question not found or content is required"
}
```

### PUT /forum/answers/:answerId
Update an existing forum answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Updated answer with more detailed explanations and examples..."
}
```

**Success Response:**
```json
{
  "message": "Answer updated successfully",
  "answer": {
    "id": 1,
    "question_id": 1,
    "user_id": 2,
    "content": "Updated answer with more detailed explanations and examples...",
    "created_at": "2025-09-10T10:30:00Z",
    "updated_at": "2025-09-13T02:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Answer not found or unauthorized"
}
```

### DELETE /forum/answers/:answerId
Delete a forum answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "message": "Answer deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Answer not found or unauthorized"
}
```

### GET /forum/answers/question/:questionId
Get all answers for a specific question.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, likes_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "question": {
    "id": 1,
    "title": "How to implement React hooks?",
    "content": "I'm having trouble understanding...",
    "student": {
      "user": {
        "name": "John Doe"
      }
    },
    "created_at": "2025-09-10T09:00:00Z"
  },
  "answers": [
    {
      "id": 1,
      "user_id": 2,
      "content": "React hooks are functions that let you use state...",
      "user": {
        "id": 2,
        "name": "Jane Smith",
        "role": "mentor"
      },
      "likes_count": 5,
      "is_liked": false,
      "created_at": "2025-09-10T10:30:00Z"
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
  "error": "Question not found"
}
```

### GET /forum/answers/my-answers
Get answers provided by the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort by (created_at, likes_count)
- `order` (optional): Sort order (asc, desc)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "content": "React hooks are functions that let you use state...",
      "question": {
        "id": 1,
        "title": "How to implement React hooks?",
        "student": {
          "user": {
            "name": "John Doe"
          }
        }
      },
      "likes_count": 5,
      "created_at": "2025-09-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

### POST /forum/answers/:answerId/like
Like or unlike a forum answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "message": "Answer liked successfully",
  "answer": {
    "id": 1,
    "likes_count": 6,
    "is_liked": true
  }
}
```

**Error Response:**
```json
{
  "error": "Answer not found"
}
```

### DELETE /forum/answers/:answerId/like
Remove like from a forum answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
```json
{
  "message": "Like removed successfully",
  "answer": {
    "id": 1,
    "likes_count": 5,
    "is_liked": false
  }
}
```

**Error Response:**
```json
{
  "error": "Like not found"
}
```

### GET /forum/answers/:answerId/likes
Get users who liked a specific answer.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "answer": {
    "id": 1,
    "content": "React hooks are functions...",
    "likes_count": 5
  },
  "likes": [
    {
      "id": 1,
      "user": {
        "id": 3,
        "name": "Alice Johnson",
        "role": "student"
      },
      "liked_at": "2025-09-10T11:00:00Z"
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
  "error": "Answer not found"
}
```

### GET /forum/answers/search
Search forum answers by content.

**Query Parameters:**
- `q`: Search query (content)
- `question_id` (optional): Filter by specific question
- `user_id` (optional): Filter by user who answered
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "content": "React hooks are functions that let you use state...",
      "user": {
        "name": "Jane Smith",
        "role": "mentor"
      },
      "question": {
        "title": "How to implement React hooks?"
      },
      "relevance_score": 0.94,
      "likes_count": 5,
      "created_at": "2025-09-10T10:30:00Z"
    }
  ],
  "search_metadata": {
    "query": "react hooks",
    "total_results": 8,
    "search_time_ms": 25
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

### GET /forum/answers/statistics
Get forum answers statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response:**
```json
{
  "total_answers": 285,
  "answers_this_month": 45,
  "answers_this_year": 285,
  "average_answers_per_question": 2.8,
  "most_helpful_users": [
    {
      "user_id": 2,
      "user_name": "Jane Smith",
      "answers_count": 35,
      "total_likes": 125
    }
  ],
  "most_liked_answers": [
    {
      "answer_id": 1,
      "content_preview": "React hooks are functions...",
      "likes_count": 15,
      "question_title": "How to implement React hooks?"
    }
  ],
  "monthly_breakdown": [
    {
      "month": "2025-09",
      "answers": 45,
      "likes": 128
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

### POST /forum/answers/:answerId/report
Report an answer for inappropriate content.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "reason": "inappropriate content",
  "description": "This answer contains offensive language"
}
```

**Success Response:**
```json
{
  "message": "Answer reported successfully",
  "report_id": 1
}
```

**Error Response:**
```json
{
  "error": "Reason is required"
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
