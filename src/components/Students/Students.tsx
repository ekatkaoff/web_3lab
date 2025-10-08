'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import Student from './Student/Student';
import AddStudent from './AddStudent';

const Students = (): React.ReactElement => {
  const { 
    students, 
    deleteStudentMutate, 
    addStudentMutate, 
    isLoading, 
    error 
  } = useStudents();

  const onDeleteHandler = (studentId: number) => {
    deleteStudentMutate(studentId);
  };

  const onAddStudent = (data: Omit<StudentInterface, 'id' | 'isDeleted'>) => {
    addStudentMutate(data);
  };

  if (isLoading) {
    return <div>Загрузка студентов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки студентов: {error.message}</div>;
  }

  if (!students || students.length === 0) {
    return (
      <div>
        <h1>Список студентов</h1>
        <AddStudent onSubmit={onAddStudent} />
        <div>Студенты не найдены</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Список студентов</h1>
      <AddStudent onSubmit={onAddStudent} />
      {students.map((student: StudentInterface) => (
        <Student
          key={student.id}
          student={student}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Students;