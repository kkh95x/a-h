import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export async function updateDb(mutator) {
  const db = await readDb();
  const next = await mutator(db);
  await writeDb(next ?? db);
  return next ?? db;
}
