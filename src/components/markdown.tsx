import { Fragment } from "react";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
    if (link)
      return (
        <a key={i} href={link[2]} className="text-gold underline underline-offset-4" target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Minimal markdown renderer for CMS article bodies. */
export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="my-6 space-y-3 border-l border-gold/30 pl-6">
        {list.map((li, i) => (
          <li key={i} className="text-sm text-foreground/80">{inline(li)}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  const flushPara = () => {
    if (!para.length) return;
    out.push(
      <p key={`p-${out.length}`} className="my-5 leading-relaxed text-muted-foreground">
        {inline(para.join(" "))}
      </p>,
    );
    para = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (/^#{1,6}\s/.test(line)) {
      flushPara(); flushList();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, "");
      out.push(
        level <= 2 ? (
          <h2 key={`h-${out.length}`} className="mt-14 font-display text-3xl leading-tight md:text-4xl">{text}</h2>
        ) : (
          <h3 key={`h-${out.length}`} className="mt-10 font-display text-xl">{text}</h3>
        ),
      );
      continue;
    }
    if (/^[-*]\s/.test(line)) { flushPara(); list.push(line.replace(/^[-*]\s*/, "")); continue; }
    if (line.startsWith("> ")) {
      flushPara(); flushList();
      out.push(
        <blockquote key={`q-${out.length}`} className="my-8 rounded-2xl glass p-6 font-display text-xl">
          {inline(line.slice(2))}
        </blockquote>,
      );
      continue;
    }
    para.push(line);
  }
  flushPara();
  flushList();

  return <div className="text-base">{out}</div>;
}
