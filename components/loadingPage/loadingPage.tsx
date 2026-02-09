export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50 z-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
    </div>
  );
}
