import { sql } from "drizzle-orm";
import { hashPassword } from "./auth";
import { db, pool } from "./db";
import { admins } from "./db/schema";
import { env } from "./env";

async function main() {
  const rows = await db.select().from(admins);
  if (rows.length !== 1) throw new Error(`Expected exactly one admin, found ${rows.length}.`);
  const email = env.ADMIN_EMAIL!.toLowerCase();
  await db
    .update(admins)
    .set({
      email,
      passwordHash: await hashPassword(env.ADMIN_PASSWORD!),
      tokenVersion: sql`${admins.tokenVersion} + 1`,
      updatedAt: new Date(),
    });
  console.log(`Admin ${rows[0].email} -> ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
