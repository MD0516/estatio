import type { Request, Response } from "express"
import * as InquiryService from "./inquiry.service.js"

export const create = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await InquiryService.createInquiry(user.userId, req.body)

    return res.status(201).json({
        message: "Inquiry created"
    })
}

export const update = async (req: Request<{ id: string }>, res: Response) => {
    const user = req.user;
    const { id } = req.params
    const inquiryId = Number(id);

    if (isNaN(inquiryId)) {
        return res.status(400).json({ message: "Invalid inquiry id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await InquiryService.updateStatus(user.userId, inquiryId, req.body)

    return res.status(200).json({
        message: "Inquiry updated"
    })
}

export const fetchInquiries = async (req: Request<{ id: string }>, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const data = await InquiryService.getAllByUser(user?.userId);

    return res.status(200).json({
        message: "Inquiries fetched",
        data
    })
}