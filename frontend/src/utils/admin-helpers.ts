export function onTextChange(event: Event, updateFn: (val: string) => void): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const newText = target.innerText.trim();
  if (newText) {
    updateFn(newText);
  }
}
