import { StatusCodes } from "http-status-codes";

import razorpay from '../config/razorpayConfing.js'
import { CURRENCY, RECEIPT_SECRET } from "../config/serverConfig.js";
import { createPaymentService, updatePaymentStatusService } from "../services/paymentService.js";
import { internullServerError } from "../utils/common/responseObject.js";
export const createOrderController = async (req, res) => { 
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: CURRENCY,
            receipt: RECEIPT_SECRET
        };

        const order = await razorpay.orders.create(options);
        console.log(order);

        await createPaymentService(order.id, order.amount);

        if(!order){
            throw new Error('Failed to create order');
        }

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Order create successfully',
            data: order
        })

    } catch (error) {
        console.log("Error in createController", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}

export const capturePaymentController = async (req, res) => {
    try {
        console.log("Request body", req.body);
        await updatePaymentStatusService(req.body.orderId, req.body.status, req.body.paymentId, req.body.signature);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Order create successfully',
            data: ''
        })
    } catch (error) {
        console.log("Error in capturePaymentController", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internullServerError(error));
    }
}