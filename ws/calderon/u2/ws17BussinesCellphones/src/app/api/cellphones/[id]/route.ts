export async function GET(
  request: Request,
  { params }: {
    params: { id: string }
  }
) {

  const data =
    await controller.getById(
      params.id
    );

  return NextResponse.json(data);
}