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
 *     responses:
 *       200:
 *         description: List of books
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created
 */
router.post("/create", createBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Get a book by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book object
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Updated book
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Book deleted
 */
router.delete("/:id", deleteBooks);


export default router;