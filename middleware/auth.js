  
const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, "asdfghjklkjhgfdsa1234567890987654321", (err, user,phone) =>{
            if(err) return res.status(400).json({msg: "Invalid Authentication"})

            req.user = user
            req.phone = phone
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth