const fs = require("fs").promises;
const path = require("path");
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/r2-config");

// Helper to convert stream to buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function pullChanges() {
  const repoPath = path.resolve(process.cwd(), ".vcs");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // List objects from R2
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });

    const data = await s3.send(listCommand);
    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      // Skip folder placeholders
      if (key.endsWith("/")) continue;

      const localFilePath = path.join(repoPath, key);
      const localDir = path.dirname(localFilePath);

      // Create directory
      await fs.mkdir(localDir, { recursive: true });

      // Get file from R2
      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      const response = await s3.send(getCommand);
      const fileContent = await streamToBuffer(response.Body);

      // Save locally
      await fs.writeFile(localFilePath, fileContent);

      console.log(`Downloaded: ${key}`);
    }

    console.log("All commits pulled from R2.");
  } catch (err) {
    console.error("Unable to pull:", err);
  }
}

module.exports = { pullChanges };