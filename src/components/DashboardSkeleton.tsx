export function DashboardSkeleton() {
    return (
      <div className="space-y-12">
        {/* Skeleton for Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-28 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
  
        {/* Skeleton for Pending Task Summary */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-24 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
  
        {/* Skeleton for Priority Summary Table */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-1/4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 animate-pulse rounded-lg"></div>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-8 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  