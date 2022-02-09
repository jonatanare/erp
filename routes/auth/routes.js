const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { Usuarios } = require('../../models/usuarios')
const { Op } = require("sequelize");

router.route('/:email/:password').get(async (req, res) => {
    const { email, password } = req.params
    console.log( req.params)
    
    if ( email && password) {
        let jwtOptions = {secretOrKey: process.env.JWT_SECRET};
        //let user = { id: 1, email: "patricio@gmail.com", uid: "1", active: true, role: "ADMIN" } //await getUserByUid(uid);        
        
        let user = await Usuarios.findOne({
            where: {
                [Op.and]: [
                    { email: email },
                    { password: password }
                  ]
            }
        })

        if (!user){
            return res.json({message: 'Inactive user'})
        }

        let payload = { user: user }
        let token = jwt.sign(payload, jwtOptions.secretOrKey)

        res.status(200).json({ msg: 'ok', token: token, user: user })

    }else{
      res.status(500).json({message: email + " " + password})
    }

})

module.exports = router