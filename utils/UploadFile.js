const AWS = require("aws-sdk");
const { uuids } = require("./Uuid");
require("dotenv").config();

const { AWSKEYID, AWSSECRETKEY, AWSREGION, AWSURL } = process.env;

exports.UploadFile = async (params) => {
  try {
    // update config AWS
    AWS.config.update({
      accessKeyId: AWSKEYID,
      secretAccessKey: AWSSECRETKEY,
      region: AWSREGION,
    });

    const s3 = new AWS.S3({
      endpoint: AWSURL, // kalau pakai S3 compatible storage (MinIO, Wasabi, dsb)
      s3ForcePathStyle: true,
    });

    const { Location, Key } = await s3.upload(params).promise();

    return { status: true, response: Location, key: Key };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { status: false, response: error.message, messages: error };
  }
};
exports.GenerateImage = async (params) => {
  try {
    const typeImages = params.path
      .split(";")[0]
      .match(/jpeg|png|gif|jpg|webp/)[0];
    const bodyImages = Buffer.from(
      params.path.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    let Id = uuids();
    const options = {
      Bucket: process.env.AWSBUCKET,
      Key: params.key + Id + "." + typeImages,
      Body: bodyImages,
      ContentEncoding: "base64",
      ContentType: "image/" + typeImages,
      ACL: "public-read",
    };
    const paths = await this.UploadFile(options);
    return paths;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return { status: false, response: error.message, messages: error };
  }
};
