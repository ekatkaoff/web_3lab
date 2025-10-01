'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';

const Students = (): React.ReactElement => {
  const { students } = useStudents();

  if (!students || students.length === 0) return <div>Студенты не найдены</div>;

  return (
    <div>
      <h1>Список студентов</h1>
      {students.map((student: StudentInterface) => (
        <div key={student.id}>
          <h3>{student.first_name} {student.last_name}</h3>
          <p>Группа: {student.groupId}</p>
        </div>
      ))}
    </div>
  );
};

export default Students;