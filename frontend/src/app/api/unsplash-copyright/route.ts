import { NextRequest, NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';
import { env } from 'process';
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { message: 'Invalid data' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/${id}?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`,
    ).then((res) => res.json());
    const copyright = {
      photographer: response.user?.first_name + ' ' + response.user?.last_name,
      photographer_url: response.links.html,
      src: response.urls.full,
    };

    return NextResponse.json(copyright);
  } catch {
    return NextResponse.json(
      {
        message:
          'Failed to send get Unsplash photo copyright, Please try again later.',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}
