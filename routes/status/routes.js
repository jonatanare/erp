const express = require('express')
const router = express.Router()
const { getToken, verifyToken, isAdmin } = require('../auth/auth')

router.route('/').get((req, res) => res.send('OK!!!!'))
router.route('/verifyToken').get(verifyToken, isAdmin, (req, res) => { res.send('OK') })
router.route('/getToken').get(getToken)

module.exports = router