import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve(process.cwd(), "files", "uploads");
const PUBLIC_URL_PATH = "/api/files";
console.log("UPLOAD_DIR", UPLOAD_DIR);

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ✅ helper function to sanitize filenames safely
function sanitizeFileName(name: string): string {
  return name
    .normalize("NFKD") // normalize unicode
    .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII
    .replace(/\s+/g, "-") // replace spaces
    .replace(/[^a-zA-Z0-9._-]/g, "") // keep only safe chars
    .toLowerCase();
}

/**
 * @swagger
 * tags:
 *   - name: Uploads
 *     description: APIs related to image uploads for apartments.
 *
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file to the server.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: /api/files/image.jpg
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadFileBadRequestResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadFileFailedResponse'
 */

/**
 * Uploads a file to the server.
 * 
 * @param request The request object containing the form data.
 * @returns 201 Created if the file is uploaded successfully.
 * @throws 400 Bad Request if no file is uploaded.
 * @throws 500 Internal Server Error if an error occurs during file upload.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file: Blob | null = formData.get("image") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = (file as File).name;
    const safeName = sanitizeFileName(originalName);
    const fileName = `${uuidv4()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `${PUBLIC_URL_PATH}/${fileName}`;

    return NextResponse.json({ imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
