import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsCard({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="py-4 md:py-6">
      <CardHeader className="px-4 md:px-6">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">{children}</CardContent>
    </Card>
  );
}
