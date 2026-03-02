const fs=require('fs');
const path=require('path');
const { promisify } = require('util');   //check for existing things

const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);

async function revertChanges(commitId) {
    const repoPath =path.resolve(process.cwd(), '.vcs');
    const commitPath = path.join(repoPath, 'commits');
    try {
        const commitDir = path.join(commitPath, commitId);
        const files = await readdir(commitDir);
        const parentDir=path.resolve(repoPath, 'working');
        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
            console.log(`Reverted to commit ${commitId}`);}
    }
    catch (err) {
        console.error('Error reverting changes:', err);
    }
}
module.exports = { revertChanges };