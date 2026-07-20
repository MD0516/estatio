import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { create, deleteProperty, deletePropertyImage, fetchAll, fetchOne, fetchSimilarProperties, search, update, updateImages, uploadImages } from "./property.controller.js";
import { createPropertySchema, filterSchema, updateImageSchema, updatePropertySchema } from "./property.schema.js";

const router = Router();

/**
 * @swagger
 * /api/property/upload-imgs:
 *   post:
 *     summary: Upload property images (returns URLs to use in create/update)
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded, returns array of URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items: { type: string }
 *       400:
 *         description: No images uploaded
 *       401:
 *         description: Not authenticated
 */
router.post("/upload-imgs", authenticate, upload.array("images", 10), uploadImages)

/**
 * @swagger
 * /api/property:
 *   post:
 *     summary: Create a new property listing
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, city, locality, state, address, gMapUrl, type, listingType, price, bedroom, areaSqft, bathroom, balcony, furnishingStatus, parking, facing, images]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               city: { type: string }
 *               locality: { type: string }
 *               state: { type: string }
 *               address: { type: string }
 *               gMapUrl: { type: string }
 *               type:
 *                 type: string
 *                 enum: [apartment, villa, house, plot, commercial]
 *               listingType:
 *                 type: string
 *                 enum: [rent, lease, sale]
 *               price: { type: number }
 *               bedroom: { type: integer }
 *               areaSqft: { type: number }
 *               floor: { type: integer, nullable: true }
 *               bathroom: { type: integer }
 *               balcony: { type: integer }
 *               furnishingStatus:
 *                 type: string
 *                 enum: [full, semi, none]
 *               parking:
 *                 type: string
 *                 enum: [car, bike, both, none]
 *               facing: { type: string }
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [url, order, isCover]
 *                   properties:
 *                     url: { type: string }
 *                     order: { type: integer }
 *                     isCover: { type: boolean }
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticate, validate(createPropertySchema), create)

/**
 * @swagger
 * /api/property/{id}:
 *   patch:
 *     summary: Update a property (owner only)
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of property fields to update
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               city: { type: string }
 *               locality: { type: string }
 *               state: { type: string }
 *               address: { type: string }
 *               gMapUrl: { type: string }
 *               type:
 *                 type: string
 *                 enum: [apartment, villa, house, plot, commercial]
 *               listingType:
 *                 type: string
 *                 enum: [rent, lease, sale]
 *               price: { type: number }
 *               bedroom: { type: integer }
 *               status:
 *                 type: string
 *                 enum: [active, sold, rented, inactive]
 *               areaSqft: { type: number }
 *               floor: { type: integer, nullable: true }
 *               bathroom: { type: integer }
 *               balcony: { type: integer }
 *               furnishingStatus:
 *                 type: string
 *                 enum: [full, semi, none]
 *               parking:
 *                 type: string
 *                 enum: [car, bike, both, none]
 *               facing: { type: string }
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to edit this property
 *       404:
 *         description: Property not found
 */
router.patch("/:id", authenticate, validate(updatePropertySchema), update)

/**
 * @swagger
 * /api/property/image/{id}:
 *   patch:
 *     summary: Update/reorder images for a property
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Property id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [url, order, isCover]
 *                   properties:
 *                     id: { type: integer }
 *                     url: { type: string }
 *                     order: { type: integer }
 *                     isCover: { type: boolean }
 *     responses:
 *       200:
 *         description: Images updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to edit this property
 *       404:
 *         description: Property not found
 */
router.patch("/image/:id", authenticate, validate(updateImageSchema), updateImages)

/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Soft-delete a property (owner only)
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to delete this property
 *       404:
 *         description: Property not found
 */
router.delete("/:id", authenticate, deleteProperty)

/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     summary: Get a single property by id
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Property fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get("/:id", fetchOne)

/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all active properties
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 */
router.get("/", fetchAll)

/**
 * @swagger
 * /api/property/search:
 *   post:
 *     summary: Search/filter properties
 *     tags: [Property]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: array
 *                 items: { type: string }
 *               type:
 *                 type: array
 *                 items: { type: string }
 *               listingType: { type: string }
 *               minPrice: { type: number }
 *               maxPrice: { type: number }
 *               bedroom: { type: integer }
 *               furnishingStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [full, semi, none]
 *               parking:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [car, bike, both, none]
 *               sortBy:
 *                 type: string
 *                 enum: [price, createdAt]
 *                 default: createdAt
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: desc
 *               page: { type: integer, default: 1 }
 *               limit: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Filtered list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 total: { type: integer }
 *                 page: { type: integer }
 *       400:
 *         description: Validation error
 */
router.post("/search", validate(filterSchema), search)

/**
 * @swagger
 * /api/property/image/{id}:
 *   delete:
 *     summary: Delete a single property image
 *     tags: [Property]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Image id
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to delete this image
 *       404:
 *         description: Image not found
 */
router.delete("/image/:id", authenticate, deletePropertyImage)

/**
 * @swagger
 * /api/property/similar/{id}:
 *   get:
 *     summary: Get properties similar to a given property
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Property id
 *     responses:
 *       200:
 *         description: List of similar properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get("/similar/:id", fetchSimilarProperties)

export default router;