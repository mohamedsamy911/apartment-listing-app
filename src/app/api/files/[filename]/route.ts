import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// This should match your upload directory
const UPLOAD_DIR = path.resolve(process.cwd(), "files", "uploads");

/**
 * 
 * @swagger
  * tags:
 *   - name: Files
 *     description: Endpoints for file management (retrieval, existence check).
 *
 * /api/files/{filename}:
 *   get:
 *     summary: Get a file by filename
 *     description: Returns a single file based on the provided filename.
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *           example: image.jpg
 *         description: The name of the file to retrieve.
 *     responses:
 *       200:
 *         description: A successful response with the file content.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid filename provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidFilenameResponse'
 *       404:
 *         description: File not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileNotFoundResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *   head:
 *     summary: Check if a file exists
 *     description: Returns status code 200 if the file exists, otherwise 404.
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *           example: image.jpg
 *         description: The name of the file to check.
 *     responses:
 *       200:
 *         description: A successful response indicating whether the file exists.
 *       404:
 *         description: Invalid filename provided.
 */

/**
 * Gets a file by filename.
 * 
 * @param request The request object.
 * @param context The context object containing the filename parameter.
 * @returns 200 OK if the file is found.
 * @throws 400 Bad Request if the filename is invalid.
 * @throws 404 Not Found if the file is not found.
 * @throws 500 Internal Server Error if an error occurs during file retrieval.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    // Security checks
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filename).toLowerCase();

    // Common MIME types
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };

    const contentType = mimeTypes[fileExt] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("File serving failed:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}

/**
 * Checks if a file exists by filename.
 * 
 * @param request The request object.
 * @param context The context object containing the filename parameter.
 * @returns 200 OK if the file exists
 * @throws 404 Not Found if the file is not found.
 */
export async function HEAD(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const filePath = path.join(UPLOAD_DIR, filename);

  if (fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 404 });
}
