import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { addWishlistSchema } from "./wishlist.schema.js";
import { fetchAll, toggleWishlist } from "./wishlist.controller.js";

const router = Router();

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add or remove a property from the user's wishlist (toggle)
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId]
 *             properties:
 *               propertyId:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Wishlist toggled successfully (added or removed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Added to wishlist" }
 *                 wishlisted: { type: boolean, example: true }
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Property not found
 */
router.post("/", authenticate, validate(addWishlistSchema), toggleWishlist)

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get the logged-in user's wishlisted properties
 *     tags: [Wishlist]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of wishlisted properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *       401:
 *         description: Not authenticated
 */
router.get("/", authenticate, fetchAll)

export default router;