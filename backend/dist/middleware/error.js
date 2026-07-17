export default function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({
        error: errorMessage
    });
}
