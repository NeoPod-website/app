import { Card, CardBody } from "@heroui/react";
import { UserIcon, InboxIcon, SearchIcon, AlertCircleIcon } from "lucide-react";

export const NoPodSelected = () => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
        <UserIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
      </div>

      <h2 className="mb-4 text-2xl font-bold text-white">Select a Pod</h2>

      <p className="mb-6 leading-relaxed text-gray-200">
        Choose a pod from the sidebar to view and manage submissions. Each pod
        contains unique quests and ambassador activities.
      </p>

      <Card className="border bg-gradient-dark">
        <CardBody className="p-4">
          <div className="flex items-center gap-3 text-sm text-gray-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
              <InboxIcon className="h-4 w-4 text-gray-100" />
            </div>

            <span>Use the pod selector to get started</span>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
);

export const NoSubmissionsFound = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border bg-gradient-dark">
      <SearchIcon className="h-8 w-8 text-gray-100" />
    </div>

    <h3 className="mb-2 text-lg font-semibold text-white">
      No submissions found
    </h3>

    <p className="max-w-xs text-sm text-gray-200">
      Try adjusting your filters or search terms to find relevant submissions
    </p>
  </div>
);

export const ErrorState = ({ message = "Something went wrong" }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900">
      <AlertCircleIcon className="h-8 w-8 text-danger-600 dark:text-danger-400" />
    </div>

    <h3 className="mb-2 text-lg font-semibold text-danger-600">
      Error Loading Content
    </h3>

    <p className="max-w-xs text-sm text-foreground-400">{message}</p>
  </div>
);
