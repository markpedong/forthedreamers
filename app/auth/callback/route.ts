import { createSupabaseServerClient } from "@/lib/supabase/server";
import { upsertAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const safeNextPath = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", url.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) await upsertAuthUser(user);

  return NextResponse.redirect(new URL(next, url.origin));
};
