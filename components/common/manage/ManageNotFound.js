import Link from "next/link";

const ManageNotFound = ({
  title,
  description,
  backToHref,
  backToLabel,
  createHref,
  createLabel,
}) => {
  return (
    <div className="mt-6 flex h-full flex-col items-center justify-center rounded-xl border border-gray-700 bg-black/60 p-8">
      <h2 className="mb-4 text-2xl font-semibold text-white">{title}</h2>

      <p className="mb-6 max-w-md text-center text-gray-300">{description}</p>

      <div className="flex gap-4">
        {backToHref && backToLabel && (
          <Link
            href={backToHref}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
          >
            Back to {backToLabel}
          </Link>
        )}

        {createHref && createLabel && (
          <Link
            href={createHref}
            className="rounded-full border border-white bg-gradient-primary px-6 py-2 text-white hover:border-gray-600"
          >
            {createLabel}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ManageNotFound;
