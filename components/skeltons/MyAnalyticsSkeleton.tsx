export const MyAnalyticsSkelton = () => {
  return (
    <div className="space-y-4 mt-4 animate-pulse">
      {/* Title + Select */}
      <div className="flex flex-col gap-4 justify-between items-start">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Cards */}
      <div className="flex gap-4">
        {/* Chart 1 */}
        <div className="h-[300px] w-[433px] bg-gray-100 border border-gray-200 rounded-xl" />

        {/* Chart 2 */}
        <div className="h-[300px] w-[433px]  bg-gray-100 border border-gray-200 rounded-xl" />

        {/* Summary */}
        <div className="h-[300px] flex-1 bg-gray-100 border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
