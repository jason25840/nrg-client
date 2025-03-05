import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock articles data
    const articles = [
      {
        id: 1,
        title: 'Exploring the Gorge',
        content: 'A deep dive into the adventure sports at NRG.',
      },
      {
        id: 2,
        title: 'Best Trails for Hiking',
        content: 'Discover the top trails for a perfect hiking experience.',
      },
      {
        id: 3,
        title: 'Kayaking in the NRG',
        content:
          'Everything you need to know about paddling the New River Gorge.',
      },
    ];

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json(
      { message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
