import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthenticatedUser } from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await atlasDbRepository.deleteUserItinerary(user.id, id);
  return NextResponse.json({ deleted });
}
