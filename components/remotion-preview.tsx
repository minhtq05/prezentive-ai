"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Player } from "@remotion/player";
import { useMemo } from "react";
import useScenesStore, { Scene } from "@/store/scenes-store";
import { AbsoluteFill, Series } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

// This will be your Remotion composition component
const MyComp = ({ scenes }: { scenes: Scene[] }) => {
  return (
    <Series>
      {scenes.map((scene) => (
        <Series.Sequence key={scene.id} durationInFrames={150}>
          <AbsoluteFill
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>{scene.title}</h1>
            <p>{scene.content}</p>
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  );
};

// const RemotionDemo = () => {
//   return (
//     <TransitionSeries>
//       <TransitionSeries.Sequence durationInFrames={60}>
//         <AbsoluteFill style={{ backgroundColor: "lightblue" }}>
//           <Flex w="full" h="full" align="center" justify="center">
//             <Heading size="7xl">A</Heading>
//           </Flex>
//         </AbsoluteFill>
//       </TransitionSeries.Sequence>
//       <TransitionSeries.Transition
//         timing={springTiming({ config: { damping: 200 } })}
//         presentation={fade()}
//       />
//       <TransitionSeries.Sequence durationInFrames={60}>
//         <AbsoluteFill style={{ backgroundColor: "black" }}>
//           <Flex w="full" h="full" align="center" justify="center">
//             <Heading size="7xl">A</Heading>
//           </Flex>
//         </AbsoluteFill>
//       </TransitionSeries.Sequence>
//       <TransitionSeries.Transition
//         timing={springTiming({ config: { damping: 200 } })}
//         presentation={wipe()}
//       />
//       <TransitionSeries.Sequence durationInFrames={60}>
//         <AbsoluteFill style={{ backgroundColor: "pink" }}>
//           <Flex w="full" h="full" align="center" justify="center">
//             <Heading size="7xl">A</Heading>
//           </Flex>
//         </AbsoluteFill>
//       </TransitionSeries.Sequence>
//     </TransitionSeries>
//   );
// };

export default function RemotionPreview() {
  const { scenes, selectedSceneId } = useScenesStore();
  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.selected),
    [scenes]
  );
  const totalDuration = useMemo(
    () => scenes.reduce((acc, scene) => acc + 150, 0),
    [scenes]
  );

  return (
    <Box width="100%" height="100%">
      <Player
        component={MyComp}
        durationInFrames={selectedScene ? 150 : totalDuration}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        controls
        inputProps={{
          scenes: selectedScene ? [selectedScene] : scenes,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}
