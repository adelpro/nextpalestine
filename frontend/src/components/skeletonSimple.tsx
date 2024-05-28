export default function SkeletonSimple() {
  return (
    <div
      role="status"
      className="max-w-md p-4 border border-gray-200 rounded shadow w-72 animate-pulse md:p-6 dark:border-gray-700"
    >
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
  );
}
