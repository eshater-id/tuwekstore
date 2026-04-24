import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import multer from "multer";
import { google } from "googleapis";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Google Drive Upload API
  app.post("/api/upload", upload.single("file"), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID } = process.env;

      if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        // Fallback for demo
        console.warn("Google credentials not found. Using fallback.");
        return res.json({ 
          url: "https://images.unsplash.com/photo-1594932224010-75f2a77d96ba?q=80&w=800",
          message: "Demo mode: Real upload requires GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY"
        });
      }

      const auth: any = new google.auth.JWT({
        email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/drive.file"]
      });

      const drive = google.drive({ version: "v3", auth });

      const fileMetadata = {
        name: `${Date.now()}-${req.file.originalname}`,
        parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : [],
      };

      const media = {
        mimeType: req.file.mimetype,
        body: Readable.from(req.file.buffer),
      };

      const driveFile = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      } as any);

      // Make file public if needed
      await drive.permissions.create({
        fileId: driveFile.data.id!,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const fileId = driveFile.data.id;
      const viewUrl = `https://lh3.googleusercontent.com/u/0/d/${fileId}`;

      res.json({ url: viewUrl, fileId });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Sheets Sync API
  app.post("/api/sync-sheets", async (req: any, res: any) => {
    try {
      const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

      if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
        return res.status(400).json({ error: "Google Sheets configuration missing" });
      }

      const auth: any = new google.auth.JWT({
        email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      });

      const sheets = google.sheets({ version: "v4", auth });

      const { products } = req.body;

      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "No products provided for sync" });
      }

      const rows = [
        ["ID", "Nama", "Harga", "Kategori", "Stok", "Clicks"],
        ...products.map((p: any) => [p.id, p.name, p.price, p.category, p.stock, p.clicks])
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: "Sheet1!A1",
        valueInputOption: "RAW",
        requestBody: { values: rows },
      });

      res.json({ success: true, message: "Sync successful" });
    } catch (error: any) {
      console.error("Sheets sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
