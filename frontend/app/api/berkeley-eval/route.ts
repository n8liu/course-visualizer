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
    // For now, return mock data since BerkeleyEval API might not be publicly accessible
    // In a real implementation, you would fetch from Berkeley's course evaluation system
    const mockRating: BerkeleyEvalRating = {
      overall_rating: Math.random() * 2 + 3, // 3-5 range
      difficulty: Math.random() * 2 + 2, // 2-4 range
      workload: Math.random() * 2 + 2, // 2-4 range
      usefulness: Math.random() * 2 + 3, // 3-5 range
      review_count: Math.floor(Math.random() * 100) + 10,
      comment_count: Math.floor(Math.random() * 50) + 5,
    };

    return NextResponse.json(mockRating);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching BerkeleyEval data" },
      { status: 500 }
    );
  }
} 