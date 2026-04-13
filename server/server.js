const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const database = require("./src/config/database");
const { cloudinaryConnect } = require("./src/config/cloudinary");

const PORT = process.env.PORT || 4000;

database.connect();
cloudinaryConnect();

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
