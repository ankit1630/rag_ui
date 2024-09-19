const express = require("express");
const fs = require("fs");
const pool = require("./mysql");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const fileUpload = require("express-fileupload");
const path = require("path");
router.use(fileUpload());

// Define saveObject outside the route handler (async)
const saveObject = async (objectPath, jsonObject) => {
  try {
    await fs.promises.writeFile(objectPath, JSON.stringify(jsonObject));
  } catch (error) {
    throw error; // Re-throw the error for handling in the route handler
  }
};

router.post("/saveForm", async (req, res) => {
  const fileIds = Object.keys(req.files);
  const files = req.files;
  const transactionId = uuidv4();

  const data = {
    submitterDetails: JSON.parse(req.body.submitterDetails),
    submitterIsOwner: req.body.submitterIsOwner,
    companyDetails: JSON.parse(req.body.companyDetails),
    owners: JSON.parse(req.body.owners),
  };

  // Create a new folder path
  const folderPath = path.join("./../submittedForms", transactionId);

  try {
    await Promise.all(
      fileIds.map(async (id) => {
        const file = files[id];
        const filename = id + "_" + file.name;
        const newFilePath = path.join(folderPath, filename);

        // Create the folder if it doesn't exist
        await fs.mkdirSync(folderPath, { recursive: true });

        // Move the file asynchronously
        await new Promise((resolve, reject) => {
          file.mv(newFilePath, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        return newFilePath;
      })
    );

    // Save your JSON object to a file in the same folder
    const objectPath = path.join(folderPath, "data.json");
    // Save the JSON object after all files are uploaded
    await saveObject(objectPath, data);

    res
      .status(200)
      .send({
        msg: "Files and JSON uploaded successfully!",
        txId: transactionId,
      });
  } catch (error) {
    console.error("Error during file upload or JSON saving:", error);
    res.status(500).send("Error processing upload.");
  }
});

module.exports = router;
