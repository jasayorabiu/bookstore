import {prisma} from "../lib/prisma";
import {Request, Response} from "express";

import {getOrders, getOrderById, createOrder, updateOrder, deleteOrder} from "../services/order.services";

const getOrder = async (req: Request, res: Response) => {
    try {
    const orders = await getOrders();
    res.json({ message: "Orders retrieved successfully", data: orders });
} catch (error) {
    res.status(500).json({ message: "Error retrieving orders" });
}
}

const getOrdersById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const order = await getOrderById(id);
        if (order) {
            res.json({ message: "Order retrieved successfully", data: order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order" });
    }
}

const createOrders = async (req: Request, res: Response) => {
    try {
        const { userId, bookId, total } = req.body;
        const order = await createOrder(userId, bookId, total);
        res.status(201).json({ message: "Order created successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
}

const updateOrders = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { userId, bookId, total } = req.body;
        const order = await updateOrder(id, userId, bookId, total);
        res.json({ message: "Order updated successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
}


const deleteOrders = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await deleteOrder(id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order" });
    }
}

export { getOrder, getOrdersById, createOrders, updateOrders, deleteOrders };