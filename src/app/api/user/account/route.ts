import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  getCurrentAuthenticatedUser,
  SESSION_COOKIE_NAME
} from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';

export async function DELETE() {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  await atlasDbRepository.deleteUserAccountCompletely(user.id);
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ deleted: true });
}
