export const getHeaderOffset = () => (window.innerWidth < 768 ? 56 : 100);

export function scrollToSelector(selector: string) {
  const target = document.querySelector(selector);
  if (!target) {
    return false;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

interface ScrollRetryOptions {
  maxAttempts?: number;
  onSuccess?: () => void;
}

export function scrollToSelectorWithRetry(selector: string, options: ScrollRetryOptions = {}) {
  const { maxAttempts = 120, onSuccess } = options;
  let frame = 0;
  let attempts = 0;
  let cancelled = false;

  const tick = () => {
    if (cancelled) {
      return;
    }

    if (scrollToSelector(selector)) {
      onSuccess?.();
      return;
    }

    attempts += 1;
    if (attempts >= maxAttempts) {
      return;
    }

    frame = window.requestAnimationFrame(tick);
  };

  frame = window.requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(frame);
  };
}
