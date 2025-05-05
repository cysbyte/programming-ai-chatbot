import { Hono } from "hono";
import { handle } from "hono/vercel";

import books from "./books";
import authors from "./authors";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/books", books).route("/authors", authors);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;