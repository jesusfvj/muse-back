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

module.exports = {
    grouperDataFunction
}