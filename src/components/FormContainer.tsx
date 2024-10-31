import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { classTeachers, classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { teacherSubjects };
        break;

      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { studentClasses, studentGrades };
        break;

      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { examLessons };
        break;

      case "lesson":
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          lessonSubjects,
          lessonClasses,
          lessonTeachers,
        };
        break;

      case "parent":
        const allStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        const selectedStudentIds =
          type === "update" && id
            ? (
                await prisma.parent.findUnique({
                  where: { id: id as string },
                  select: {
                    students: {
                      select: { id: true },
                    },
                  },
                })
              )?.students.map((student) => student.id) || []
            : [];

        relatedData = {
          allStudents: allStudents.map((student) => ({
            id: student.id,
            name: `${student.name} ${student.surname}`,
          })),
          selectedStudentIds, // To pre-select in ParentForm
        };
        break;

      case "result":
        const resultStudents = await prisma.student.findMany({
          select: { id: true, name: true },
        });
        const resultExams = await prisma.exam.findMany({
          select: { id: true, title: true },
        });
        const resultAssignments = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });
        relatedData = { resultStudents, resultExams, resultAssignments };
        break;

      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          select: { id: true, name: true },
        });
        relatedData = { assignmentLessons };
        break;

      case "attendance":
        const attendanceStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        const attendanceLessons = await prisma.lesson.findMany({
          select: { id: true, name: true },
        });

        relatedData = { attendanceStudents, attendanceLessons };
        break;

      case "event":
        const classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes };
        break;
      case "announcement":
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
