const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const moment = require("moment")
const { months } = require("moment")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const create = async function (req, res) {
    try {
        const data = req.body

        const {title, body, authorId, category} = data

        if (!Object.keys(data).length > 0) return res.send("Please enter blogData")
        if (!isValid(title)) return res.status(400).send({ error: "Please enter title" })
        if (!isValid(body)) return res.status(400).send({ error: "Please enter body" })
        if (!isValid(authorId)) return res.status(400).send({ error: "Please enter Author Id" })
        if (!isValid(category)) return res.status(400).send({ error: "Please enter Category" })


        const findAuthor = await authorModel.find({ _id: authorId })

        if (!findAuthor.length > 0) return res.status(400).send("authorId is not present")


        const createdBlog = await blogModel.create(data)

        res.status(201).send({ createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


const getBlogs = async function (req, res) {
    try {
        const data = req.query
        const filter = {
            isDeleted:false,
            isPublished:true,
            ...data
        }

        if (!data) return res.status(400).send({ error: "Enter some for the filter data" })

        const blogs = await blogModel.find(filter).populate("authorId")

        if (!(blogs).length > 0) return res.status(404).send({ error: "No such data found" })

        return res.status(200).send({ data: blogs })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ msg: err.message })
    }
}


const updateBlog = async function (req, res) {
    try {
        let data = req.body
        const id = req.params.blogId

        if (!id) {
            res.status(400).send(" Please enter id ")
            return
        }

        if (!isValid(data)) {
            return res.status(400).send("Enter data to update")
        }



        const time = moment()

        const a = { ...data, isPublished: true, publishedAt: time }



        const update = await blogModel.findOneAndUpdate({ _id: id }, { $set: a }, { new: true })

        return res.status(200).send({data:update})

        if (!update) return res.status(404).send({ error: "No such data found " })
        return res.status(200).send({ msg: update })
    }
    catch (error) {
        return res.status(500).send(error.message)
    }
}



const deleteBlog = async function (req, res) {
    try {
        let Id = req.params.blogId;

        if (!Id) return res.status(400).send({ error: "blogId should be present in params" });

        const data = await blogModel.find({ _id: Id })

        if (!data) return res.status(400).send({ error: "Invalid blogId" })

        
        const timeDate = moment()

        const dataforUpdation = { ...data, isDeleted: true, deletedAt: timeDate }

        let deletedBlog = await blogModel.findByIdAndUpdate({ _id: Id }, dataforUpdation, { new: true });
        res.send({ status: "Deleted", data: deletedBlog });

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const deleteByQuery = async function (req, res) {
    try {
        const data = req.query
        // console.log(data)

        if (!data) return res.status(400).send({ error: "Please enter some data to campare" })

        const timeDate = moment()

        const dataforUpdation = { ...data, isDeleted: true, deletedAt: timeDate }

        const result = await blogModel.updateMany(data, dataforUpdation, { new: true })

        if (!result) res.status(404).send({ error: " No data found" })

        res.status(200).send({ data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.create = create
module.exports.deleteByQuery = deleteByQuery
module.exports.deleteBlog = deleteBlog
module.exports.updateBlog = updateBlog
module.exports.getBlogs = getBlogs