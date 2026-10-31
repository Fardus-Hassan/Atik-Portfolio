type SmootherLike = {
  scrollTo: (
    target: Element | string | number,
    smooth?: boolean,
    position?: string,
  ) => void;
  paused: (value?: boolean) => unknown;
  kill: () => void;
};

let smoother: SmootherLike | null = null;
let locks = 0;
let htmlLocked = false;

function lockHtml() {
  if (htmlLocked || typeof document === "undefined") return;
  document.documentElement.style.overflow = "hidden";
  htmlLocked = true;
}

function unlockHtml() {
  if (!htmlLocked || typeof document === "undefined") return;
  document.documentElement.style.overflow = "";
  htmlLocked = false;
}

export function setSmoother(instance: SmootherLike | null) {
  smoother = instance;
  if (instance && locks > 0) instance.paused(true);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (smoother) smoother.scrollTo(el, true, "top 16px");
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function pushScrollLock() {
  locks += 1;
  if (smoother) smoother.paused(true);
  else lockHtml();
}

export function popScrollLock() {
  locks = Math.max(0, locks - 1);
  if (locks !== 0) return;
  smoother?.paused(false);
  unlockHtml();
}
