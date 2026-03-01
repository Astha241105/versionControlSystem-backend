const fs = require('fs').promises; 
const path = require('path'); 
const { v4: uuidv4 } = require('uuid'); 

async function commitChanges(message = "No message") {
    const repoPath = path.resolve(process.cwd(), ".vcs");
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    try {
        const commitId = uuidv4(); 
        const commitDir = path.join(commitPath, commitId);
        await fs.mkdir(commitDir, { recursive: true }); 

        const files = await fs.readdir(stagedPath);

        for (const file of files) {
            await fs.copyFile(
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({
                message,
                date: new Date().toISOString()
            }, null, 2)
        );

        console.log(`Changes committed successfully with commit ID: ${commitId}`);
    } 
    catch (err) {
        console.error("Error committing files:", err);
    }
}

module.exports = { commitChanges };