import { NextRequest, NextResponse } from 'next/server';
import { getStudentsDb, addStudentDb } from '@/db/studentsDb';  

export async function GET(): Promise<Response> {
  try {
    const students = await getStudentsDb();
    return new Response(JSON.stringify(students), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Ошибка в GET /api/students:', error);
    return new Response(
      JSON.stringify({ error: 'Ошибка загрузки студентов', details: error instanceof Error ? error.message : 'Unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { firstName, lastName, middleName, groupId } = body;

    if (!firstName || !lastName || !middleName || typeof groupId !== 'number' || groupId < 1) {
      return NextResponse.json({ error: 'Неверные данные: все поля обязательны, groupId > 0' }, { status: 400 });
    }

    const newStudent = await addStudentDb({ firstName, lastName, middleName, groupId });

    return NextResponse.json(newStudent, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Ошибка в POST /api/students:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}