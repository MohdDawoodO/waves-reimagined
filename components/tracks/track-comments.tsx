"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TrackComments() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-4">
        <CardTitle className="text-muted-foreground">Comments: 24</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        ... First comment, rest will be in drawer for mobile
      </CardContent>
    </Card>
  );
}
