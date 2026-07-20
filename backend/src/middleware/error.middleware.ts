import type { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { CustomError } from "../utils/error.js"

export const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err)

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    return res.status(500).json({ message: "Internal server error" })
}
