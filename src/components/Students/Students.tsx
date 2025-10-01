'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import Student from './Student/Student';


const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate } = useStudents();
  const onDeleteHandler = (studentId: number) => {
    console.log(studentId)
    deleteStudentMutate(studentId)
  }
  if (!students || students.length === 0) return <div>Студенты не найдены</div>;

  return (
    <div>
      <h1>Список студентов</h1>
      {students.map((student: StudentInterface) => (
        <Student student={student}
      onDelete={onDeleteHandler}
/>
      ))}
    </div>
  );
};

export default Students;