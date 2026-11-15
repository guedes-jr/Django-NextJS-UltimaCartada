const locks = new WeakMap<HTMLElement, { count: number; previousOverflow: string }>();

/** Compartilha o bloqueio entre superfícies sobrepostas sem liberar outra ainda aberta. */
export function lockPageScroll(element: HTMLElement): () => void {
  let lock = locks.get(element);
  if (!lock) {
    lock = { count: 0, previousOverflow: element.style.overflow };
    locks.set(element, lock);
  }
  lock.count += 1;
  element.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lock.count -= 1;
    if (lock.count === 0) {
      element.style.overflow = lock.previousOverflow;
      locks.delete(element);
    }
  };
}
