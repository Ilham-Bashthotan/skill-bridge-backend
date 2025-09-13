
# Routes

## Auth & Users `/auth`
- /login
- /register

## Admin Panel `/admin`

- /dashboard
- /users
  - /students
  - /mentors
  - /admins
- /jobs
  - /list
  - /create
- /courses
  - /list
  - /create
  - /:courseId/edit


## Students `/student`
- /dashboard
- /courses
  - /enrolled
  - /:courseId
    - /materials
    - /certificate
- /jobs
  - /list
  - /:jobId
- /forum
  - /questions
  - /:questionsId
- /consultations
  - /list
  - /:consultationId

## Mentors `/mentor`
- /dashboard
- /courses
  - /assigned
  - /:courseId
    - /materials
    - /students
- /forum
  - /questions
  - /:questionsId
- /consultations
  - /list
  - /:consultationId
