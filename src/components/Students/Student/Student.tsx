import React from 'react';
import styles from './Student.module.css';
import type StudentInterface from '@/types/StudentInterface';

interface StudentProps {
  student: StudentInterface;
  onDelete: (id: number) => void;
}

const Student: React.FC<StudentProps> = ({ student, onDelete }) => {
  return (
    <div className={styles.student}>
      <h3>
        {student.first_name} {student.last_name} {student.middle_name || ''}
      </h3>
      <p>Группа: {student.groupId}</p>
      <button onClick={() => onDelete(student.id)}>Удалить</button>
    </div>
  );
};

export default Student;