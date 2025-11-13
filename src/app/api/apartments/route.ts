import { Apartment, Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApartmentSchema } from "@/lib/validations/Apartment";
import z from "zod";

const prisma = new PrismaClient();

type ApartmentInput = z.infer<typeof ApartmentSchema>;

/**
 * @swagger
 * tags:
 *   - name: Apartments
 *     description: Endpoints for apartment management
 *
 * /api/apartments:
 *   get:
 *     summary: Get all apartments
 *     description: Fetch a paginated list of apartments with optional search query.
 *     tags: [Apartments]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "Luxury"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of apartments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a new apartment
 *     description: Add a new apartment listing to the database.
 *     tags: [Apartments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApartment'
 *           example:
 *             name: "Downtown Apartment"
 *             unitNumber: "A203"
 *             project: "Skyline Towers"
 *             price: 250000
 *             description: "Spacious apartment with a view."
 *             contactNumber: "+201101029668"
 *             imageUrls: ["/api/files/image1.jpg"]
 *     responses:
 *       201:
 *         description: Apartment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentBadRequestResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddApartmentFailedResponse'
 */

/**
 * Gets a paginated list of apartments.
 *
 * @param request The request object containing the search, page, and limit query parameters.
 * @returns 200 OK if the apartments are found.
 * @throws 500 Internal Server Error if an error occurs during apartment retrieval.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    // Calculate offset for pagination
    const skip: number = (page - 1) * limit;

    // Build where clause for search
    const whereClause: Prisma.ApartmentWhereInput | undefined = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              unitNumber: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              project: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    // Get total count for pagination info
    const totalCount: number = await prisma.apartment.count({
      where: whereClause,
    });

    // Get paginated apartments
    const apartments: Apartment[] = await prisma.apartment.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate pagination metadata
    const totalPages: number = Math.ceil(totalCount / limit);
    const hasNextPage: boolean = page < totalPages;
    const hasPrevPage: boolean = page > 1;

    return NextResponse.json({
      apartments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch Apartments" },
      { status: 500 }
    );
  }
}

/**
 * Creates a new apartment.
 *
 * @param request The request object containing the apartment data in the request body.
 * @returns 201 Created if the apartment is created successfully.
 * @throws 400 Bad Request if the request body is invalid.
 * @throws 500 Internal Server Error if an error occurs during apartment creation.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate request body using Zod
    const parsed = ApartmentSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    const data: ApartmentInput = parsed.data;

    // Insert into database
    const newApartment: Apartment = await prisma.apartment.create({ data });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error) {
    console.error("Failed to create apartment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
