import React, { useState } from "react";
import { ChakraProvider, Box, VStack, HStack, Input, Button, Text, IconButton, useToast, Heading, Checkbox } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem("lists");
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedListIndex, setSelectedListIndex] = useState(() => {
    const savedIndex = localStorage.getItem("selectedListIndex");
    return savedIndex ? JSON.parse(savedIndex) : null;
  });
  const toast = useToast();

  const handleListAdd = () => {
    if (newListTitle) {
      const updatedLists = [...lists, { title: newListTitle, items: [] }];
      setLists(updatedLists);
      localStorage.setItem("lists", JSON.stringify(updatedLists));
      localStorage.setItem("selectedListIndex", JSON.stringify(updatedLists.length - 1));
      setSelectedListIndex(updatedLists.length - 1);
      setNewListTitle("");
    } else {
      toast({
        title: "Error",
        description: "List title can't be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleItemAdd = (index) => {
    const itemName = prompt("Enter item name");
    if (itemName) {
      const newLists = [...lists];
      newLists[index].items.push({ name: itemName, isCompleted: false });
      setLists(newLists);
      localStorage.setItem("lists", JSON.stringify(newLists));
    }
  };

  const handleItemCheck = (listIndex, itemIndex) => {
    const newLists = [...lists];
    newLists[listIndex].items[itemIndex].isCompleted = !newLists[listIndex].items[itemIndex].isCompleted;
    setLists(newLists);
    localStorage.setItem("lists", JSON.stringify(newLists));
  };

  const handleListDelete = (index) => {
    const newLists = lists.filter((_, i) => i !== index);
    setLists(newLists);
    localStorage.setItem("lists", JSON.stringify(newLists));
    if (index === selectedListIndex) {
      localStorage.removeItem("selectedListIndex");
      setSelectedListIndex(null);
    }
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <Heading>Todo App</Heading>
          <HStack>
            <Input placeholder="New list title" value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} />
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleListAdd}>
              Add List
            </Button>
          </HStack>
          <HStack spacing={4}>
            <VStack align="stretch">
              {lists.map((list, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setSelectedListIndex(index);
                    localStorage.setItem("selectedListIndex", JSON.stringify(index));
                  }}
                  variant={selectedListIndex === index ? "solid" : "outline"}
                >
                  {list.title}
                </Button>
              ))}
            </VStack>
            {selectedListIndex !== null && (
              <VStack align="stretch" flexGrow={1}>
                <HStack justifyContent="space-between">
                  <Heading size="md">{lists[selectedListIndex].title}</Heading>
                  <IconButton icon={<FaTrash />} aria-label="Delete list" onClick={() => handleListDelete(selectedListIndex)} />
                </HStack>
                {lists[selectedListIndex].items.map((item, index) => (
                  <HStack key={index}>
                    <Checkbox isChecked={item.isCompleted} onChange={() => handleItemCheck(selectedListIndex, index)}>
                      <Text as={item.isCompleted ? "del" : undefined}>{item.name}</Text>
                    </Checkbox>
                  </HStack>
                ))}
                <Button leftIcon={<FaPlus />} onClick={() => handleItemAdd(selectedListIndex)}>
                  Add Item
                </Button>
              </VStack>
            )}
          </HStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
