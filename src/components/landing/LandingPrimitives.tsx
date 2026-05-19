import type { PropsWithChildren } from "react";

export function Eyebrow({ children }: PropsWithChildren) {
  return (
    <p className="m-0 text-[0.78rem] font-bold uppercase leading-tight tracking-normal text-[var(--bs-accent)]">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  id,
}: {
  eyebrow: string;
  title: string;
  body: string;
  id: string;
}) {
  return (
    <div className="max-w-[58rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-[0.45rem] max-w-[13ch] text-[2.35rem] leading-[1.04] text-[var(--bs-text)] min-[641px]:text-[3.1rem] lg:text-[4rem]"
        id={id}
      >
        {title}
      </h2>
      <p className="mt-4 max-w-[58rem] text-[1.04rem] leading-[1.7] text-[var(--bs-muted)]">{body}</p>
    </div>
  );
}
