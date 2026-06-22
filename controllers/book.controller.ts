import {prisma} from "../lib/prisma";
import express from "express";
import {Request, Response} from "express";
import {getBooks, getBookById, createBook, updateBook, deleteBook} from "../services/book.services";

const getBook = async (req: Request, res: Response) => {
    try {
    const books = await getBooks();
    res.json({ message: "Books retrieved successfully", data: books });
} catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
}
}

const getBooksById = async (req: Request, res: Response) => {
    try { 
    const id = Number(req.params.id);
    console.log("Received ID:", id); // Debugging log
    const book = await getBookById(id);
    if (book) {
        res.json({ message: "Book retrieved successfully", data: book });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
} catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
}
}
const createBooks = async (req: Request, res: Response) => {
    try { 
    const { title, author, price } = req.body;
    const book = await createBook(title, author, price);
    res.status(201).json({ message: "Book created successfully", data: book });}catch (error) {
        res.status(500).json({ message: "Error creating book" });
    }

}

const updateBooks = async (req: Request, res: Response) => {
    try { 
    const id = Number(req.params.id);
    const { title, author, price } = req.body;
    const book = await updateBook(id, title, author, price);
    res.json({ message: "Book updated successfully", data: book });
} catch (error) {
    res.status(500).json({ message: "Error updating book" });
}}

const deleteBooks = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await deleteBook(id);
    } catch (error) {
        res.status(500).json({ message: "Error deleting book" });
    }
    res.json({ message: "Book deleted successfully" });
}

export { getBook, getBooksById, createBooks, updateBooks, deleteBooks }; 
