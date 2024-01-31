import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

type Data = {
  message: string;
  path?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { permalink } = req.body;
    const data = req.body;

    // Construct the file content for schema.ts
    const schemaContent = `export const schema = ${JSON.stringify(
      data,
      null,
      2
    )};`;

    // Define the file path for schema.ts
    const schemaFilePath = path.join(
      process.cwd(),
      `src/schema/${permalink}/schema.ts`
    );
    const schemaDirectory = path.dirname(schemaFilePath);

    // Construct the file content for index.tsx
    const indexContent = `import { RenderEngine } from "@isomerpages/isomer-components";
import { schema } from "@/schema/${permalink}/schema";

export default function Preview() {
  const renderSchema = schema;
  return (
    <RenderEngine
      id={renderSchema.id}
      layout={renderSchema.layout}
      path={renderSchema.permalink}
      components={renderSchema.components}
    />
  );
}`;

    // Define the file path for index.tsx
    const indexPath = path.join(
      process.cwd(),
      `src/pages/${permalink}/index.tsx`
    );
    const indexDirectory = path.dirname(indexPath);

    // Create the directories and write the files
    fs.mkdir(schemaDirectory, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error creating schema directory" });
      }

      // Write to the schema.ts file
      fs.writeFile(schemaFilePath, schemaContent, "utf8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error writing schema file" });
        }

        // Create the directory for index.tsx
        fs.mkdir(indexDirectory, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Error creating index directory" });
          }

          // Write to the index.tsx file
          fs.writeFile(indexPath, indexContent, "utf8", (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error writing index file" });
            }
            res.status(200).json({
              message: "Data and index written successfully",
              path: schemaFilePath,
            });
          });
        });
      });
    });

    // Perform git ops
    // Initialize simple-git
    const git = simpleGit();

    try {
      // Checkout new branch 'feat-publish' or create it if doesn't exist
      await git
        .checkout(["-b", "feat-publish"])
        .catch(() => git.checkout("feat-publish"));

      // Add changes in 'pages' and 'schema' folders
      await git.add(["src/pages", "src/schema"]);

      // Commit changes
      await git.commit("new publish");

      // Push to remote 'feat-publish' branch
      await git.push("origin", "feat-publish");

      // Checkout back to the 'main' branch
      await git.checkout("main");

      res.status(200).json({
        message:
          "Data and index written successfully, and git operations completed",
        path: schemaFilePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error during git operations" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
