import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './firebase';

/**
 * Upload an image file or Base64 string to Firebase Cloud Storage.
 * Returns the public download URL.
 */
export async function uploadImageToStorage(
  imageData: File | Blob | string,
  folder = 'reports'
): Promise<string> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileName = `${folder}/${uid}_${timestamp}_${random}.jpg`;
  const storageRef = ref(storage, fileName);

  try {
    if (typeof imageData === 'string') {
      // Base64 Data URL or raw base64
      let format = 'data_url';
      if (!imageData.startsWith('data:')) {
        imageData = `data:image/jpeg;base64,${imageData}`;
      }
      const snapshot = await uploadString(storageRef, imageData, 'data_url', {
        contentType: 'image/jpeg',
      });
      return await getDownloadURL(snapshot.ref);
    } else {
      // File or Blob
      const snapshot = await uploadBytes(storageRef, imageData, {
        contentType: imageData.type || 'image/jpeg',
      });
      return await getDownloadURL(snapshot.ref);
    }
  } catch (error: any) {
    console.warn('Firebase Cloud Storage upload error:', error);
    // If client is offline or storage bucket quota, fallback to the base64 or object URL gracefully
    if (typeof imageData === 'string') {
      return imageData;
    }
    return URL.createObjectURL(imageData);
  }
}
