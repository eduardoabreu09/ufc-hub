import { Avatar, AvatarFallback } from "./ui/avatar";

interface AvatarNameProps {
  name: string;
  className?: string;
}

export default function AvatarName({ name, className }: AvatarNameProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <Avatar className={className}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
