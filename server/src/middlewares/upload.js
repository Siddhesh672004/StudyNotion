const fileUpload = require("express-fileupload");
const os = require("os");

module.exports = fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
});
