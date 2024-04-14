import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const data = await request.json();
  const { id, path, browser, referrer, os, device, country, website_id } = data;
  const { data: website } = await supabase
    .from("site_domains")
    .select("*")
    .eq("domain_name", path.split("/")[2]);
  if (!website || website.length === 0) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }
  var found = false;
  for (let i = 0; i < website.length; i++) {
    if (website[i].website_id === website_id) {
      found = true;
      break;
    }
  }
  if (!found) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("analytics").insert({
    id: id,
    path: path.split("/")[3],
    browser: browser,
    referrer: referrer,
    os: os,
    device: device,
    country: country,
    website_id: website_id,
    domain: path,
  });
  if (error) {
    console.error("error adding analytics:", error);
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}