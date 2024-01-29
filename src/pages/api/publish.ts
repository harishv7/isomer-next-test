// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
type Data = {
  message: string;
  path?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { permalink, ...data } = req.body;

    // Construct the file content
    const fileContent = `export const schema = ${JSON.stringify(
      data,
      null,
      2
    )};`;

    // Define the file path
    const filePath = path.join(
      process.cwd(),
      `src/schema/${permalink}/schema.ts`
    );
    const directory = path.dirname(filePath);

    // Create the directory if it does not exist
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating directory" });
      }

      // Write to the file
      fs.writeFile(`${filePath}`, fileContent, "utf8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error writing file" });
        }
        res
          .status(200)
          .json({ message: "Data written successfully", path: filePath });
      });
    });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
