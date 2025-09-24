'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInteface';
import styles from './Groups.module.scss';

const Students = (): React.ReactElement => {
  const { students, isLoading, error } = useStudents();

  if (isLoading) return <div>Загрузка студентов...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!students || students.length === 0) return <div>Студенты не найдены</div>;

  return (
    <div className={styles.Students}>
      <h1>Список студентов</h1>
      {students.map((student: StudentInterface) => (
        <div key={student.id} className={styles.student}>
          <h3>{student.first_name} {student.last_name}</h3>
          <p>Группа: {student.groupId}</p>
        </div>
      ))}
    </div>
  );
};

export default Students;