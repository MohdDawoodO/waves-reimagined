"use client";

import { Card, CardDescription, CardHeader } from "../ui/card";
import { formatDistance } from "date-fns";

export default function TrackDescription({
  uploadedOn,
  description,
}: {
  uploadedOn: Date;
  description: string;
}) {
  const timeDistance = formatDistance(uploadedOn, new Date());
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-4">
        <CardDescription className="flex items-center justify-between text-xs text-foreground\">
          <p>Views: 1024</p>
          <p>{timeDistance.replace("about", "")} ago</p>
        </CardDescription>
        <h2 className="text-sm text-muted-foreground">
          {description ? (
            description
          ) : (
            <i className="font-light">
              No description was added for this track
            </i>
          )}
        </h2>
      </CardHeader>
    </Card>
  );
}
