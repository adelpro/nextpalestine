import { NextRequest, NextResponse } from 'next/server';
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
      `https://pixabay.com/api?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&id=${id}`,
    )
      .then((res) => res.json())
      .then((res) => res);
    const copyright = {
      photographer: response.hits[0]?.user,
      photographer_url: response.hits[0]?.userImageURL,
      src: response.hits[0]?.largeImageURL,
    };

    return NextResponse.json(copyright);
  } catch {
    return NextResponse.json(
      {
        message:
          'Failed to send get Pexels photo copyright, Please try again later.',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}
