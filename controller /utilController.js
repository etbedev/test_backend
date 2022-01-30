const { uploadFile } = require("../utils/imageupload");
const singleUpload = uploadFile.single('image')

module.exports={
    async uploadFiles(req,res){
        try {
            console.log(req.file);
        
            if (req.file == undefined) {
              return res.send(`You must select a file.`);
            }
            singleUpload(req, res, async(err) => {
                const url = req.file.filename 
                console.log(url)
        
                return res.status(200).send({
                  success: true,
                  message: 'Sukses edit profile',
                  data : url
                })
              })
            }
          catch (error) {
            console.log(error);
            return res.send(`Error when trying upload images: ${error}`);
    }
}
}