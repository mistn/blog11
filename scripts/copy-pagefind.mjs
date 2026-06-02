/* eslint-disable no-console */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const sourceDir = resolve("dist/pagefind");
const targetDir = resolve("public/pagefind");

if (!existsSync(sourceDir)) {
  console.error(`Pagefind output was not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(resolve("public"), { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true, force: true });
