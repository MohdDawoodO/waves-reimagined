import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsCard({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
