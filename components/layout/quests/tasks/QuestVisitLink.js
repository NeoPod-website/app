"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@heroui/react";
import { SquareArrowOutUpRightIcon } from "lucide-react";

import QuestTask from "./QuestTask";

// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const url = searchParams.get('url');

//   if (!url) {
//     return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
//   }

//   try {
//     const res = await fetch(url);
//     const html = await res.text();

//     const title = html.match(/<title>(.*?)<\/title>/)?.[1] || 'No title';
//     const ogTitle = html.match(/property="og:title" content="(.*?)"/)?.[1];
//     const ogDescription = html.match(/property="og:description" content="(.*?)"/)?.[1];
//     const ogImage = html.match(/property="og:image" content="(.*?)"/)?.[1];

//     return NextResponse.json({
//       title: ogTitle || title,
//       description: ogDescription || '',
//       image: ogImage || '',
//     });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
//   }
// }

// "use client";

// import React, { useEffect, useState } from "react";

// const VisitLink = ({ url }) => {
//   const [metadata, setMetadata] = useState(null);

//   useEffect(() => {
//     const fetchMetadata = async () => {
//       try {
//         const res = await fetch(`/api/fetch-link-preview?url=${encodeURIComponent(url)}`);
//         const data = await res.json();
//         setMetadata(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchMetadata();
//   }, [url]);

//   if (!metadata) return <p>Loading preview...</p>;

//   return (
//     <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-md rounded-lg border bg-gradient-dark p-4 hover:shadow-lg">
//       <img src={metadata.image} alt="" className="mb-2 h-40 w-full object-cover rounded-md" />
//       <h3 className="text-lg font-bold text-gray-100">{metadata.title}</h3>
//       <p className="text-sm text-gray-400">{metadata.description}</p>
//     </a>
//   );
// };

// export default VisitLink;

const QuestVisitLink = ({ url = "https://x.com/noober_boy" }) => {
  return (
    <QuestTask
      color="#0369a1"
      text="Visit Link"
      heading="Visit Link"
      description="Click "
      icon={<SquareArrowOutUpRightIcon size={12} className="text-white" />}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Input
          type="url"
          size="lg"
          variant="bordered"
          placeholder="Visit Link"
          readOnly
          value={url}
          className="!cursor-pointer bg-dark"
          classNames={{
            base: "!cursor-pointer",
            inputWrapper:
              "border-gray-300 focus-within:!border-gray-300 rounded-xl focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black px-4 py-2.5 !cursor-pointer",
            input: "!cursor-pointer",
          }}
        />
      </Link>
    </QuestTask>
  );
};

export default QuestVisitLink;
