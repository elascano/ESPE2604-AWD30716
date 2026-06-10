export function handleError(error: unknown) {

    console.error(error);

    return Response.json(
        {
            message: "Internal Server Error"
        },
        {
            status: 500
        }
    );
}