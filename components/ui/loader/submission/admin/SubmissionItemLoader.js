"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";

const SubmissionItemLoader = () => (
  <Card className="mb-2 border-l-4 border-l-gray-300">
    <CardBody className="p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-8 w-8 rounded-full" />

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>

            <Skeleton className="h-4 w-4 rounded" />
          </div>

          <Skeleton className="h-4 w-3/4 rounded" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default SubmissionItemLoader;
