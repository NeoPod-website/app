// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import React, { useState, useCallback, useMemo } from "react";
// import { BadgeCheckIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
// import { Chip, Select, SelectItem, Input, Button } from "@heroui/react";

// import { setCurrentQuest } from "@/redux/slice/questSlice";

// const AdminSelectCondition = () => {
//   const dispatch = useDispatch();
//   let conditions =
//     useSelector((state) => state.quest.currentQuest.conditions) || [];

//   const [isAdding, setIsAdding] = useState(false);

//   const updateConditions = useCallback(
//     (newConditions) => {
//       dispatch(setCurrentQuest({ conditions: newConditions }));
//     },
//     [dispatch],
//   );

//   const handleAddClick = useCallback(() => setIsAdding(true), []);

//   const handleCancelAdd = useCallback(() => setIsAdding(false), []);

//   const handleConditionTypeSelect = useCallback(
//     (keys) => {
//       const type = Array.from(keys)[0];

//       const conditionTemplates = {
//         level: { type, comparator: ">", value: "" },
//         quest: { type, questId: "", completed: true },
//         nft: { type, contract: "", amount: "1" },
//         discord: { type, role: "" },
//       };

//       updateConditions([...conditions, conditionTemplates[type]]);
//       setIsAdding(false);
//     },
//     [conditions, updateConditions],
//   );

//   const handleConditionChange = useCallback(
//     (index, field, value) => {
//       const updated = conditions.map((condition, i) =>
//         i === index ? { ...condition, [field]: value } : condition,
//       );
//       updateConditions(updated);
//     },
//     [conditions, updateConditions],
//   );

//   const handleNumberInput = useCallback(
//     (index, field, value) => {
//       // Only allow numeric inputs
//       const numericValue = value.replace(/[^0-9]/g, "");
//       handleConditionChange(index, field, numericValue);
//     },
//     [handleConditionChange],
//   );

//   const removeCondition = useCallback(
//     (index) => {
//       const updated = [...conditions];
//       updated.splice(index, 1);
//       updateConditions(updated);
//     },
//     [conditions, updateConditions],
//   );

//   const getConditionLabel = useMemo(
//     () => (type) => {
//       const labels = {
//         level: "Level",
//         quest: "Quest",
//         nft: "NFT",
//         discord: "Discord",
//       };
//       return labels[type] || type.toUpperCase();
//     },
//     [],
//   );

//   const renderConditionFields = useCallback(
//     (condition, index) => {
//       switch (condition.type) {
//         case "level":
//           return (
//             <div className="max-w-48 flex-1 space-y-1.5">
//               <Select
//                 size="sm"
//                 selectedKeys={[condition.comparator]}
//                 aria-label="Quest Condition Comparator"
//                 onSelectionChange={(keys) =>
//                   handleConditionChange(
//                     index,
//                     "comparator",
//                     Array.from(keys)[0],
//                   )
//                 }
//               >
//                 <SelectItem key=">">&gt;</SelectItem>
//                 <SelectItem key=">=">&ge;</SelectItem>
//                 <SelectItem key="<">&lt;</SelectItem>
//                 <SelectItem key="<=">&le;</SelectItem>
//                 <SelectItem key="==">==</SelectItem>
//               </Select>

//               <Input
//                 size="sm"
//                 type="number"
//                 placeholder="Level"
//                 aria-label="Quest Condition Value"
//                 value={condition.value}
//                 onChange={(e) =>
//                   handleNumberInput(index, "value", e.target.value)
//                 }
//               />
//             </div>
//           );
//         case "quest":
//           return (
//             <div className="max-w-48 flex-1 space-y-1.5">
//               <Input
//                 size="sm"
//                 placeholder="Quest ID"
//                 value={condition.questId}
//                 aria-label="Quest Condition Quest ID"
//                 onChange={(e) =>
//                   handleConditionChange(index, "questId", e.target.value)
//                 }
//               />

//               <Select
//                 size="sm"
//                 aria-label="Quest Condition Completed"
//                 selectedKeys={[
//                   condition.completed ? "completed" : "not_completed",
//                 ]}
//                 onSelectionChange={(keys) =>
//                   handleConditionChange(
//                     index,
//                     "completed",
//                     Array.from(keys)[0] === "completed",
//                   )
//                 }
//               >
//                 <SelectItem key="completed">Completed</SelectItem>
//                 <SelectItem key="not_completed">Not Completed</SelectItem>
//               </Select>
//             </div>
//           );
//         case "nft":
//           return (
//             <div className="max-w-48 flex-1 space-y-1.5">
//               <Input
//                 size="sm"
//                 type="text"
//                 value={condition.contract}
//                 placeholder="Contract Address"
//                 aria-label="Quest Condition Contract Address"
//                 onChange={(e) =>
//                   handleConditionChange(index, "contract", e.target.value)
//                 }
//               />

//               <Input
//                 min={1}
//                 size="sm"
//                 type="number"
//                 placeholder="Amount"
//                 aria-label="Quest Condition Amount"
//                 value={condition.amount}
//                 onChange={(e) =>
//                   handleNumberInput(index, "amount", e.target.value)
//                 }
//               />
//             </div>
//           );
//         case "discord":
//           return (
//             <Input
//               required
//               size="sm"
//               type="text"
//               className="w-48"
//               value={condition.role}
//               placeholder="Discord Role"
//               aria-label="Quest Condition Discord Role"
//               onChange={(e) =>
//                 handleConditionChange(index, "role", e.target.value)
//               }
//             />
//           );
//         default:
//           return null;
//       }
//     },
//     [handleConditionChange, handleNumberInput],
//   );

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="flex items-center gap-12">
//         <p className="flex w-32 items-center gap-2 text-gray-100">
//           <BadgeCheckIcon size={20} />
//           Conditions
//         </p>

//         <Button
//           variant="bordered"
//           onPress={handleAddClick}
//           className="h-8 gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-0 text-base text-white hover:bg-gray-700"
//           endContent={<PlusIcon size={16} />}
//         >
//           Add Condition
//         </Button>
//       </div>

//       {isAdding && (
//         <div className="flex w-full items-center gap-2">
//           <Select
//             size="lg"
//             variant="bordered"
//             selectionMode="single"
//             aria-label="Quest Conditions"
//             className="flex-1 rounded bg-gradient-dark"
//             onSelectionChange={handleConditionTypeSelect}
//             classNames={{
//               base: "h-10",
//               trigger:
//                 "border border-gray-400 focus-within:!border-gray-300 h-10 min-h-[40px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
//               value: "text-base",
//             }}
//           >
//             <SelectItem key="level">Level</SelectItem>
//             <SelectItem key="quest">Quest Completed</SelectItem>
//             <SelectItem key="nft">NFT Ownership</SelectItem>
//             <SelectItem key="discord">Discord Role</SelectItem>
//           </Select>

//           <Button
//             isIconOnly
//             onPress={handleCancelAdd}
//             variant="light"
//             className="h-10 w-10 min-w-[40px] text-gray-400 hover:bg-gray-700 hover:text-white"
//           >
//             <XIcon size={16} />
//           </Button>
//         </div>
//       )}

//       <div className="flex flex-col gap-3">
//         {conditions.map((condition, index) => (
//           <div
//             key={index}
//             className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-1.5"
//           >
//             <div className="w-20 pt-1">
//               <Chip className="border border-gray-400 bg-gray-700 px-2 py-1 text-sm capitalize text-white">
//                 {getConditionLabel(condition.type)}
//               </Chip>
//             </div>

//             {renderConditionFields(condition, index)}

//             <Button
//               isIconOnly
//               onPress={() => removeCondition(index)}
//               className="bg-transparent text-red-700 hover:bg-red-400/10 hover:text-red-500"
//             >
//               <TrashIcon size={16} />
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminSelectCondition;

"use client";

import { useDispatch, useSelector } from "react-redux";
import React, { useState, useCallback, useMemo } from "react";
import { Chip, Select, SelectItem, Input, Button } from "@heroui/react";
import { BadgeCheckIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminSelectCondition = () => {
  const dispatch = useDispatch();
  let conditions =
    useSelector((state) => state.quest.currentQuest.conditions) || [];

  const [isAdding, setIsAdding] = useState(false);

  const updateConditions = useCallback(
    (newConditions) => {
      dispatch(setCurrentQuest({ conditions: newConditions }));
    },
    [dispatch],
  );

  const handleAddClick = useCallback(() => setIsAdding(true), []);

  const handleCancelAdd = useCallback(() => setIsAdding(false), []);

  const handleConditionTypeSelect = useCallback(
    (keys) => {
      const type = Array.from(keys)[0];

      const conditionTemplates = {
        quest: { type, questId: "", completed: true },
        // nft: { type, contract: "", amount: "1" },
        ambassador: { type, role: "" },
      };

      updateConditions([...conditions, conditionTemplates[type]]);
      setIsAdding(false);
    },
    [conditions, updateConditions],
  );

  const handleConditionChange = useCallback(
    (index, field, value) => {
      const updated = conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition,
      );
      updateConditions(updated);
    },
    [conditions, updateConditions],
  );

  const handleNumberInput = useCallback(
    (index, field, value) => {
      // Only allow numeric inputs
      const numericValue = value.replace(/[^0-9]/g, "");
      handleConditionChange(index, field, numericValue);
    },
    [handleConditionChange],
  );

  const removeCondition = useCallback(
    (index) => {
      const updated = [...conditions];
      updated.splice(index, 1);
      updateConditions(updated);
    },
    [conditions, updateConditions],
  );

  const getConditionLabel = useMemo(
    () => (type) => {
      const labels = {
        quest: "Quest",
        // nft: "NFT",
        ambassador: "Role",
      };
      return labels[type] || type.toUpperCase();
    },
    [],
  );

  const renderConditionFields = useCallback(
    (condition, index) => {
      switch (condition.type) {
        case "quest":
          return (
            <div className="max-w-48 flex-1 space-y-1.5">
              <Input
                size="sm"
                placeholder="Quest ID"
                value={condition.questId}
                aria-label="Quest Condition Quest ID"
                onChange={(e) =>
                  handleConditionChange(index, "questId", e.target.value)
                }
              />

              <Select
                size="sm"
                aria-label="Quest Condition Completed"
                selectedKeys={[
                  condition.completed ? "completed" : "not_completed",
                ]}
                onSelectionChange={(keys) =>
                  handleConditionChange(
                    index,
                    "completed",
                    Array.from(keys)[0] === "completed",
                  )
                }
              >
                <SelectItem key="completed">Completed</SelectItem>
                <SelectItem key="not_completed">Not Completed</SelectItem>
              </Select>
            </div>
          );
        // case "nft":
        //   return (
        //     <div className="max-w-48 flex-1 space-y-1.5">
        //       <Input
        //         size="sm"
        //         type="text"
        //         value={condition.contract}
        //         placeholder="Contract Address"
        //         aria-label="Quest Condition Contract Address"
        //         onChange={(e) =>
        //           handleConditionChange(index, "contract", e.target.value)
        //         }
        //       />

        //       <Input
        //         min={1}
        //         size="sm"
        //         type="number"
        //         placeholder="Amount"
        //         aria-label="Quest Condition Amount"
        //         value={condition.amount}
        //         onChange={(e) =>
        //           handleNumberInput(index, "amount", e.target.value)
        //         }
        //       />
        //     </div>
        //   );
        case "ambassador":
          return (
            <div className="max-w-48 flex-1">
              <Select
                size="sm"
                aria-label="Ambassador Role"
                selectedKeys={condition.role ? [condition.role] : []}
                onSelectionChange={(keys) =>
                  handleConditionChange(
                    index,
                    "role",
                    Array.from(keys)[0] || "",
                  )
                }
              >
                <SelectItem key="initiate">Initiate</SelectItem>
                <SelectItem key="operator">Operator</SelectItem>
                <SelectItem key="sentinel">Sentinel</SelectItem>
                <SelectItem key="architect">Architect</SelectItem>
              </Select>
            </div>
          );
        default:
          return null;
      }
    },
    [handleConditionChange, handleNumberInput],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-12">
        <p className="flex w-32 items-center gap-2 text-gray-100">
          <BadgeCheckIcon size={20} />
          Conditions
        </p>

        <Button
          variant="bordered"
          onPress={handleAddClick}
          className="h-8 gap-2 rounded border border-gray-400 bg-gradient-dark px-3 py-0 text-base text-white hover:bg-gray-700"
          endContent={<PlusIcon size={16} />}
        >
          Add Condition
        </Button>
      </div>

      {isAdding && (
        <div className="flex w-full items-center gap-2">
          <Select
            size="lg"
            variant="bordered"
            selectionMode="single"
            aria-label="Quest Conditions"
            className="flex-1 rounded bg-gradient-dark"
            onSelectionChange={handleConditionTypeSelect}
            classNames={{
              base: "h-10",
              trigger:
                "border border-gray-400 focus-within:!border-gray-300 h-10 min-h-[40px] focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black rounded",
              value: "text-base",
            }}
          >
            <SelectItem key="quest">Quest Completed</SelectItem>
            {/* <SelectItem key="nft">NFT Ownership</SelectItem> */}
            <SelectItem key="ambassador">Ambassador Role</SelectItem>
          </Select>

          <Button
            isIconOnly
            onPress={handleCancelAdd}
            variant="light"
            className="h-10 w-10 min-w-[40px] text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <XIcon size={16} />
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {conditions.map((condition, index) => (
          <div
            key={index}
            className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border-t border-gray-400 bg-gradient-dark px-4 py-1.5"
          >
            <div className="w-20 pt-1">
              <Chip className="border border-gray-400 bg-gray-700 px-2 py-1 text-sm capitalize text-white">
                {getConditionLabel(condition.type)}
              </Chip>
            </div>

            {renderConditionFields(condition, index)}

            <Button
              isIconOnly
              onPress={() => removeCondition(index)}
              className="bg-transparent text-red-700 hover:bg-red-400/10 hover:text-red-500"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSelectCondition;
