const express = require('express')
const router = express.Router()
const verify = require('../auth/checkToken')

const { bookInfoValidation } = require('../book/validation')

const Book = require('../modal/book.modal')

// Get all books
router.get('/', verify, async function(req, res, next) {
    try {
        res.set('Cache-Control', 'public, max-age=30');

        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
    }
});

// Get book by ID
router.get('/:id', verify, async function(req, res, next) {
    try {
        res.set('Cache-Control', 'public, max-age=30');

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "ID sách không hợp lệ" });
        }
        res.status(500).json({ message: "Lỗi khi lấy thông tin sách" });
    }
});

// Create new book
router.post('/create', verify, async function(req, res, next) {
    try {
        const { error } = bookInfoValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, author, year } = req.body;

        // Check if book with same title already exists
        const existingBook = await Book.findOne({ title });
        if (existingBook) {
            return res.status(400).json({ message: "Sách với tiêu đề này đã tồn tại" });
        }

        const newBook = new Book({
            title,
            author: author || undefined,
            year: year || undefined
        });
        
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: "Lỗi khi tạo sách mới" });
    }
});

// Update book
router.put('/:id', verify, async function(req, res, next) {
    try {
        const { error } = bookInfoValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const bookId = req.params.id;
        const { title, author, year } = req.body;

        // Check if another book with the same title exists
        const existingBook = await Book.findOne({ 
            title, 
            _id: { $ne: bookId } 
        });
        if (existingBook) {
            return res.status(400).json({ message: "Sách với tiêu đề này đã tồn tại" });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { 
                title,
                author: author || undefined,
                year: year || undefined
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "ID sách không hợp lệ" });
        }
        res.status(500).json({ message: "Lỗi khi cập nhật sách" });
    }
});

// Delete book
router.delete('/:id', verify, async function(req, res, next) {
    try {
        const bookId = req.params.id;

        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json({ 
            message: "Xóa sách thành công",
            deletedBook
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "ID sách không hợp lệ" });
        }
        res.status(500).json({ message: "Lỗi khi xóa sách" });
    }
});

module.exports = router
