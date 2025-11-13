import { Apartment, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/apartments/{id}:
 *   get:
 *     summary: Get an apartment by ID
 *     description: Returns a single apartment listing based on the provided ID.
 *     tags: [Apartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: c2a1f6c1-d5e8-4f7c-b0a9-e9a8d8c3b4a5
 *         description: The ID of the apartment to retrieve
 *     responses:
 *       200:
 *         description: A list of apartments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apartment'
 *       404:
 *         description: Apartment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentNotFoundResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddApartmentFailedResponse'
 */

/**
 * Gets an apartment by ID.
 *
 * @param request The request object.
 * @param context The context object containing the apartment ID parameter.
 * @returns 200 OK if the apartment is found.
 * @throws 404 Not Found if the apartment is not found.
 * @throws 500 Internal Server Error if an error occurs during apartment retrieval.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const apartment: Apartment | null = await prisma.apartment.findUnique({
      where: { id },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch Apartment" },
      { status: 500 }
    );
  }
}
