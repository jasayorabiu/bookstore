import {prisma} from "../lib/prisma";
import express from "express";
import {Router} from "express";
import {getUsers, getUserById, updateUsers, deleteUsers, logInUsers, logOutUsers, addUser} from "../controllers/user.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getUsers);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/", addUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User object
 */
router.get("/:id", getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
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
 *         description: Updated user
 */
router.put("/:id", updateUsers);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete("/:id", deleteUsers);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Logged in
 */
router.post("/login", logInUsers);

/**
 * @openapi
 * /users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", logOutUsers);

export default router;
   
