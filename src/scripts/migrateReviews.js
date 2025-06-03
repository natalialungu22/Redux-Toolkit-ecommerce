import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const migrateReviews = async () => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    console.log(`Found ${snapshot.docs.length} reviews to process.`);

    for (const reviewDoc of snapshot.docs) {
      const review = reviewDoc.data();

      if (review.userName) {
        console.log(
          `Review ${reviewDoc.id} already has userName: ${review.userName}`
        );
        continue;
      }

      const userName = 'Anonymous User';
      await updateDoc(doc(db, 'reviews', reviewDoc.id), { userName });
      console.log(`Updated review ${reviewDoc.id} with userName: ${userName}`);
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
};

migrateReviews();
