import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";

const LoginMarquee = () => {
  const images = [
    {
      image: "/auth/architect-card.png",
      name: "Architect Role Card",
    },

    {
      image: "/auth/initiate-card.png",
      name: "Initiate Role Card",
    },

    {
      image: "/auth/sentinel-card.png",
      name: "Sentinel Role Card",
    },

    {
      image: "/auth/operator-card.png",
      name: "Operator Role Card",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl rounded-3xl bg-gray-950/5 ring-1 ring-neutral-700/10 dark:bg-neutral-800 flex gap-8 rotate-12 -translate-y-40 -translate-x-96 z-20 relative">
      <InfiniteMovingCards items={images} direction="left" />
      <InfiniteMovingCards items={images} direction="right" />
      <InfiniteMovingCards items={images} direction="left" />
      <InfiniteMovingCards items={images} direction="right" />
      <InfiniteMovingCards items={images} direction="left" />
    </div>
  );
};

export default LoginMarquee;
