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
    const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY as string,
      },
    })
      .then((res) => res.json())
      .then((res) => res);
    const copyright = {
      photographer: response.photographer,
      photographer_url: response.photographer_url,
      src: response.src.large,
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
