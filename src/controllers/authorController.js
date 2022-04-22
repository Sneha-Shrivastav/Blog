const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

let validateEmail = function (Email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email);
}

const isValidTitle = (title) => {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1

}


const createAuthor = async function (req, res) {
    try {
        const data = req.body

        const {fname, lname, title, email, password} = data

        if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })
        if(!isValid(fname)) return res.status(400).send({error:"Please enter first name"})
        if(!isValid(lname)) return res.status(400).send({error:"Please enter last name"})
        if(!isValid(title)) return res.status(400).send({error:"Please enter title"})
        if(!isValidTitle(title)) return res.status(400).send({error:"title must be either ['Mr', 'Mrs', 'Miss']"})
        if(!isValid(email)) return res.status(400).send({error:"Please enter email"})
        if(!validateEmail(email)) return res.status(400).send({error: "Please enter a valid email" })
        if(!isValid(password)) return res.status(400).send({error:"Please enter password"})

        const emailAlreadyUsed = await authorModel.findOne({email})

        if(emailAlreadyUsed) return res.status(400).send({status: false, msg: "email already registered"})

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
    const {email, password} = req.body

    if(!Object.keys(req.body).length > 0) return res.status(400).send({ error: "Please enter data" })

    if (!isValid(email)) return res.status(400).send({ error: "Please enter email" })
    if(!validateEmail(email)) return res.status(400).send({error: "Please enter a valid email" })
    if (!isValid(password)) return res.status(400).send({ error: "Please enter password" })
    let author = await authorModel.findOne({email: email, password: password });
    if (!author)
        return res.status(400).send({
            status: false,
            msg: "email or password  is incorerct",
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