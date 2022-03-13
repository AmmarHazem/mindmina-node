const path = require("path");
const CustomErrors = require("../errors");
const { origin } = require("../constants");

const uploadFile = async (request, response) => {
  if (!request.files || !request.files.file) {
    throw new CustomErrors.BadRequestError("file is required");
  }
  const file = request.files.file;
  //   if (!file.mimetype.startsWith("image/")) {
  //     throw new CustomErrors.BadRequestError("file has to be an image");
  //   }
  const maxSize = 1024 * 1024 * 50;
  if (file.size > maxSize) {
    throw new CustomErrors.BadRequestError(
      `file size must be ${maxSize} bytes or less`
    );
  }
  //   console.log("--- __dirname", __dirname);
  const fileName = file.name.toLocaleLowerCase().replaceAll(" ", "-");
  const imagePath = path.join(__dirname, "../public/uploads", fileName);
  await file.mv(imagePath);
  return response.json({
    image: { src: `${origin}/uploads/${fileName}` },
  });
};

module.exports = { uploadFile };
