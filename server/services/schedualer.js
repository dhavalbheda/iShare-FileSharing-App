const File = require('./../models/File');
const fs = require('fs');
const path = require('path')
const connection = require('./../config/connectDB')

const deleteData = async() => {
    connection();
    const pastDate = new Date(Date.now() - (24 * 60 * 60 * 1000))
    const files = await File.find({createdAt: { $lt: pastDate}})
    
    if(files.length) {
        for(const file of files) {
            try {
                fs.unlinkSync(path.join(__dirname,'../' ,file.path));
                await file.remove();
                console.log(`Success Fully Deleted ${file.filename}`);
            } catch(error) {
                console.log(`Error while Deleting File: ${error}`)
            }
        }
    }
}
deleteData()
.then(() => {
    console.log('Job Done...');
    process.exit()
});