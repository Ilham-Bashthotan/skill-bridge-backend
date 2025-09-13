```
// ==========================
// Users & Roles
// ==========================
Table users {
  id int [pk, increment]
  name varchar
  email varchar [unique]
  phone varchar
  password varchar
  created_at timestamp
  updated_at timestamp
}

Table admins {
  id int [pk, increment]
  user_id int [ref: > users.id]
  position varchar // e.g., super admin, content manager
}

Table students {
  id int [pk, increment]
  user_id int [ref: > users.id]
  education_level varchar // SMP, SMA, Vokasi
}

Table mentors {
  id int [pk, increment]
  user_id int [ref: > users.id]
  expertise varchar
  bio text
  is_active bool
}

// ==========================
// Courses & Learning
// ==========================
Table courses {
  id int [pk, increment]
  title varchar
  description text
  duration varchar
  created_at timestamp
  updated_at timestamp
}

Table course_mentors {
  id int [pk, increment]
  course_id int [ref: > courses.id]
  mentor_id int [ref: > mentors.id]
  assigned_at timestamp
}

Table course_materials {
  id int [pk, increment]
  course_id int [ref: > courses.id]
  title varchar
  content text
  material_type varchar // text, video, quiz
  created_at timestamp
}

Table course_progress {
  id int [pk, increment]
  student_id int [ref: > students.id]
  course_material_id int [ref: > course_materials.id]
  progress int // 0-100%
  completed boolean
  updated_at timestamp
}

Table certificates {
  id int [pk, increment]
  student_id int [ref: > students.id]
  course_id int [ref: > courses.id]
  certificate_url varchar
  issued_at timestamp
}

// ==========================
// Job Board
// ==========================


Table jobs {
  id int [pk, increment]
  admin_id int [ref: > admins.id]
  title varchar
  description text
  company text
  requirements text
  location varchar
  created_at timestamp
}

// ==========================
// Forum / Komunitas
// ==========================
Table forum_questions {
  id int [pk, increment]
  student_id int [ref: > students.id]
  title varchar
  content text
  created_at timestamp
}

Table forum_answers {
  id int [pk, increment]
  question_id int [ref: > forum_questions.id]
  user_id int [ref: > users.id] // bisa student/mentor jawab
  content text
  created_at timestamp
}

// ==========================
// Mentor Consultation
// ==========================
Table consultations_questions {
  id int [pk, increment]
  student_id int [ref: > students.id]
  job_topic int [ref: > jobs.id]
  message text
  created_at timestamp
}

Table consultations_answers {
  id int [pk, increment]
  consultations_question_id int [ref: > consultations_questions.id]
  user_id int [ref: > users.id]
  message text
  created_at timestamp
}
```