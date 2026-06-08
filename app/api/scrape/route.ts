import { exec } from "child_process";

export async function POST(req: Request) {
  const body = await req.json();

  const { query } = body;

  return new Promise((resolve) => {
    exec(
      `npx tsx scripts/test-scraper.ts "${query}"`,
      (error, stdout, stderr) => {
        if (error) {
          resolve(
            Response.json({
              success: false,
              error: stderr,
            })
          );

          return;
        }

        resolve(
          Response.json({
            success: true,
            output: stdout,
          })
        );
      }
    );
  });
}