import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthenticatedUser } from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';
import type {
  ItineraryEvaluationResult,
  ItineraryImportSourceType,
  UserItineraryWaypoint
} from '@/lib/types';

export async function GET() {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ itineraries: [] }, { status: 401 });
  }

  const itineraries = await atlasDbRepository.listUserItineraries(user.id);
  return NextResponse.json({ itineraries });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      title?: string;
      notes?: string;
      isPublic?: boolean;
      sourceType?: ItineraryImportSourceType;
      startDate?: string | null;
      endDate?: string | null;
      waypoints?: UserItineraryWaypoint[];
      advisory?: ItineraryEvaluationResult | null;
    };

    const title = (body.title || '').trim().slice(0, 160);
    const waypoints = Array.isArray(body.waypoints) ? body.waypoints.slice(0, 28) : [];
    if (!title || waypoints.length === 0) {
      return NextResponse.json({ error: 'MISSING_TITLE_OR_WAYPOINTS' }, { status: 400 });
    }

    const saved = await atlasDbRepository.saveItinerary({
      id: body.id,
      userId: user.id,
      title,
      notes: (body.notes || '').slice(0, 2000),
      isPublic: Boolean(body.isPublic),
      sourceType: body.sourceType || 'manual',
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      waypoints,
      advisory: body.advisory ?? null
    });

    return NextResponse.json({ itinerary: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'SAVE_FAILED' }, { status: 500 });
  }
}
