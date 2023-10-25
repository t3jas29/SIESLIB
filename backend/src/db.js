const { connect } = require("mongoose")

const connectDb = async () => {
  return connect("mongodb+srv://devendro123:devendro123@cluster0.sahwxxw.mongodb.net/?retryWrites=true&w=majority", { dbName: "Library" })
}

module.exports = { connectDb }
