"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export default function Tags({
  onChange,
  value,
}: {
  onChange: Dispatch<SetStateAction<Array<string>>>;
  value: Array<string> | undefined;
}) {
  const [tags, setTags] = useState<Array<string>>(value ?? []);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string) {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (value.length < 3) return;
    const newTags = new Set(tags);
    newTags.add(value);
    setTags(Array.from(newTags));
    onChange(Array.from(newTags));
  }

  function removeTag(tag?: string) {
    if (tag) {
      const newTags = tags.filter((selectedTag) => selectedTag !== tag);
      setTags(newTags);
      onChange(newTags);
      return;
    }

    const newTags = tags.slice(0, tags.length - 1);
    setTags(newTags);
    onChange(newTags);
  }

  return (
    <div
      className={cn(
        "dark:bg-input/30 border-input flex min-h-9 h-fit w-full min-w-0 rounded-md border bg-transparent px-3 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none",
        focused ? "border-ring ring-ring/50 ring-[3px]" : null
      )}
      onClick={() => {
        setFocused(true);
        inputRef.current?.focus();
      }}
      onBlur={() => setFocused(false)}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {tags?.map((tag) => (
          <div key={tag}>
            <Badge>{tag}</Badge>
            <Button
              size={"icon"}
              variant={"secondary"}
              type="button"
              className="h-4 w-4"
              onClick={() => removeTag(tag)}
            >
              <XIcon className="scale-80" />
            </Button>
          </div>
        ))}

        <input
          ref={inputRef}
          className="outline-none w-20"
          placeholder="Add tags..."
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(e.currentTarget.value);
            }
            if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
              removeTag();
            }
          }}
        />

        <Button
          size={"icon"}
          variant={"secondary"}
          className={cn(
            "w-4 h-4 transition-opacity duration-200",
            inputRef.current?.value || focused ? "opacity-100" : "opacity-0"
          )}
          type="button"
          onClick={() => {
            if (inputRef.current) {
              addTag(inputRef.current.value);
            }
          }}
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
