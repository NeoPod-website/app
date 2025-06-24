// "use client";

// import React from "react";
// import { ShieldCheckIcon } from "lucide-react";
// import { Card, CardBody } from "@heroui/react";

// import WalletInfoHeader from "./info/WalletInfoHeader";
// import WalletAddressCard from "./info/WalletAddressCard";
// import WalletNetworkBalances from "./info/WalletNetworkBalances";
// import RemoveAmbassadorWalletModal from "@/components/ui/modals/RemoveAmbassadorWalletModal";

// const WalletConnectedState = ({
//   address,
//   onDisconnect,
//   verificationState,
//   isUsingAmbassadorAddress = false,
// }) => {
//   const handleDisconnectConfirm = () => {
//     onDisconnect();
//   };

//   return (
//     <>
//       <RemoveAmbassadorWalletModal
//         handleDisconnectConfirm={handleDisconnectConfirm}
//         isUsingAmbassadorAddress={isUsingAmbassadorAddress}
//       />

//       <div className="space-y-8">
//         <WalletInfoHeader
//           verificationState={verificationState}
//           isUsingAmbassadorAddress={isUsingAmbassadorAddress}
//         />

//         <WalletAddressCard
//           address={address}
//           isUsingAmbassadorAddress={isUsingAmbassadorAddress}
//         />

//         <WalletNetworkBalances address={address} />

//         {isUsingAmbassadorAddress && (
//           <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
//             <CardBody className="p-6">
//               <div className="flex items-start gap-3">
//                 <ShieldCheckIcon size={20} className="mt-0.5 text-blue-400" />

//                 <div>
//                   <h4 className="mb-2 font-medium text-blue-400">
//                     Ambassador Account
//                   </h4>

//                   <div className="space-y-1 text-sm text-gray-300">
//                     <p>• This wallet is managed by your ambassador account</p>
//                     <p>
//                       • Balance and transaction data is fetched from our servers
//                     </p>
//                     <p>
//                       • You can disconnect this wallet from your account
//                       settings
//                     </p>
//                     <p>
//                       • To perform transactions, you'll need to connect your
//                       personal wallet
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         )}
//       </div>
//     </>
//   );
// };

// export default WalletConnectedState;

"use client";

import { ShieldCheckIcon } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import React, { useCallback, useMemo } from "react";

import WalletInfoHeader from "./info/WalletInfoHeader";
import WalletAddressCard from "./info/WalletAddressCard";
import WalletNetworkBalances from "./info/WalletNetworkBalances";

import RemoveAmbassadorWalletModal from "@/components/ui/modals/RemoveAmbassadorWalletModal";

const WalletConnectedState = ({
  address,
  onDisconnect,
  verificationState,
  isUsingAmbassadorAddress = false,
}) => {
  const handleDisconnectConfirm = useCallback(() => {
    onDisconnect();
  }, [onDisconnect]);

  // Memoize ambassador info content
  const ambassadorInfo = useMemo(() => {
    if (!isUsingAmbassadorAddress) return null;

    return (
      <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon size={20} className="mt-0.5 text-blue-400" />

            <div>
              <h4 className="mb-2 font-medium text-blue-400">
                Ambassador Account
              </h4>

              <div className="space-y-1 text-sm text-gray-300">
                <p>• This wallet is managed by your ambassador account</p>
                <p>
                  • Balance and transaction data is fetched from our servers
                </p>
                <p>
                  • You can disconnect this wallet from your account settings
                </p>
                <p>
                  • To perform transactions, you'll need to connect your
                  personal wallet
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }, [isUsingAmbassadorAddress]);

  return (
    <>
      <RemoveAmbassadorWalletModal
        handleDisconnectConfirm={handleDisconnectConfirm}
        isUsingAmbassadorAddress={isUsingAmbassadorAddress}
      />

      <div className="space-y-8">
        <WalletInfoHeader
          verificationState={verificationState}
          isUsingAmbassadorAddress={isUsingAmbassadorAddress}
        />

        <WalletAddressCard
          address={address}
          isUsingAmbassadorAddress={isUsingAmbassadorAddress}
        />

        <WalletNetworkBalances address={address} />

        {ambassadorInfo}
      </div>
    </>
  );
};

export default React.memo(WalletConnectedState);
