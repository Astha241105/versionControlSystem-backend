const fs = require("fs").promises;
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/r2-config");

async function pushChanges() {
  const repoPath = path.resolve(process.cwd(), ".vcs");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        });

        await s3.send(command);
        console.log(`Uploaded: commits/${commitDir}/${file}`);
      }
    }

    console.log("All commits pushed to R2.");
  } catch (err) {
    console.error("Error pushing to R2:", err);
  }
}

module.exports = { pushChanges };