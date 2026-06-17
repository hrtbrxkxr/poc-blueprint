import { NextResponse } from "next/server";
import { fetchMaintenanceState } from "@/shell/maintenance/maintenance.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await fetchMaintenanceState();
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ global: false, modules: {} });
  }
}
