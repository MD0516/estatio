import "dotenv/config";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import type { Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger.js"
import { log } from "./middleware/log.middleware.js";
import AuthRoutes from "./modules/auth/auth.route.js"
import PropertyRoutes from "./modules/property/property.route.js"
import WishlistRoutes from "./modules/wishlist/wishlist.route.js"
import ReviewRoutes from "./modules/review/review.route.js"
import InquiryRoutes from "./modules/inquiry/inquiry.route.js"
import { errorMiddleware } from "./middleware/error.middleware.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4040;

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use(log)

const apiRouter = express.Router();

apiRouter.use('/auth', AuthRoutes)
apiRouter.use('/property', PropertyRoutes)
apiRouter.use('/wishlist', WishlistRoutes)
apiRouter.use("/review", ReviewRoutes)
apiRouter.use("/inquiry", InquiryRoutes)

app.use("/api", apiRouter)

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", message: "Estatio API is running" })
})

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})