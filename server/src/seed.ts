import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";
import { db, pool } from "./db";
import { runMigrations } from "./db/migrate";
import { admins } from "./db/schema";
import { env } from "./env";

/**
 * Creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD.
 * Run with --reset-password to overwrite the password of an existing admin.
 */
async function main() {
  await runMigrations();
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.");
  }
  const email = env.ADMIN_EMAIL.toLowerCase();
  const [existing] = await db.select().from(admins).where(eq(admins.email, email));

  if (!existing) {
    await db.insert(admins).values({ email, passwordHash: await hashPassword(env.ADMIN_PASSWORD) });
    console.log(`Admin created: ${email}`);
  } else if (process.argv.includes("--reset-password")) {
    await db
      .update(admins)
      .set({
        passwordHash: await hashPassword(env.ADMIN_PASSWORD),
        tokenVersion: existing.tokenVersion + 1,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, existing.id));
    console.log(`Password reset for ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
