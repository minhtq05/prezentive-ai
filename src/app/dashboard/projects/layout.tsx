import { Container } from "@/components/container";
import { Separator } from "@/components/ui/separator";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Projects</h1>
      <Separator />
      {children}
    </Container>
  );
}
