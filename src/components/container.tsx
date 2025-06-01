export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 w-full p-4">{children}</div>;
};
