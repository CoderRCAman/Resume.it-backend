const router = require('express').Router()
const userCtrl =require('../Controllers/userCtrl')

router.post('/google_Login', userCtrl.googleLogin)
router.get('/refresh',userCtrl.refreshToken)




module.exports = router