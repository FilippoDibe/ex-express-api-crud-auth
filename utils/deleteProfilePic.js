const path = require('path');
const fs = require('fs');

module.exports = (filename) => {
    try{
        const filePath = path.join(__dirname, '../public/profile_pics/' + filename);
        fs.unlinkSync(filePath);
    }
    catch(err){
        console.log(`Non sono riuscito ad eliminare la profile pic ${filename}.`);
    }
}