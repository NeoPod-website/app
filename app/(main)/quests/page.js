import Link from "next/link";

import { auth0 } from "@/lib/auth0";
import Image from "next/image";
import { ClockIcon, ImageIcon } from "lucide-react";

export const metadata = {
  title: "Quests | NEO POD",
  description:
    "Discover and participate in quests designed to boost your engagement and growth within the Neo Pod community. Earn rewards and unlock achievements.",
};

const QuestsPage = async () => {
  const session = await auth0.getSession();

  return (
    <>
      <section className="rounded-2.5xl bg-black/50">
        <div className="rounded-2.5xl relative h-40 w-full overflow-hidden p-5">
          <div className="absolute inset-0 z-10 bg-[url('/dashboard/category/background-2.jpg')] bg-cover bg-center opacity-80"></div>

          <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 font-work-sans text-2xl font-bold">
            <Image
              src="/dashboard/category/icon-1.png"
              alt="Quests"
              width={38}
              height={32}
            />
            <h3>Hot Campaigns</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2.5xl flex items-center justify-between gap-12 border-t border-gray-400 bg-gradient-dark p-5">
            <div className="flex-1 space-y-3">
              <div className="flex w-fit items-center gap-0.5 rounded-full bg-gray-600 px-1.5 py-0.5">
                <ClockIcon size={12} className="text-gray-200" />
                <p className="text-xs font-medium text-gray-200">Monthly</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  Partners and Community Mixer
                </h4>

                <p className="text-xs text-white">
                  Ends in:{" "}
                  <span className="font-medium text-yellow-200">
                    2 days 23 hours
                  </span>
                </p>
              </div>

              <div>
                <div className="flex w-fit items-center gap-0.5 rounded bg-green-400/50 px-1 py-0.5">
                  <ImageIcon size={16} className="text-green-400" />
                  <p className="text-xs font-medium text-green-400">
                    + 1 Prestige NFT
                  </p>
                </div>
              </div>
            </div>

            <div className="h-20 w-20 bg-[url('/dashboard/quest/points-background.png')] bg-cover bg-center px-2 py-2">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-400 bg-black/70 text-center text-white">
                <p className="text-2xl font-bold">100</p>
                <span className="block text-sm">PODS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestsPage;
