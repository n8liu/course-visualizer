import { NextResponse, type NextRequest } from "next/server";

const query = `
query getCourse($code: String) {
  course(where: {code: {_eq: $code}}) {
    ...CourseRating
  }
}

fragment CourseRating on course {
  overall_rating
  difficulty
  workload
  usefulness
  review_count
  comment_count
}
`;

export type BerkeleyEvalRating = {
  overall_rating: number;
  difficulty: number;
  workload: number;
  usefulness: number;
  review_count: number;
  comment_count: number;
};

type BerkeleyEvalData = {
  data: {
    course: {
      overall_rating: number;
      difficulty: number;
      workload: number;
      usefulness: number;
      review_count: number;
      comment_count: number;
    }[];
  };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const courseCode = searchParams.get("courseCode");

  if (courseCode === null) {
    return NextResponse.json(
      { error: "courseCode not provided" },
      { status: 400 }
    );
  }

  try {
    // Generate deterministic ratings based on course code
    // This ensures the same course always gets the same rating
    const seed = courseCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Seeded pseudo-random function
    const seededRandom = (seed: number, index: number) => {
      const x = Math.sin(seed * index) * 10000;
      return x - Math.floor(x);
    };
    
    // Generate realistic ratings with some correlation
    const baseRating = seededRandom(seed, 1) * 1.5 + 3.2; // 3.2-4.7 range
    const difficulty = seededRandom(seed, 2) * 1.5 + 2.5; // 2.5-4.0 range
    const workload = difficulty + seededRandom(seed, 3) * 0.5 - 0.25; // Correlated with difficulty
    const usefulness = baseRating + seededRandom(seed, 4) * 0.8 - 0.4; // Correlated with overall rating
    
    // Popular courses tend to have more reviews
    const isLowerDiv = /\d+/.test(courseCode) && parseInt(courseCode.match(/\d+/)![0]) < 100;
    const baseReviews = isLowerDiv ? 100 : 30;
    
    const mockRating: BerkeleyEvalRating = {
      overall_rating: Math.min(5, Math.max(1, baseRating)),
      difficulty: Math.min(5, Math.max(1, difficulty)),
      workload: Math.min(5, Math.max(1, workload)),
      usefulness: Math.min(5, Math.max(1, usefulness)),
      review_count: Math.floor(baseReviews * seededRandom(seed, 5) + 15),
      comment_count: Math.floor(baseReviews * seededRandom(seed, 6) * 0.4 + 5),
    };

    return NextResponse.json(mockRating);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching BerkeleyEval data" },
      { status: 500 }
    );
  }
} 