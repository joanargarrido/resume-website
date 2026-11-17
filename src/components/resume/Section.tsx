import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 py-12"
    >
      <h2
        id={`${id}-heading`}
        className="mb-6 text-2xl font-bold tracking-tight"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
