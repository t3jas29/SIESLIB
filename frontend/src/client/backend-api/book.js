const BookApi = {
  getAllBooks: async (data) => {
    console.log(data)
    const res = await fetch("/v1/book/getBook", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" }, })
    return res.json()
  },
  getBookByIsbn: async (bookIsbn) => {
    const res = await fetch(`/v1/book/${bookIsbn}`, { method: "GET" })
    return res.json()
  },
  addBook: async (data) => {
    const res = await fetch("/v1/book/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return res.json()
  },
  patchBookByIsbn: async (bookIsbn, data) => {

    console.log(data)
    const res = await fetch(`/v1/book/${bookIsbn}`, {
      method: "PATCH",
      body: data,
    })
    return res.json()
  },
  deleteBook: async (bookIsbn) => {
    const res = await fetch(`/v1/book/${bookIsbn}`, { method: "DELETE" })
    return res.json()
  },
}

module.exports = { BookApi }
