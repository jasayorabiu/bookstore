import {prisma} from "../lib/prisma";
import express from "express";
import {Router} from "express";
import {getUsers, getUserById, updateUsers, deleteUsers, logInUsers, logOutUsers, addUser, enableTwoFactorAuth,verifyTwoFactorAuth, forgottenPassword, resetPassword} from "../controllers/user.controller";

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
 *     description: Retrieve a list of all registered users in the system
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
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Users retrieved successfully'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             examples:
 *               sample:
 *                 summary: Sample users list
 *                 value:
 *                   message: 'Users retrieved successfully'
 *                   data:
 *                     - id: 1
 *                       name: 'John Doe'
 *                       email: 'john@example.com'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get("/", getUsers);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Register a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *                 description: 'Full name of the user (required)'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john@example.com'
 *                 description: 'Valid email address (required, must be unique)'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'securePassword123'
 *                 description: 'Password for account (required, minimum 6 characters)'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input - Missing required fields, invalid email, or email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", addUser);



/**
 * @openapi
 * /users/enableTwoFactor:
 *   get:
 *     tags: [Users]
 *     summary: Enable two-factor authentication
 *     description: Generate a two-factor authentication setup QR code and secret recovery code for the user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Identifier of the user enabling two-factor authentication
 *     responses:
 *       200:
 *         description: Two-factor authentication setup returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 qrCodeDataUrl:
 *                   type: string
 *                   example: 'data:image/png;base64,iVBORw0KGgo...'
 *       400:
 *         description: Missing or invalid userId
 *       500:
 *         description: Internal server error
 */
router.get("/enableTwoFactor", enableTwoFactorAuth );

/**
 * @openapi
 * /users/verify:
 *   get:
 *     tags: [Users]
 *     summary: Verify two-factor authentication code
 *     description: Validate a two-factor authentication token for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Identifier of the user
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: '123456'
 *         description: Two-factor authentication code
 *     responses:
 *       200:
 *         description: Two-factor authentication verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Two-factor authentication verified successfully'
 *       400:
 *         description: Invalid code or missing parameters
 *       401:
 *         description: Unauthorized - invalid code
 *       500:
 *         description: Internal server error
 */
router.get("/verify", verifyTwoFactorAuth);



/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Remove a user account from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User deleted successfully'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteUsers);

/**
 * @openapi
 * /users/forgottenPassword:
 *   put:
 *     tags: [Users]
 *     summary: Send forgotten password reset token
 *     description: Generate a password reset token for the given email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john@example.com'
 *                 description: 'Registered user email address'
 *     responses:
 *       200:
 *         description: Password reset token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resetToken:
 *                   type: string
 *                   example: 'abcdef123456'
 *       400:
 *         description: Invalid email or request body
 *       500:
 *         description: Internal server error
 */
router.put("/forgottenPassword", forgottenPassword);

/**
 * @openapi
 * /users/reset:
 *   put:
 *     tags: [Users]
 *     summary: Reset password
 *     description: Reset a user's password using a reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: 'abcdef123456'
 *                 description: 'Password reset token'
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: 'newSecurePassword123'
 *                 description: 'New password value'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid token or password
 *       500:
 *         description: Internal server error
 */
router.put("/reset", resetPassword);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     description: Authenticate user with email and password, receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john@example.com'
 *                 description: 'Registered email address'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'securePassword123'
 *                 description: 'Account password'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'User signed in successfully'
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         token:
 *                           type: string
 *                           example: 'eyJhbGci...'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 'Two-factor authentication required'
 *                     twoFactorRequired:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials - email or password incorrect
 *       500:
 *         description: Internal server error
 */

router.post("/login", logInUsers);

/**
 * @openapi
 * /users/logout:
 *   post:
 *     tags: [Users]
 *     summary: Logout user
 *     description: Invalidate user session and logout
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully logged out'
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logOutUsers);


/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve detailed information about a specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User retrieved successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUserById);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     description: Modify user profile details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user to update
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
 *               name:
 *                 type: string
 *                 example: 'Jane Doe'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'jane@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'newPassword123'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User updated successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateUsers);

export default router;
   
