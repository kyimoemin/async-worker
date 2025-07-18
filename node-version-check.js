const requiredMinVersion = [22, 12];
const currentNodeVersion = process.versions.node;
const [major, minor] = currentNodeVersion.split(".");

const message = `\x1b[31mERROR:\x1b[0m This project requires Node.js version ${requiredMinVersion[0]}.${requiredMinVersion[1]} You are currently using Node.js ${currentNodeVersion}. Please update your Node.js version.`;
class VersionError extends Error {
  constructor() {
    super(message);
    this.name = "VersionError";
  }
}

function logErrorAndExit() {
  console.error(message);
  process.exit(1);
}

if (Number(major) < requiredMinVersion[0]) logErrorAndExit();
if (Number(minor) < requiredMinVersion[1]) logErrorAndExit();
