import { doc, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export type OrderedRow = { id: string; order: number };

/** Swap `order` between item at index and its neighbor. */
export async function moveOrder(
  firestore: Firestore,
  collectionId: string,
  sorted: OrderedRow[],
  index: number,
  direction: -1 | 1,
): Promise<void> {
  const j = index + direction;
  if (j < 0 || j >= sorted.length) return;
  const a = sorted[index];
  const b = sorted[j];
  if (!a || !b) return;

  const batch = writeBatch(firestore);
  batch.update(doc(firestore, collectionId, a.id), { order: b.order });
  batch.update(doc(firestore, collectionId, b.id), { order: a.order });
  await batch.commit();
}
