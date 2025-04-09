"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import ScenesList from "@/components/scenes-list";
import RemotionPreview from "@/components/remotion-preview";
import useScenesStore from "@/store/scenes-store";

export default function Home() {
  const { scenes, selectedSceneId } = useScenesStore();
  const selectedScene = scenes.find((scene) => scene.selected);

  return (
    <Flex w="100%" h="100vh">
      <ScenesList />

      <Box flex="1" display="flex" flexDirection="column">
        <Box
          aspectRatio={16 / 9}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <RemotionPreview />
        </Box>
      </Box>

      <Box width="500px" p={4}>
        <Heading size="md" mb={4}>
          AI Assistant
        </Heading>
        <Text color="gray.500">Chat interface will be implemented here</Text>
      </Box>
    </Flex>
  );
}
