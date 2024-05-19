import { useEffect, useState } from "react";
import * as ConfettiDefault from "react-dom-confetti";

const config: ConfettiDefault.ConfettiConfig = {
  angle: 90,
  spread: 200,
  startVelocity: 300,
  elementCount: 300,
  dragFriction: 0.3,
  duration: 3000,
  stagger: 2,
  width: "16px",
  height: "16px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

type ConfettiProps = {
  active: boolean;
  onComplete?: () => void;
  config?: ConfettiDefault.ConfettiConfig;
};

export default function Confetti({
  active,
  onComplete,
  ...props
}: ConfettiProps) {
  //   check if props is defined else use default config

  const [isConfettiVisible, setIsConfettiVisible] = useState(active);

  useEffect(() => {
    setIsConfettiVisible(active);
    if (active) {
      onComplete && onComplete();
    }
  }, [active]);

  return <ConfettiDefault.default active={isConfettiVisible} config={config} />;
}
