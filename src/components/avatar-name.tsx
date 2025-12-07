import { Avatar, AvatarFallback } from "./ui/avatar";

interface AvatarNameProps {
  name: string;
  textSize?: "text-sm" | "text-md" | "text-lg" | "text-2xl" | "text-4xl";
  className?: string;
}

export default function AvatarName({
  name,
  className,
  textSize,
}: AvatarNameProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <Avatar className={className}>
      <AvatarFallback className={textSize}>{initials}</AvatarFallback>
    </Avatar>
  );
}
