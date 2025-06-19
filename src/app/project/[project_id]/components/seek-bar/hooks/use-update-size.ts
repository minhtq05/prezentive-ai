import usePlayerStore from "@/store/project/player-store";

export default function useUpdateSize(width: number) {
  const setContainerWidth = usePlayerStore((state) => state.setContainerWidth);

  if (width) {
    setContainerWidth(width);
  }
}
