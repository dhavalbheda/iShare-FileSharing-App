const express = require('express');
const router = express.Router();
const {v4: uuid4} = require('uuid');
const keys = require('../config/keys');
const sendMail = require('../services/emailService');
const emailTemplet = require('../utils/emailTemplet')

const File = require('./../models/File')
const uploadFile = require('./../utils/multerSetup')


/*
@GET
URL : api/files/:uuid
Desc: Fetch File Details
*/
router.get('/:uuid', async(req, res) => {

    const file = await File.findOne({uuid: req.params.uuid})
    if(!file)
        return res.status(401).json({error: 'File Not Found'})
    
    return res.render('download', {
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${keys.BASE_URL}/files/download/${file.uuid}`
    })
})

/*
@POST
URL : api/files
Desc: Upload File
*/
router.post('/', (req, res) => {
    uploadFile(req, res, async (error) => {
        // check file is attach or not by multer
        if(!req.file) 
            return res.json({error: 'Please Attach Any File'})
        
        // Check if any error
        if(error)
            return res.json({error: error})

        // Store in Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })
        await file.save()
        return res.json({url: `${keys.BASE_URL}/files/${file.uuid}`})
    })
})


/*
@GET
URL : files/download/:uuid
Desc: Download File
*/
router.get('/download/:uuid', async (req, res) => {
    const file = await File.findOne({uuid: req.params.uuid})
    if(!file)
        return res.status(404).json({error: 'File Not Found'})
    
    const filePath = `${__dirname}/../${file.path}` 
    return res.download(filePath)
})

/*
@GET
URL : api/files/sendEmail
Desc: Upload File
*/
router.post('/sendEmail', async (req, res) => {
    const { uuid, sender, receiver } = req.body;

    // Validate All Fields
    if(!uuid || !sender || !receiver)
        return res.status(422).json({error: 'All Fields Are Required.'})

    // Get Data From Database
    const file = await File.findOne({ uuid: uuid })
    
    if(!file)
        return res.status(404).json({error: 'File Not Found.'})
    
    if(file.sender)
        return res.status(422).json({error: 'Email Already Sent.'})

    // Save in Databasee
    file.sender = sender
    file.receiver = receiver
    await file.save()

    let mail = await sendMail({
                from: sender,
                to: receiver,
                subject: 'iShare File Sharing',
                text: ``,
                html: emailTemplet({
                    sender: sender,
                    downloadLink: `${keys.BASE_URL}/files/${file.uuid}`,
                    size: parseInt(file.size/1000) + ' KB',
                    expires: '24 Hours'
                })
            })
    if(mail)
        return res.status(422).json({success: true})
    return res.status(200).json({success: false})
})


module.exports = router