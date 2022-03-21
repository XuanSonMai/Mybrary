const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>
{
    res.render('index',{msg:'HELLO TEST'})
})

module.exports = router