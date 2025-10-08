import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function getStudentsDb() {
  let db;
  try {
    const dbPath = path.join(process.cwd(), 'db/vki-web.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const students = await db.all('SELECT * FROM student');

    return students;
  } catch (error) {
    console.error('Ошибка в getStudentsDb:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

export async function addStudentDb(studentData: {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
}) {
  let db;
  try {
    const dbPath = path.join(process.cwd(), 'db/vki-web.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const { firstName, lastName, middleName, groupId } = studentData;

    const result = await db.run(
      'INSERT INTO student (firstName, lastName, middleName, groupId) VALUES (?, ?, ?, ?)',
      [firstName, lastName, middleName, groupId]
    );

    const newStudent = await db.get('SELECT * FROM student WHERE id = ?', result.lastID);
    console.log('Новый студент:', newStudent);

    if (!newStudent) {
      throw new Error('Ошибка создания студента');
    }

    return newStudent;
  } catch (error) {
    console.error('Ошибка в addStudentDb:', error);
    throw error;
  } finally {
    if (db) await db.close();
  }
}