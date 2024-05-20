"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

type HoverProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function useHover(): [boolean, HoverProps] {
  const [hovering, setHovering] = useState(false);
  const onHoverProps: HoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };
  return [hovering, onHoverProps];
}

export function SubscribeButton() {
  const [hovering, onHoverProps] = useHover();

  return (
    <Button
      className="rounded-full border border-black bg-transparent p-8 text-center text-black md:hover:bg-white/20 active:bg-white/20"
      {...onHoverProps}
    >
      <h3 className="text-2xl font-bold">
        {hovering ? "It's free gurl" : "Subscribe"}
      </h3>
    </Button>
  );
}
