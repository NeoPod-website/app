import { useMemo } from "react";
import { useClient } from "wagmi";
import { providers } from "ethers";

export function clientToProvider(client) {
  const { chain, transport } = client;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      transport.transports.map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );

  return new providers.JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({ chainId } = {}) {
  const client = useClient < Config > { chainId };

  return useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client],
  );
}
