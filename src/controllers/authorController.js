const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")


const createAuthor = async function (req, res) {
    try {
        const data = req.body

        if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })
        if(!data.fname) return res.status(400).send({error:"Please enter first name"})
        if(!data.lname) return res.status(400).send({error:"Please enter last name"})
        if(!data.title) return res.status(400).send({error:"Please enter title"})
        if(!data.email) return res.status(400).send({error:"Please enter email"})
        if(!data.password) return res.status(400).send({error:"Please enter email"})
        const createdauthor = await authorModel.create(data)
        res.status(201).send({ data: createdauthor })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

const authorLogin = async function (req, res) {
    try {
    let emailId = req.body.email;
    let password = req.body.password;

    if (!Object.keys(emailId).length > 0) return res.status(400).send({ error: "Please enter email" })
    if (!Object.keys(password).length > 0) return res.status(400).send({ error: "Please enter password" })
    let author = await authorModel.findOne({ email: emailId, password: password });
    if (!author.email)
        return res.status(400).send({
            status: false,
            msg: "email passwordor the  is not corerct",
        })

    let token = jwt.sign(
        {
            authorId: author._id
        },
        "Project-1"
    );
    res.status(200).send({ data: token })
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
}


module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin