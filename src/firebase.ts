import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass firestoreDatabaseId according to SKILL.md
export const db = getFirestore(app, (firebaseConfig as { firestoreDatabaseId: string }).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email ?? null,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per SKILL.md
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client appears offline, falling back to local cached storage.");
    }
    return false;
  }
}
testConnection();

export interface UserGameProfile {
  userId: string;
  displayName: string;
  photoURL: string;
  totalScore: number;
  ringsCollected: number;
  eggsCollected: number;
  highestLevel: number;
  unlockedBalls: string[];
  currentBall: string;
  createdAt: string;
  lastActive: string;
  levelStars: Record<number, number>;
  levelBestTimes: Record<number, number>;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string;
  level: number;
  score: number;
  timeSeconds: number;
  rings: number;
  stars: number;
  completedAt: string;
}

// Local storage fallback key
const LOCAL_STORAGE_KEY = 'bounce_tales_player_profile';

export function getLocalProfile(): UserGameProfile {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    userId: 'guest_' + Math.random().toString(36).substring(2, 9),
    displayName: 'Red Explorer',
    photoURL: '',
    totalScore: 0,
    ringsCollected: 0,
    eggsCollected: 0,
    highestLevel: 1,
    unlockedBalls: ['classic'],
    currentBall: 'classic',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    levelStars: {},
    levelBestTimes: {}
  };
}

export function saveLocalProfile(profile: UserGameProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In failed:', err);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function syncUserProfile(profile: UserGameProfile): Promise<void> {
  saveLocalProfile(profile);
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const path = `users/${currentUser.uid}`;
  try {
    const dataToSave = {
      userId: currentUser.uid,
      displayName: (currentUser.displayName || profile.displayName || 'Player').slice(0, 64),
      photoURL: currentUser.photoURL || profile.photoURL || '',
      totalScore: profile.totalScore,
      ringsCollected: profile.ringsCollected,
      eggsCollected: profile.eggsCollected,
      highestLevel: profile.highestLevel,
      unlockedBalls: profile.unlockedBalls,
      currentBall: profile.currentBall,
      levelStars: profile.levelStars,
      levelBestTimes: profile.levelBestTimes,
      createdAt: profile.createdAt || new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', currentUser.uid), dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserProfile(user: User): Promise<UserGameProfile> {
  const path = `users/${user.uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data() as UserGameProfile;
      saveLocalProfile(data);
      return data;
    }
  } catch (error) {
    console.warn('Could not fetch cloud profile, using local:', error);
  }

  // Create initial cloud profile
  const local = getLocalProfile();
  const initial: UserGameProfile = {
    ...local,
    userId: user.uid,
    displayName: user.displayName || local.displayName,
    photoURL: user.photoURL || '',
    lastActive: new Date().toISOString()
  };
  await syncUserProfile(initial);
  return initial;
}

export async function recordLeaderboardScore(score: Omit<LeaderboardEntry, 'id'>): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const docId = `${currentUser.uid}_level_${score.level}`;
  const path = `leaderboard/${docId}`;
  try {
    await setDoc(doc(db, 'leaderboard', docId), {
      userId: currentUser.uid,
      displayName: (currentUser.displayName || score.displayName || 'Player').slice(0, 64),
      photoURL: currentUser.photoURL || score.photoURL || '',
      level: score.level,
      score: score.score,
      timeSeconds: score.timeSeconds,
      rings: score.rings,
      stars: score.stars,
      completedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getTopScores(): Promise<LeaderboardEntry[]> {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    const results: LeaderboardEntry[] = [];
    querySnapshot.forEach(docSnap => {
      results.push({ id: docSnap.id, ...(docSnap.data() as Omit<LeaderboardEntry, 'id'>) });
    });
    return results;
  } catch (error) {
    console.warn('Could not load leaderboard:', error);
    return [];
  }
}
