"use client";

import { ReactNode } from "react";

type TProps = {
  className?: string;
  children?: ReactNode;
};
export function Label({ className, children }: TProps) {
  return <>{children && <label className={className}>{children}</label>}</>;
}
