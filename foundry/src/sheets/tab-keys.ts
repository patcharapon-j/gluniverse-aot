/**
 * The keys that move between a sheet's tabs (sheet-overhaul plan, 3.1): the arrows in both axes,
 * so the row of folder tabs and the index tabs on the file's edge answer the same keys, with
 * wrap-around, and Home and End. Returns the index to select, or null for any other key.
 */
export function nextTab(key: string, index: number, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowUp':
    case 'ArrowLeft':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
