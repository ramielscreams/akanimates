"use client";

import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type { WorkMode } from "@/data/work-projects";

type ProjectReturnLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: ComponentPropsWithoutRef<typeof Link>["href"];
  mode: WorkMode;
  projectSlug: string;
};

export const ProjectReturnLink = forwardRef<HTMLAnchorElement, ProjectReturnLinkProps>(function ProjectReturnLink({
  href,
  mode,
  onClick,
  projectSlug,
  ...props
}, ref) {
  return (
    <Link
      ref={ref}
      href={href}
      onClick={(event) => {
        window.sessionStorage.setItem("ak-work-mode", mode);
        window.sessionStorage.setItem(`ak-work-position:${mode}`, projectSlug);
        onClick?.(event);
      }}
      {...props}
    />
  );
});
