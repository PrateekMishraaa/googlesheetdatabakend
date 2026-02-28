require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors")
const app = express();
app.use(cors())
const spreadsheetId = "17yhNDdSHthhwDj4sf7vaauEXSpvh4fnlIy4W2wHjPfY";
const apiKey = process.env.API_KEY;
const range = "Form Responses 2";

app.get("/get-data", async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    const response = await axios.get(url);
    console.log("this the sheet data",response)
    res.json(response.data.values);
  } catch (error) {
    console.log(error.response?.data);
    res.status(500).json(error.response?.data);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));







// require("dotenv").config();
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const { google } = require("googleapis");

// const app = express();
// const PORT = 5000;

// const spreadsheetId = process.env.SPREADSHEET_ID;
// const range = "Form Responses 2"; // change if needed

// // Google Auth
// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, "credentials.json"),
//   scopes: [
//     "https://www.googleapis.com/auth/spreadsheets.readonly",
//     "https://www.googleapis.com/auth/drive.readonly",
//   ],
// });

// // Extract Drive File ID
// function extractFileId(url) {
//   const match = url.match(/[-\w]{25,}/);
//   return match ? match[0] : null;
// }

// // Download File with Original Name
// async function downloadFile(drive, fileId, folderPath) {
//   const meta = await drive.files.get({
//     fileId,
//     fields: "name",
//   });

//   const fileName = meta.data.name;
//   const filePath = path.join(folderPath, fileName);

//   const response = await drive.files.get(
//     { fileId, alt: "media" },
//     { responseType: "stream" }
//   );

//   const writer = fs.createWriteStream(filePath);
//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", () => resolve(fileName));
//     writer.on("error", reject);
//   });
// }

// // 🔥 SINGLE API
// app.get("/sync-all", async (req, res) => {
//   try {
//     const client = await auth.getClient();
//     const sheets = google.sheets({ version: "v4", auth: client });
//     const drive = google.drive({ version: "v3", auth: client });

//     // 1️⃣ Fetch Sheet Data
//     const sheetData = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     const rows = sheetData.data.values;
//     if (!rows || rows.length === 0) {
//       return res.json({ message: "No data found in sheet" });
//     }

//     const headers = rows[0];
//     const dataRows = rows.slice(1);

//     const downloadFolder = path.join(__dirname, "downloads");
//     if (!fs.existsSync(downloadFolder)) {
//       fs.mkdirSync(downloadFolder);
//     }

//     const finalData = [];

//     // 2️⃣ Loop Rows
//     for (let row of dataRows) {
//       let obj = {};

//       for (let i = 0; i < headers.length; i++) {
//         let value = row[i] || "";

//         if (value.includes("drive.google.com")) {
//           const links = value.split("\n");
//           const downloadedFiles = [];

//           for (let link of links) {
//             const fileId = extractFileId(link.trim());

//             if (fileId) {
//               const fileName = await downloadFile(
//                 drive,
//                 fileId,
//                 downloadFolder
//               );
//               downloadedFiles.push(fileName);
//             }
//           }

//           obj[headers[i]] = downloadedFiles;
//         } else {
//           obj[headers[i]] = value;
//         }
//       }

//       finalData.push(obj);
//     }

//     // 3️⃣ Send Response
//     res.json({
//       success: true,
//       totalRows: finalData.length,
//       message: "Sheet data fetched & media downloaded successfully",
//       data: finalData,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });