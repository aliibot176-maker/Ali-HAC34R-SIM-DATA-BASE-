import { writeFile } from "fs/promises";
import { join } from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image } = req.body; // base64 image
      if (!image) return res.status(400).json({ error: "No image provided" });

      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `image-${Date.now()}.png`;
      const filePath = join(process.cwd(), "public", fileName);

      await writeFile(filePath, buffer);
      const publicUrl = `${req.headers.origin}/${fileName}`;

      res.status(200).json({ url: publicUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
