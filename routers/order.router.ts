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
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", getOrder);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Create an order
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
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", createOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Get order by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order object
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Updated order
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order deleted
 */
router.delete("/delete/:id", deleteOrders)

 export default router