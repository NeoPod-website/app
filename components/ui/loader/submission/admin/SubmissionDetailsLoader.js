("use client");

import { Card, CardBody, Skeleton, Divider } from "@heroui/react";

const DetailsPanelSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header Section */}
    <Card>
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-48 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>

    {/* Details Section */}
    <Card>
      <CardBody className="space-y-4 p-6">
        <Skeleton className="h-5 w-24 rounded" />
        <Divider />
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
        </div>
      </CardBody>
    </Card>

    {/* Activity Section */}
    <Card>
      <CardBody className="space-y-4 p-6">
        <Skeleton className="h-5 w-32 rounded" />
        <Divider />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>

    {/* Review Actions */}
    <Card>
      <CardBody className="space-y-4 p-6">
        <Skeleton className="h-5 w-28 rounded" />
        <Skeleton className="h-20 w-full rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </CardBody>
    </Card>
  </div>
);

export default DetailsPanelSkeleton;
