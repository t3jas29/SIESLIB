const router = require("express")()
const { BookModel } = require("../models/book")
const multer = require("multer")
const express = require("express")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./assets")
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    cb(null, Date.now() + file.originalname)
  },
})

// Configure storage engine instead of dest object.
const upload = multer({ storage: storage })

router.post("/getBook", async (req, res, next) => {
  try {
    console.log(req)
    const query = {}
    if(req?.body?.category){
      query.category = req?.body?.category
    }
    const books = await BookModel.find(query)
    return res.status(200).json({
      books: books.map((book) => ({
        ...book.toJSON(),
        availableQuantity: book.quantity - book.borrowedBy?.length,
      })),
    })
  } catch (err) {
    next(err)
  }
})

router.get("/:bookIsbn", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }
    return res.status(200).json({
      book: {
        ...book.toJSON(),
        availableQuantity: book?.quantity - book?.borrowedBy?.length,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    console.log(req.body)
    const book = await BookModel.findOne({ isbn: req.body.isbn })
    if (book != null) {
      return res.status(400).json({ error: "Book with same ISBN already found" })
    }
    req.body.image = req.file.path
    const newBook = await BookModel.create(req.body)
    return res.status(200).json({ book: newBook })
  } catch (err) {
    next(err)
  }
})

router.patch("/:bookIsbn", upload.single("image"), async (req, res, next) => {
  try {
    req.body.priceHistory= JSON.parse(req.body.priceHistory)
    req.body.quantityHistory= JSON.parse(req.body.quantityHistory)

    if (req?.file?.path) {
      req.body.image = req.file.path
    }
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }

    const { _id, isbn, borrowedBy, ...rest } = req.body

    // Handle empty reference for borrowedBy
    const updatedBorrowedBy = borrowedBy ? borrowedBy : null
    const updatedBook = await BookModel.findByIdAndUpdate(
      book._id,
      { borrowedBy: updatedBorrowedBy, ...rest },
      { new: true }
    )

    return res.status(200).json({ book: updatedBook })
  } catch (err) {
    next(err)
  }
})

router.delete("/:bookIsbn", async (req, res, next) => {
  try {
    const book = await BookModel.findOne({ isbn: req.params.bookIsbn })
    if (book == null) {
      return res.status(404).json({ error: "Book not found" })
    }
    await book.delete()
    return res.status(200).json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = { router }
