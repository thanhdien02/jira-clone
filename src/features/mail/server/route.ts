import { EmailTemplate } from "@/components/email-template";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator(
    "json",
    z.object({
      name: z.string().min(1, "Required"),
    })
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { name } = c.req.valid("json");
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["ntd171002@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: name }),
    });

    if (error) {
      return c.json({ error }, 401);
    }
    return c.json({ data });
  }
);
export default app;
