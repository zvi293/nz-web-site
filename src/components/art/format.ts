/** Zero-pads exhibit numbers to two digits (3 → "03"); strings pass through. */
export const formatIndex = (index: number | string) =>
  typeof index === "number" ? String(index).padStart(2, "0") : index;
