-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'mentor', 'student');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(60) NOT NULL,
    "role" "public"."Role" NOT NULL,
    "bio" VARCHAR(500),
    "experience" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_mentors" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "course_mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_materials" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "course_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_progress" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_material_id" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."certificates" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "certificate_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "company" VARCHAR(150) NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forum_questions" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "forum_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forum_answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "forum_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultations_questions" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "consultations_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultations_answers" (
    "id" SERIAL NOT NULL,
    "consultations_question_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "consultations_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_role_created_at_idx" ON "public"."users"("role", "created_at");

-- CreateIndex
CREATE INDEX "users_email_verified_idx" ON "public"."users"("email_verified");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "courses_title_idx" ON "public"."courses"("title");

-- CreateIndex
CREATE INDEX "course_mentors_course_id_idx" ON "public"."course_mentors"("course_id");

-- CreateIndex
CREATE INDEX "course_mentors_mentor_id_idx" ON "public"."course_mentors"("mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_mentors_course_id_mentor_id_key" ON "public"."course_mentors"("course_id", "mentor_id");

-- CreateIndex
CREATE INDEX "course_materials_course_id_idx" ON "public"."course_materials"("course_id");

-- CreateIndex
CREATE INDEX "course_progress_student_id_idx" ON "public"."course_progress"("student_id");

-- CreateIndex
CREATE INDEX "course_progress_course_material_id_idx" ON "public"."course_progress"("course_material_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_student_id_course_material_id_key" ON "public"."course_progress"("student_id", "course_material_id");

-- CreateIndex
CREATE INDEX "certificates_student_id_idx" ON "public"."certificates"("student_id");

-- CreateIndex
CREATE INDEX "certificates_course_id_idx" ON "public"."certificates"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_student_id_course_id_key" ON "public"."certificates"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "jobs_admin_id_idx" ON "public"."jobs"("admin_id");

-- CreateIndex
CREATE INDEX "jobs_title_idx" ON "public"."jobs"("title");

-- CreateIndex
CREATE INDEX "jobs_company_idx" ON "public"."jobs"("company");

-- CreateIndex
CREATE INDEX "jobs_location_idx" ON "public"."jobs"("location");

-- CreateIndex
CREATE INDEX "forum_questions_student_id_idx" ON "public"."forum_questions"("student_id");

-- CreateIndex
CREATE INDEX "forum_answers_question_id_idx" ON "public"."forum_answers"("question_id");

-- CreateIndex
CREATE INDEX "forum_answers_user_id_idx" ON "public"."forum_answers"("user_id");

-- CreateIndex
CREATE INDEX "consultations_questions_student_id_idx" ON "public"."consultations_questions"("student_id");

-- CreateIndex
CREATE INDEX "consultations_answers_consultations_question_id_idx" ON "public"."consultations_answers"("consultations_question_id");

-- CreateIndex
CREATE INDEX "consultations_answers_mentor_id_idx" ON "public"."consultations_answers"("mentor_id");

-- AddForeignKey
ALTER TABLE "public"."course_mentors" ADD CONSTRAINT "course_mentors_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_mentors" ADD CONSTRAINT "course_mentors_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_materials" ADD CONSTRAINT "course_materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_progress" ADD CONSTRAINT "course_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_progress" ADD CONSTRAINT "course_progress_course_material_id_fkey" FOREIGN KEY ("course_material_id") REFERENCES "public"."course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_questions" ADD CONSTRAINT "forum_questions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_answers" ADD CONSTRAINT "forum_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."forum_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_answers" ADD CONSTRAINT "forum_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations_questions" ADD CONSTRAINT "consultations_questions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations_answers" ADD CONSTRAINT "consultations_answers_consultations_question_id_fkey" FOREIGN KEY ("consultations_question_id") REFERENCES "public"."consultations_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations_answers" ADD CONSTRAINT "consultations_answers_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
