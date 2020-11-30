const express = require('express');
const router = express.Router();

/*
@GET
URL : /
Desc: index file Render
*/
router.get('/', async(req, res) => {
    return res.render('index')
})

module.exports = router