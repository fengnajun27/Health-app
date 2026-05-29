import { getGivenNameLabel } from "@/lib/avatar-utils";
import { isLightAvatar, resolveAvatarHex } from "@/lib/members";
import type { FamilyMemberProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const sizeClass: Record<AvatarSize, string> = {
  sm: "h-10 w-10 rounded-xl text-sm",
  md: "h-12 w-12 rounded-xl text-base",
  lg: "h-14 w-14 rounded-2xl text-xl",
};

interface MemberAvatarProps {
  member: Pick<FamilyMemberProfile, "name" | "avatarColor" | "avatarImage">;
  size?: AvatarSize;
  className?: string;
}

export function MemberAvatar({
  member,
  size = "lg",
  className,
}: MemberAvatarProps) {
  const label = getGivenNameLabel(member.name);
  const hex = resolveAvatarHex(member.avatarColor);
  const lightText = isLightAvatar(member.avatarColor);
  const compactLabel = label.length > 1;

  if (member.avatarImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatarImage}
        alt={member.name}
        className={cn(
          "shrink-0 object-cover ring-2 ring-slate-200",
          sizeClass[size],
          className
        )}
      />
    );
  }

  return (
    <span
      style={{ backgroundColor: hex }}
      className={cn(
        "flex shrink-0 items-center justify-center font-bold leading-none",
        lightText ? "text-slate-800" : "text-white",
        sizeClass[size],
        compactLabel && size === "lg" && "text-base",
        compactLabel && size === "md" && "text-sm",
        compactLabel && size === "sm" && "text-xs",
        className
      )}
    >
      {label}
    </span>
  );
}
