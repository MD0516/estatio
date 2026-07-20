import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createInquirySchema, updateInquiryStatusSchema } from "./inquiry.schema.js";
import { create, fetchInquiries, update } from "./inquiry.controller.js";
import { inquiryRateLimit } from "../../middleware/rateLimit.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/inquiry:
 *   post:
 *     summary: Send an inquiry about a property
 *     tags: [Inquiry]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, message]
 *             properties:
 *               propertyId:
 *                 type: integer
 *                 example: 12
 *               message:
 *                 type: string
 *                 example: "Is this property still available for viewing this weekend?"
 *     responses:
 *       201:
 *         description: Inquiry sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Property not found
 *       429:
 *         description: Too many inquiries sent, rate limit exceeded
 */
router.post("/", authenticate, inquiryRateLimit, validate(createInquirySchema), create);

/**
 * @swagger
 * /api/inquiry/{id}:
 *   patch:
 *     summary: Update the status of an inquiry
 *     tags: [Inquiry]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Inquiry id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, responded, closed]
 *                 example: "responded"
 *     responses:
 *       200:
 *         description: Inquiry status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to update this inquiry
 *       404:
 *         description: Inquiry not found
 */
router.patch("/:id", authenticate, validate(updateInquiryStatusSchema), update);

/**
 * @swagger
 * /api/inquiry:
 *   get:
 *     summary: Get inquiries for the logged-in user (sent or received)
 *     tags: [Inquiry]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of inquiries
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
 *                       propertyId: { type: integer }
 *                       message: { type: string }
 *                       status: { type: string, enum: [pending, responded, closed] }
 *       401:
 *         description: Not authenticated
 */
router.get("/", authenticate, fetchInquiries)

export default router;