export type NavLink = { href: string; label: string };

export function NavBar({ name, links }: { name: string; links: NavLink[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3"
      >
        <a href="#top" className="truncate font-semibold">
          {name}
        </a>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
