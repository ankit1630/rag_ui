const express = require("express");
const fs = require("fs");
const pool = require("./mysql");
const { randomUUID } = require("crypto");
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
  const transactionId = randomUUID();

  const data = {
    submitterDetails: JSON.parse(req.body.submitterDetails),
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
        msg: "res.send('Files and JSON uploaded successfully!');",
        txId: transactionId,
      });
  } catch (error) {
    console.error("Error during file upload or JSON saving:", error);
    res.status(500).send("Error processing upload.");
  }
});

module.exports = router;

//   try {
//     const connection = await pool.getConnection();
//     const ress = await connection.query("SELECT VERSION()");
//     console.log(ress);
//     connection.release(); // Important: Release the connection
//     res.status(200).send("hello there");
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).send("Internal Server Error");
//   }

// upload each and every file
//   fileIds.forEach((id) => {
//     const file = files[id];

//     const newFilePath = path.join(folderPath, filename);
//     file.mv(newFilePath, (err) => {
//       if (err) {
//         console.error("Error moving file:", err);
//         return res.status(500).send("Error uploading file.");
//       }
//     });
//   });

//   fs.writeFile(objectPath, JSON.stringify(data), (err) => {
//     if (err) {
//       console.error("Error saving JSON:", err);
//       // Handle error appropriately
//     } else {
//       res.send("File and data saved successfully");
//     }
//   });
