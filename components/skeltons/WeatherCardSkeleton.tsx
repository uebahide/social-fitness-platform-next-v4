export const WeatherCardSkeleton = () => {
  return (
    <section className="col-span-1 row-span-1 animate-pulse">
      <div className="bg-card relative mt-9 space-y-8 rounded-sm border border-gray-200 px-7 py-6">
        {/* Date */}
        <div className="flex items-end gap-x-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-12 bg-gray-200 rounded" />
        </div>

        {/* Weather main */}
        <header className="flex gap-x-4 items-center">
          {/* Icon */}
          <div className="h-14 w-14 bg-gray-200 rounded-full" />

          {/* Weather info */}
          <div className="flex flex-col gap-y-2">
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-y-2 ml-auto">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </header>

        <hr />

        {/* 7 day forecast */}
        <ul className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <li key={i} className="flex flex-col items-center gap-y-2">
              <div className="h-4 w-6 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-200 rounded-full" />
              <div className="h-3 w-10 bg-gray-200 rounded" />
              <div className="h-3 w-10 bg-gray-200 rounded" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
