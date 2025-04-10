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
    <div
      className="relative z-20 mx-auto flex max-w-7xl gap-8 rounded-3xl"
      style={{
        transform: "rotate(12deg) translate(-580px, -80px)",
      }}
    >
      <InfiniteMovingCards items={images} direction="left" />
      <InfiniteMovingCards items={images} direction="right" />
      <InfiniteMovingCards items={images} direction="left" />
      <InfiniteMovingCards items={images} direction="right" />
      <InfiniteMovingCards items={images} direction="left" />
    </div>
  );
};

export default LoginMarquee;
