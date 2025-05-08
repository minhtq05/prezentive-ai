import {
  createSectionTitleLayout,
  createTitleAndContentLayout,
  createTitleAndTwoImagesLayout,
  createTitleAndVideoLayout,
  createTitleLayout,
} from "./lib/scenes-layout";

export const defaultScenes = [
  createTitleLayout(),
  createTitleAndContentLayout(),
  createSectionTitleLayout(),
  createTitleAndTwoImagesLayout(),
  createTitleAndVideoLayout(),
];
