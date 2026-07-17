export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="text-slate-600">
           Loading
          </p>
        </div>
      </div>
  );
}
