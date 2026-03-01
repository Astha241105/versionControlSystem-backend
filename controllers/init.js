const fs=require('fs').promises; //creates files automatically like .vcs
const path=require('path');    //give access of current working directory to create .vcs folder there

async function initRepo(){    //folder creation takes time
    const repoPath= path.resolve(process.cwd(),".vcs");  //. for hidden folder
    const commitsPath= path.join(repoPath,"commits");  // commits folder inside .vcs
    try{
        await fs.mkdir(repoPath,{recursive:true}); //nested folder creation, if .vcs already exists, it won't throw error because of recursive:true
        await fs.mkdir(commitsPath,{recursive:true});
        await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket: process.env.S3_BUCKET})); //to create config.json file inside .vcs 
        console.log("Repository initialized successfully");
    }
    catch(err){
        console.error("Error initialising repository:",err);
    }
}
module.exports={ initRepo };