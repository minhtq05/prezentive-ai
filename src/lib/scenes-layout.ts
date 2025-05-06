import { Scene, SceneMedia, SceneText } from "@/types/scenes";
import { v4 as uuidv4 } from "uuid";

// Default font sizes
const FONT_SIZES = {
  title: 128,
  heading: 60,
  paragraph: 30,
  subtitle: 48,
};

// Base template for creating scenes
const createBaseScene = (title: string): Scene => ({
  id: uuidv4(),
  durationInFrames: 750, // 5 seconds at 30fps
  title,
  selected: false,
  components: [],
});

// Helper to create text components
const createSceneText = (
  text: string,
  fontSize: number,
  from: number,
  to: number,
  top: number,
  left: number,
  width: number,
  height: number,
  textAlign: "left" | "center" | "right" = "center",
  textAlignVertical: "top" | "center" | "bottom" = "center"
): SceneText => ({
  id: uuidv4(),
  type: "scene-text",
  text,
  fontSize,
  from,
  to,
  top, // y position
  left, // x position
  width,
  height,
  // fontFamily: "Inter, sans-serif",
  fontFamily: "serif",
  color: { r: 0, g: 0, b: 0, a: 1 }, // black
  backgroundColor: { r: 255, g: 255, b: 255, a: 0 }, // transparent
  textAlign,
  textAlignVertical,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  textTransform: "none",
  animations: ["zoom-in", "scale-out"],
});

// Helper to create media components
const createSceneMedia = (
  src: string,
  mediaType: "image" | "video" | "audio",
  from: number,
  to: number,
  top: number,
  left: number,
  width: number,
  height: number,
  alt: string = "",
  fit: "cover" | "contain" | "fill" = "contain"
): SceneMedia => ({
  id: uuidv4(),
  type: "scene-media",
  mediaType,
  src,
  alt,
  fit,
  from,
  to,
  top, // y position
  left, // x position
  width,
  height,
  animations: ["zoom-in", "scale-out"],
});

// 1. Title Layout - Title and Subtitle
export const createTitleLayout = (
  titleText: string = "Presentation Title",
  subtitleText: string = "Presentation Subtitle"
): Scene => {
  const scene = createBaseScene("Title Slide");

  // Title centered at the top third of the slide
  const titleComponent = createSceneText(
    titleText,
    FONT_SIZES.title,
    0,
    0,
    300, // y position - top third
    320, // x position - centered (1920/2 - width/2)
    1280, // width
    200, // height
    "center"
  );

  // Subtitle centered below the title
  const subtitleComponent = createSceneText(
    subtitleText,
    FONT_SIZES.subtitle,
    0,
    0,
    540, // y position - below title
    320, // x position - centered
    1280, // width
    100, // height
    "center"
  );

  scene.components.push(titleComponent, subtitleComponent);
  return scene;
};

// 2. Title and Content Layout - Heading and Paragraph
export const createTitleAndContentLayout = (
  headingText: string = "Slide Heading",
  paragraphText: string = "This is the content of the slide. You can add detailed information here."
): Scene => {
  const scene = createBaseScene("Title and Content");

  // Heading at the top
  const headingComponent = createSceneText(
    headingText,
    FONT_SIZES.heading,
    0,
    0,
    150, // y position - top of slide
    320, // x position - centered
    1280, // width
    100, // height
    "center"
  );

  // Paragraph below the heading
  const paragraphComponent = createSceneText(
    paragraphText,
    FONT_SIZES.paragraph,
    0,
    0,
    300, // y position - below heading
    320, // x position
    1280, // width - wider for content
    600, // height - taller for content
    "left",
    "top"
  );

  scene.components.push(headingComponent, paragraphComponent);
  return scene;
};

// 3. Section Title Layout - Title and Subtitle (with different positioning)
export const createSectionTitleLayout = (
  titleText: string = "Section Title",
  subtitleText: string = "Section Description"
): Scene => {
  const scene = createBaseScene("Section Title");

  // Title centered in the middle of the slide
  const titleComponent = createSceneText(
    titleText,
    FONT_SIZES.title,
    0,
    0,
    400, // y position - middle of slide
    320, // x position - centered
    1280, // width
    200, // height
    "left"
  );

  // Subtitle centered below the title
  const subtitleComponent = createSceneText(
    subtitleText,
    FONT_SIZES.subtitle,
    0,
    0,
    620, // y position - below title
    320, // x position - centered
    1280, // width
    100, // height
    "left"
  );

  scene.components.push(titleComponent, subtitleComponent);
  return scene;
};

// 4. Title and Two Images Layout - Heading with left and right images
export const createTitleAndTwoImagesLayout = (
  headingText: string = "Compare and Contrast",
  leftImageSrc: string = "https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/openai-new-logo_f252fc.png?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=2400", // OpenAI Logo
  rightImageSrc: string = "https://9meters.com/wp-content/uploads/claude-logo.webp" // Claude Logo
): Scene => {
  const scene = createBaseScene("Title and Two Images");

  // Heading at the top
  const headingComponent = createSceneText(
    headingText,
    FONT_SIZES.heading,
    0,
    0,
    120, // y position - top of slide
    320, // x position - centered
    1280, // width
    100, // height
    "center"
  );

  // Left image
  const leftImageComponent = createSceneMedia(
    leftImageSrc,
    "image",
    0,
    0,
    300, // y position - below heading
    240, // x position - left side
    600, // width
    450, // height
    "Left side image", // alt text
    "contain" // fit
  );

  // Right image
  const rightImageComponent = createSceneMedia(
    rightImageSrc,
    "image",
    0,
    0,
    300, // y position - below heading
    1080, // x position - right side
    600, // width
    450, // height
    "Right side image", // alt text
    "contain" // fit
  );

  scene.components.push(
    headingComponent,
    leftImageComponent,
    rightImageComponent
  );
  return scene;
};

// 5. Title and Video Layout - Heading with a featured video
export const createTitleAndVideoLayout = (
  headingText: string = "Video Presentation",
  // videoSrc: string = "https://files.vidstack.io/sprite-fight/720p.mp4" // Sample video
  videoSrc: string = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Sample video
): Scene => {
  const scene = createBaseScene("Title and Video");

  // Heading at the top
  const headingComponent = createSceneText(
    headingText,
    FONT_SIZES.heading,
    0,
    0,
    100, // y position - top of slide
    320, // x position - centered
    1280, // width
    100, // height
    "center"
  );

  // Video component centered below the heading
  const videoComponent = createSceneMedia(
    videoSrc,
    "video",
    0,
    0,
    240, // y position - below heading
    320, // x position - centered
    1280, // width
    600, // height
    "Featured video", // alt text
    "contain" // fit
  );

  scene.components.push(headingComponent, videoComponent);
  return scene;
};

// Export a collection of all available layouts
export const sceneLayouts = {
  title: createTitleLayout,
  titleAndContent: createTitleAndContentLayout,
  sectionTitle: createSectionTitleLayout,
  titleAndTwoImages: createTitleAndTwoImagesLayout,
  titleAndVideo: createTitleAndVideoLayout,
};

export default sceneLayouts;
