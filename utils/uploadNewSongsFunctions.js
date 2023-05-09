const path = require('path');
const fs = require('fs-extra');

const grouperDataFunction = (originalFilesObject) => {
    const groupedData = originalFilesObject.reduce((acc, curr) => {
        const num = curr.fieldname.match(/\d+$/)[0];
        const fileType = curr.fieldname.startsWith('audio') ? 'audio' : 'image';
        if (!acc[num]) {
            acc[num] = [];
        }
        acc[num][fileType] = curr;
        return acc;
    }, {});
    return Object.values(groupedData);
}

const deleteFilesFromUploadFolder = () => {
    const folderPath = '../uploads';
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            fs.unlinkSync(curPath);
        });
        fs.rmdirSync(folderPath);
        console.log(`Deleted folder: ${folderPath}`);
    }
}


module.exports = {
    grouperDataFunction,
    deleteFilesFromUploadFolder
}