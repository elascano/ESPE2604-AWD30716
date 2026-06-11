import { NextResponse } from "next/server";
import { CellphoneController }
from "@/modules/cellphone/cellphone.controller";

const controller =
  new CellphoneController();

export async function GET() {

  const data =
    await controller.getAll();

  return NextResponse.json(data);
}

export async function POST(
  request: Request
) {

  const body =
    await request.json();

  const data =
    await controller.create(body);

  return NextResponse.json(data);
}