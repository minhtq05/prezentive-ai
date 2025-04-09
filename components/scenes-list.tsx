"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Button,
  RadioCard,
  Drawer,
  Portal,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import useScenesStore from "@/store/scenes-store";

export default function ScenesList() {
  const { scenes, addScene, deleteScene, selectScene, selectedSceneId } =
    useScenesStore();

  return (
    <Box width={300} height="100%">
      <VStack align="stretch" p="4">
        <Heading size="md">Scenes</Heading>

        <RadioCard.Root>
          <RadioCard.Item
            key="all"
            value="all"
            p="4"
            cursor="pointer"
            onChange={(e) => {
              e.stopPropagation();
              selectScene(null);
            }}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>All</RadioCard.ItemText>
            </RadioCard.ItemControl>
          </RadioCard.Item>
          {scenes.map((scene) => (
            <Box key={scene.id}>
              <RadioCard.Item
                key={scene.id}
                value={scene.id}
                onChange={(e) => {
                  e.stopPropagation();
                  selectScene(scene.id);
                }}
                p="4"
                cursor="pointer"
              >
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{scene.title}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            </Box>
          ))}

          <NewSceneButton />
        </RadioCard.Root>
      </VStack>
    </Box>
  );
}

interface Template {
  id: string;
  title: string;
  content: string;
}

// drawer for choosing scene template
function NewSceneButton() {
  const { addScene } = useScenesStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const templates: Template[] = [
    { id: "template-1", title: "Template 1", content: "" },
    { id: "template-2", title: "Template 2", content: "" },
    { id: "template-3", title: "Template 3", content: "" },
  ];

  return (
    <Drawer.Root key="xl" size="xl">
      <Drawer.Trigger asChild>
        <Button colorScheme="blue" size="sm">
          <FiPlus /> Add New Scene
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p="4">
            <Drawer.Header>
              <Drawer.Title>Choose Scene Template</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>Choose a template for your scene</Text>
              <VStack mt={4}>
                {templates.map((template) => (
                  <RadioCard.Item
                    key={template.id}
                    value={template.id}
                    onChange={() => setSelectedTemplate(template)}
                    p="4"
                    cursor="pointer"
                  >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <RadioCard.ItemText>{template.title}</RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </VStack>
              <Button
                onClick={() => {
                  if (selectedTemplate) {
                    addScene(selectedTemplate.title);
                    setSelectedTemplate(null);
                  }
                }}
              >
                Create Scene
              </Button>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Drawer.ActionTrigger>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
