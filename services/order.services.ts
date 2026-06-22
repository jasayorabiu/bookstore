import {prisma} from "../lib/prisma";

const getOrders = async () => {
    return await prisma.order.findMany();
}
const getOrderById = async (id: number) => {
    return await prisma.order.findUnique({
        where: {
            id: id
        }
    });
}
const createOrder = async (userId: number, bookId: number, total: number) => {
    return await prisma.order.create({
        data: {
            userId,
            bookId,
            total
        }
    });
}   
   
const updateOrder = async (id: number, userId: number, bookId: number, total: number) => {
    return await prisma.order.update({
        where: {
            id: id
        },
        data: {
            userId,
            bookId,
            total
        }
    });
}   

const deleteOrder = async (id: number) => {
    return await prisma.order.delete({
        where: {
            id: id
        }
    });
}

export {getOrders, getOrderById, createOrder, updateOrder, deleteOrder}