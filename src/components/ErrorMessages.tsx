"use client";

import { twMerge } from "tailwind-merge";

type TProps = {
  errorMessageArray: string[] | null;
  className: { container?: string; span?: string };
};
export function ErrorMessages({ errorMessageArray, className }: TProps) {
  return (
    <>
      {errorMessageArray && (
        <div
          className={twMerge(
            "flex flex-col pt-0.5 text-red-500 font-medium text-xs",
            className?.container
          )}
        >
          {errorMessageArray.map((errorMessage, idx) => {
            return (
              <span
                key={idx}
                className={twMerge("leading-none", className?.span)}
              >
                *{errorMessage}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}
