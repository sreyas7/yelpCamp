var mongoose = require("mongoose"),
commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    content: String
});
module.exports = new mongoose.model("Comment", commentSchema)