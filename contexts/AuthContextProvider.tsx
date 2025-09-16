// 'use client';

// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { auth, db } from '@/lib/firebase';
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   signOut,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   User,
// } from 'firebase/auth';
// import { doc, onSnapshot } from 'firebase/firestore';

// type AuthContext = {
//   user: User | null;
//   loading: boolean;
//   isAdmin: boolean;
//   signIn: (
//     email: string,
//     password: string,
//     type?: 'email' | 'google'
//   ) => Promise<void>;
//   signUp: (
//     email: string,
//     password: string,
//     displayName?: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContext>({
//   user: null,
//   loading: true,
//   isAdmin: false,
//   signIn: async () => {},
//   signUp: async () => {},
//   logout: async () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [authInit, setAuthInit] = useState(true);
//   const [roleLoading, setRoleLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Auth state
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setAuthInit(false);
//     });
//     return () => unsub();
//   }, []);

//   // Rol admin: admins/{uid}
//   useEffect(() => {
//     if (!user) {
//       setIsAdmin(false);
//       return;
//     }
//     setRoleLoading(true);
//     const ref = doc(db, 'admins', user.uid);
//     console.log('ref', ref);
//     const unsub = onSnapshot(
//       ref,
//       (snap) => {
//         console.log('snap', snap, 'snap.exists()', snap.exists());
//         setIsAdmin(snap.exists());
//         setRoleLoading(false);
//       },
//       () => setRoleLoading(false)
//     );
//     return () => unsub();
//   }, [user]);

//   // Sign in (email/google)
//   const signIn = async (
//     email: string,
//     password: string,
//     type: 'email' | 'google' = 'email'
//   ) => {
//     if (type === 'email') {
//       await signInWithEmailAndPassword(auth, email, password);
//     } else {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     }
//   };

//   const signUp = async (
//     email: string,
//     password: string,
//     displayName?: string
//   ) => {
//     const cred = await createUserWithEmailAndPassword(auth, email, password);
//     if (displayName) {
//       await updateProfile(cred.user, { displayName });
//     }
//   };

//   const logout = async () => signOut(auth);

//   const value = useMemo(
//     () => ({
//       user,
//       loading: authInit || roleLoading,
//       isAdmin,
//       signIn,
//       signUp,
//       logout,
//     }),
//     [user, authInit, roleLoading, isAdmin]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => useContext(AuthContext);
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string,
    type?: "email" | "google",
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authInit, setAuthInit] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthInit(false);
    });
    return () => unsub();
  }, []);

  // Admin role: admins/{uid}
  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    const ref = doc(db, "admins", user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (cancelled) return;
        setIsAdmin(snap.exists());
        setRoleLoading(false);
      },
      (err) => {
        console.error("onSnapshot(admins) error:", err);
        if (cancelled) return;
        setIsAdmin(false);
        setRoleLoading(false);
      },
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [user]);

  // Sign in (email/google)
  const signIn = async (
    email: string,
    password: string,
    type: "email" | "google" = "email",
  ) => {
    if (type === "email") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); // crea la cuenta si es primera vez
    }
  };

  // Sign up (email/password)
  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  };

  const logout = async () => signOut(auth);

  const value = useMemo(
    () => ({
      user,
      loading: authInit || roleLoading,
      isAdmin,
      signIn,
      signUp,
      logout,
    }),
    [user, authInit, roleLoading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
