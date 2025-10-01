import React from 'react';
import styles from './Student.module.scss';
import type StudentInterface from '@/types/StudentInterface';

interface StudentProps {
  student: StudentInterface;
  onDelete: (id: number) => void;
}

const Student: React.FC<StudentProps> = ({ student, onDelete }) => {
  return (
    <div className={styles.student}>
      <h3>
        {student.firstName} {student.lastName} {student.middleName || ''}
      </h3>
      <p>Группа: {student.groupId}</p>
      <button onClick={() => onDelete(student.id)}>Удалить</button>
    </div>
  );
};

export default Student;