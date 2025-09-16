```
// ==========================
// Users & Roles
// ==========================
Table users {
  id int [pk, increment]
  name varchar(100)
  email varchar(254) [unique]
  phone varchar(20)
  password varchar(60)
  role enum(admin,mentor,student)
  bio varchar(500)
  experience varchar(255)
  email_verified boolean [default: false]
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (role)
    (created_at)
    (role, created_at)
    (email_verified)
    (phone)
  }
}

// ==========================
// Courses & Learning
// ==========================
Table courses {
  id int [pk, increment]
  title varchar(150)
  description text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (title)
  }
}

Table course_mentors {
  id int [pk, increment]
  course_id int [ref: > courses.id]
  mentor_id int [ref: > users.id]
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (course_id)
    (mentor_id)
    (course_id, mentor_id) [unique]
  }
}

Table course_materials {
  id int [pk, increment]
  course_id int [ref: > courses.id]
  title varchar(150)
  content text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (course_id)
  }
}

Table course_progress {
  id int [pk, increment]
  student_id int [ref: > users.id]
  course_material_id int [ref: > course_materials.id]
  completed boolean [default: false]
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (student_id)
    (course_material_id)
    (student_id, course_material_id) [unique]
  }
}

Table certificates {
  id int [pk, increment]
  student_id int [ref: > users.id]
  course_id int [ref: > courses.id]
  certificate_url text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (student_id)
    (course_id)
    (student_id, course_id) [unique]
  }
}

// ==========================
// Job Board
// ==========================

Table jobs {
  id int [pk, increment]
  admin_id int [ref: > users.id]
  title varchar(150)
  description text
  company varchar(150)
  requirements text
  location varchar(100)
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (admin_id)
    (title)
    (company)
    (location)
  }
}

// ==========================
// Forum / Komunitas
// ==========================
Table forum_questions {
  id int [pk, increment]
  student_id int [ref: > users.id]
  title varchar(150)
  message text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (student_id)
  }
}

Table forum_answers {
  id int [pk, increment]
  question_id int [ref: > forum_questions.id]
  user_id int [ref: > users.id] // bisa student/mentor jawab
  message text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (question_id)
    (user_id)
  }
}

// ==========================
// Mentor Consultation
// ==========================
Table consultations_questions {
  id int [pk, increment]
  student_id int [ref: > users.id]
  title varchar(150)
  message text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (student_id)
  }
}

Table consultations_answers {
  id int [pk, increment]
  consultations_question_id int [ref: > consultations_questions.id]
  mentor_id int [ref: > users.id]
  message text
  created_at timestamptz [default: now()]
  updated_at timestamptz [default: now()]

  Indexes {
    (consultations_question_id)
    (mentor_id)
  }
}
```