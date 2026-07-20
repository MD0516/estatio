import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { addReviewSchema } from "./review.schema.js";
import { create, fetch, helpful } from "./review.controller.js";

const router = Router();

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Add a review for a property
 *     tags: [Review]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, stars]
 *             properties:
 *               propertyId:
 *                 type: integer
 *                 example: 12
 *               stars:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               note:
 *                 type: string
 *                 example: "Great location, spacious rooms."
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Property not found
 */
router.post("/", authenticate, validate(addReviewSchema), create)

/**
 * @swagger
 * /api/review/{id}/helpful:
 *   post:
 *     summary: Mark a review as helpful
 *     tags: [Review]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Review id
 *     responses:
 *       200:
 *         description: Review marked as helpful
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Review not found
 */
router.post("/:id/helpful", authenticate, helpful)

/**
 * @swagger
 * /api/review/property/{id}:
 *   get:
 *     summary: Get all reviews for a property
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Property id
 *     responses:
 *       200:
 *         description: List of reviews for the property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       stars: { type: integer }
 *                       note: { type: string }
 *                       helpfulCount: { type: integer }
 *                       user:
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *       404:
 *         description: Property not found
 */
router.get("/property/:id", fetch)

export default router;