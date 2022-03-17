const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const Middleware = require("../middlewares/middleware")

router.get("/test-me", function (req, res) {
    res.send("welcome in our first project...............!")
})


router.post("/create", authorController.createAuthor)


router.post("/createBlog",Middleware.authentication, blogController.create)


router.put("/update/:blogId" ,Middleware.authentication,Middleware.authorise, blogController.updateBlog)


router.delete("/deleteByQuery",Middleware.authentication, blogController.deleteByQuery)


router.delete("/blog/:blogId",Middleware.authentication,Middleware.authorise, blogController.deleteBlog)


router.get("/getBlogs" ,Middleware.authentication, blogController.getBlogs)

router.post("/authorLogin",authorController.authorLogin)


module.exports = router;