import type { SVGProps } from "react";

export function ToothIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.33 3.05a2.5 2.5 0 0 1 5.34 0 2.5 2.5 0 0 0 5.002 0c.37.91.49 1.93.31 2.9C19.22 8.35 18.5 11.23 18.5 13c0 2.5-2.5 2.5-2.5 2.5h-8S5.5 15.5 5.5 13c0-1.77-.72-4.65-1.48-7.05-.18-.97-.06-1.99.31-2.9a2.5 2.5 0 0 0 5-.002Z" />
      <path d="M12 15.5V21" />
      <path d="M7.5 15.5l-1 4" />
      <path d="M16.5 15.5l1 4" />
    </svg>
  );
}
