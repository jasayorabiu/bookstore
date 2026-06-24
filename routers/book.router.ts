import {prisma} from "../lib/prisma";
import {Router} from "express";
import {getBook, getBooksById, createBooks, updateBooks, deleteBooks} from "../controllers/book.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Books
 *     description: Book management
 */

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all books
 *     description: Retrieve a list of all books in the store with optional pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *             examples:
 *               sample:
 *                 summary: Sample paginated response
 *                 value:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   items:
 *                     - id: 1
 *                       title: 'The Great Gatsby'
 *                       author: 'F. Scott Fitzgerald'
 *                       description: 'A novel of the Jazz Age'
 *                       price: 12.99
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/", getBook);

/**
 * @openapi
 * /books/create:
 *   post:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new book
 *     description: Add a new book to the store inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'The Great Gatsby'
 *                 description: 'Book title (required)'
 *               author:
 *                 type: string
 *                 example: 'F. Scott Fitzgerald'
 *                 description: 'Author name (required)'
 *               description:
 *                 type: string
 *                 example: 'A novel of the Jazz Age'
 *                 description: 'Book description (optional)'
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 12.99
 *                 description: 'Price in USD (required)'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input - Missing required fields or invalid data type
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post("/create", createBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Get a book by ID
 *     description: Retrieve detailed information about a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getBooksById );

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a book
 *     description: Modify details of an existing book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'The Great Gatsby'
 *               author:
 *                 type: string
 *                 example: 'F. Scott Fitzgerald'
 *               description:
 *                 type: string
 *                 example: 'A novel of the Jazz Age'
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 12.99
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateBooks);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a book
 *     description: Remove a book from the store inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the book to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       400:
 *         description: Invalid book ID format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteBooks);


export default router;