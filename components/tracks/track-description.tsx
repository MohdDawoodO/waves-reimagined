"use client";

import { Card, CardDescription, CardHeader } from "../ui/card";
import { formatDistance } from "date-fns";

export default function TrackDescription({
  uploadedOn,
  description,
  views,
}: {
  uploadedOn: Date;
  description: string;
  views: number;
}) {
  const timeDistance = formatDistance(uploadedOn, new Date());

  const formatViews = () => {
    if (!views) {
      return 0;
    }

    let formattedViews = "";
    const digits = views.toString().split("");
    digits.map((digit, i) => {
      const reverseDigit = digits.length - i;

      switch (true) {
        case reverseDigit % 3 === 0 && reverseDigit !== digits.length:
          formattedViews = formattedViews + "," + digit;
          break;

        default:
          formattedViews = formattedViews + digit;
      }
    });

    return formattedViews;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-4">
        <CardDescription className="flex items-center justify-between text-xs text-foreground\">
          <p>Views: {formatViews()}</p>
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
