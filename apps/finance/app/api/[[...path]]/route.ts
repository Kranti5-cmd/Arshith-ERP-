import { NextRequest } from "next/server";
import { dispatch } from "lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };
export async function GET(req: NextRequest, ctx: Ctx) { return dispatch(req, (await ctx.params).path ?? []); }
export async function POST(req: NextRequest, ctx: Ctx) { return dispatch(req, (await ctx.params).path ?? []); }
export async function PUT(req: NextRequest, ctx: Ctx) { return dispatch(req, (await ctx.params).path ?? []); }
export async function DELETE(req: NextRequest, ctx: Ctx) { return dispatch(req, (await ctx.params).path ?? []); }
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
