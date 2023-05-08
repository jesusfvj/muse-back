const { uploadImage, uploadSong } = require("../utils/cloudinary");

const register = async (req, res) => {

    console.log(req.files);
    console.log(req.body);

    /* let form = new multiparty.Form({uploadDir: './files'})

    form.parse(req, (err, fields, files)=>{
        if(err) return res.send({err:"mal"})
        console.log(`fields = ${JSON.stringify(fields, null, 2)}`)
        console.log(`files = ${JSON.stringify(files, null, 2)}`)
    }) */
    
    /* const filesFormData = req.body.filesFormData */
    /* const reqBody = req.body */
    /* const reqBodyFiles = req.files */

    /* console.log(filesFormData)
    console.log(reqBody) */
    /* console.log(reqBodyFiles) */
    
    
   /*  filesFormData.forEach( async (fileFormData, index) => {
        const songFile = fileFormData.get(`file${index + 1}`);
        const dataFormSong = fileFormData.get(`dataFile${index + 1}`);
        const imageFile = fileFormData.get(`imageFile${index + 1}`);
        console.log(req.files.imageFile.tempFilePath)}) */
        /* const result = await uploadImage(req.files.image.tempFilePath) */
        /* console.dir(songFile);
        console.log(dataFormSong);
        console.log(imageFile);
    });
  
   /*  try {
      if(req.files?.image){
        const result = await uploadImage(req.files.image.tempFilePath)
      }
  
      return res.status(200).json({
        ok: true
      });
    } catch (error) {
      return res.status(503).json({
        ok: false,
        msg: "Something happened...",
      });
    }*/
  };

module.exports = { register };