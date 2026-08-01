import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return Response.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, first_name, last_name, email_addresses } = event.data;
      const email = email_addresses?.[0]?.email_address ?? "";
      const name =
        [first_name, last_name].filter(Boolean).join(" ") ||
        email.split("@")[0] ||
        id;

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, id))
        .limit(1);

      if (existing.length > 0) {
        await db.update(users).set({ name, email }).where(eq(users.clerkId, id));
      } else {
        await db.insert(users).values({ clerkId: id, name, email });
      }
      break;
    }
    case "user.deleted": {
      const { id } = event.data;
      if (id) {
        await db.delete(users).where(eq(users.clerkId, id));
      }
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
