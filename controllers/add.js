const fs=require('fs').promises; 
const path=require('path');  


async function addFiles(filePath) {
    const repoPath= path.resolve(process.cwd(),".vcs");
    const stagingPath= path.join(repoPath,"staging");
    try {
        await fs.mkdir(stagingPath,{recursive:true}); //create staging folder if it doesn't exist
        const fileName=path.basename(filePath);
        await fs.copyFile(filePath,path.join(stagingPath,fileName));
        console.log(`File ${fileName} added to staging area successfully`);
    }catch(err){
        console.error("error adding files : ",err)
    }
}
module.exports={ addFiles };