const jwt = require('jsonwebtoken')
const { Usuarios } = require('../../models/usuarios')

getToken = async (req, res, next) => {
    const { email, password } = req.body.user
    
    if ( email && password) {
        let jwtOptions = {secretOrKey: process.env.JWT_SECRET};
        //let user = { id: 1, email: "patricio@gmail.com", uid: "1", active: true, role: "ADMIN" } //await getUserByUid(uid);        
        
        let user = await Usuarios.findOne({
            where: {email: email, password: password}
        })

        user.password = ""

        //if (user && !user.active){
        //    return res.json({message: 'Inactive user'})
        //}

        let payload = { user: user }
        let token = jwt.sign(payload, jwtOptions.secretOrKey)

        res.status(200).json({ msg: 'ok', token: token, user: user })

    }else{
      res.status(500).json({message: name + " " + password})
    }
}

verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'].replace('Bearer ','').replace('"','').replace('"','')

    console.log(bearerHeader)

    if (typeof bearerHeader !== undefined){
        req.token = bearerHeader
        jwt.verify(bearerHeader, process.env.JWT_SECRET, (err, authData) => {
            if(err){
                res.status(403).json(err)
            }else{
                req.user = authData.user
                next()
            }
        })
    }else{
        res.sendStatus(403)
    }
}

isAdmin = (req, res, next) => {
    next()
    /*const { user } = req;
    if (user.role === "ADMIN" || user.role === "SUPER"){
        next()
    }else{
        console.log("Not authorized")
        res.status(401).send("Not authorized")
    }*/
}

module.exports = {getToken, verifyToken, isAdmin}