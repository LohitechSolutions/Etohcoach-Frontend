import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

/** Upload under `etoh_cms/…` per `storage.rules`. */
export async function uploadCmsFile(
  storage: FirebaseStorage,
  logicalPath: string,
  file: File,
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `etoh_cms/${logicalPath.replace(/^\/+/, '')}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || undefined });
  return getDownloadURL(storageRef);
}
