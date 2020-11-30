const express = require('express')
const router = express.Router()
const keys = require('./../config/keys')
const path = require('path')
const fs = require('fs');
const File = require('../models/File')
router.get('/:passowrd', async(req, res) => {
    const passowrd = req.params.passowrd;

    if(passowrd !== keys.ADMIN_PASSWORD)
        return res.send('You Are Not Authorized...')
    
    // Delete Records From Database
    try {
        await File.deleteMany({});
    } catch(error) {
        res.send(error)
    }

    // Delete From uploads Folder
    const directory = path.join(__dirname, '../uploads');
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
    
        for (const file of files) {
            if(file !== '.gitkeep')
            {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        }
    });
    
    res.send('All Files Deleted Successfully...');

})

module.exports = router;