import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/auth", auth);

// app.get("/project/:projectId", (c) => {
//   const { projectId } = c.req.param();
//   return c.json({ projectId });
// });

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
