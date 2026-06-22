import {prisma} from "../lib/prisma"


const getBooks = async () => {
    return await prisma.book.findMany();
}
const getBookById = async (id: number) => {
    return await prisma.book.findUnique({
        where: {
            id: Number(id)
        }
    });
}
const createBook = async (title: string, author: string, price: number) => {
    return await prisma.book.create({
        data: {
            title,
            author,
            price
        }
    });
}
const updateBook = async (id: number, title: string, author: string, price: number) => {
    return await prisma.book.update({
        where: {
            id: Number(id)
        },
        data: {
            title,
            author,
            price
        }
    });
}
const deleteBook = async (id: number) => {
    return await prisma.book.delete({
        where: {
            id: Number(id)
        }
    });
}

export {getBooks, getBookById, createBook, updateBook, deleteBook}