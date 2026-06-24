import {prisma} from "../lib/prisma";
import express from "express";
import {Router} from "express";
 const router = Router();
import {Request, Response} from "express";
import {getOrder, getOrdersById, createOrders, updateOrders, deleteOrders } from "../controllers/order.controller";

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Order management
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all orders
 *     description: Retrieve a list of all orders in the system with optional pagination
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
 *         description: List of orders retrieved successfully
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
 *                   example: 1
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *             examples:
 *               sample:
 *                 summary: Sample orders list
 *                 value:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   items:
 *                     - id: 1
 *                       userId: 1
 *                       total: 49.99
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/", getOrder);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new order
 *     description: Create a new order for a user with order details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - total
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: 'ID of the user placing the order (required)'
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *                 description: 'Total order amount in USD (required)'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input - Missing required fields or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post("/", createOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Get order by ID
 *     description: Retrieve detailed information about a specific order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the order
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order ID format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getOrdersById)

/**
 * @openapi
 * /orders/update/{id}:
 *   put:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Update an order
 *     description: Modify order details such as total amount
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the order to update
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
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 59.99
 *                 description: 'Updated order total in USD'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", updateOrders)

/**
 * @openapi
 * /orders/delete/{id}:
 *   delete:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an order
 *     description: Remove an order from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the order to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       400:
 *         description: Invalid order ID format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", deleteOrders)

 export default router