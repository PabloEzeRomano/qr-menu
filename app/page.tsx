// export default function Home() {
//   const [firebaseStatus, setFirebaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
//   const [mpStatus, setMpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
//   const [testData, setTestData] = useState<any[]>([])
//   const [mpResponse, setMpResponse] = useState<any>(null)

//   // Test Firestore connection
//   const testFirestore = async () => {
//     setFirebaseStatus('loading')
//     try {
//       // Write test data
//       const docRef = await addDoc(collection(db, 'test'), {
//         message: 'Hello from QR Menu!',
//         timestamp: Timestamp.now(),
//         test: true
//       })
//       console.log('Document written with ID: ', docRef.id)

//       // Read test data
//       const querySnapshot = await getDocs(collection(db, 'test'))
//       const data = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }))
//       setTestData(data)
//       setFirebaseStatus('success')
//     } catch (error) {
//       console.error('Firestore error:', error)
//       setFirebaseStatus('error')
//     }
//   }

//   // Test Mercado Pago API
//   const testMercadoPago = async () => {
//     setMpStatus('loading')
//     try {
//       const response = await fetch('/api/mp/create-preference', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: 'Test Item',
//           quantity: 1,
//           unit_price: 100.00
//         })
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       setMpResponse(data)
//       setMpStatus('success')
//     } catch (error) {
//       console.error('Mercado Pago error:', error)
//       setMpStatus('error')
//     }
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             QR Menu Starter
//           </h1>
//           <p className="text-xl text-gray-600 mb-8">
//             Next.js + TypeScript + Tailwind + Firebase + Mercado Pago
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Firebase Integration Test */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//               Firebase Integration
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Test Firestore read/write operations
//             </p>
//             <button
//               onClick={testFirestore}
//               disabled={firebaseStatus === 'loading'}
//               className={clsx(
//                 'px-4 py-2 rounded-lg font-medium transition-colors',
//                 firebaseStatus === 'loading'
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-blue-600 text-white hover:bg-blue-700'
//               )}
//             >
//               {firebaseStatus === 'loading' ? 'Testing...' : 'Test Firestore'}
//             </button>

//             <div className="mt-4">
//               <div className={clsx(
//                 'p-3 rounded-lg text-sm',
//                 firebaseStatus === 'success' && 'bg-green-100 text-green-800',
//                 firebaseStatus === 'error' && 'bg-red-100 text-red-800',
//                 firebaseStatus === 'idle' && 'bg-gray-100 text-gray-600'
//               )}>
//                 Status: {firebaseStatus === 'idle' ? 'Ready to test' : firebaseStatus}
//               </div>

//               {testData.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="font-medium text-gray-700 mb-2">Test Data:</h3>
//                   <div className="bg-gray-50 p-3 rounded text-sm">
//                     <pre>{JSON.stringify(testData, null, 2)}</pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mercado Pago Integration Test */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//               Mercado Pago Integration
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Test payment preference creation
//             </p>
//             <button
//               onClick={testMercadoPago}
//               disabled={mpStatus === 'loading'}
//               className={clsx(
//                 'px-4 py-2 rounded-lg font-medium transition-colors',
//                 mpStatus === 'loading'
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-green-600 text-white hover:bg-green-700'
//               )}
//             >
//               {mpStatus === 'loading' ? 'Testing...' : 'Test Mercado Pago'}
//             </button>

//             <div className="mt-4">
//               <div className={clsx(
//                 'p-3 rounded-lg text-sm',
//                 mpStatus === 'success' && 'bg-green-100 text-green-800',
//                 mpStatus === 'error' && 'bg-red-100 text-red-800',
//                 mpStatus === 'idle' && 'bg-gray-100 text-gray-600'
//               )}>
//                 Status: {mpStatus === 'idle' ? 'Ready to test' : mpStatus}
//               </div>

//               {mpResponse && (
//                 <div className="mt-4">
//                   <h3 className="font-medium text-gray-700 mb-2">Response:</h3>
//                   <div className="bg-gray-50 p-3 rounded text-sm">
//                     <pre>{JSON.stringify(mpResponse, null, 2)}</pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Environment Setup Instructions */}
//         <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//           <h2 className="text-xl font-semibold text-yellow-800 mb-4">
//             Setup Instructions
//           </h2>
//           <div className="text-yellow-700 space-y-2">
//             <p>1. Copy <code className="bg-yellow-100 px-2 py-1 rounded">env.example</code> to <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code></p>
//             <p>2. Configure your Firebase project credentials</p>
//             <p>3. Add your Mercado Pago access token</p>
//             <p>4. Run <code className="bg-yellow-100 px-2 py-1 rounded">yarn install</code> and <code className="bg-yellow-100 px-2 py-1 rounded">yarn dev</code></p>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { db, ensureAuth } from '@/lib/firebase';
import clsx from 'clsx';

const phrases = [
  'Decile chau al menú en PDF',
  'Mostrá tu carta con estilo',
  'Tu menú, rápido y siempre actualizado',
];

export default function Landing() {
  const router = useRouter();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [firebaseStatus, setFirebaseStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [testData, setTestData] = useState<any[]>([]);

  useEffect(() => { ensureAuth(); }, []);

  // Test Firestore connection
  const testFirestore = async () => {
    setFirebaseStatus('loading');
    try {
      // Write test data
      await setDoc(doc(db, "test", "hello"), {
        ok: true,
        ts: serverTimestamp(),
      });
      console.log('Document written with ID: ', doc(db, "test", "hello").id);

      // // Read test data
      // const querySnapshot = await getDocs(collection(db, 'test'));
      // const data = querySnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // setTestData(data);
      setFirebaseStatus('success');
    } catch (error) {
      console.error('Firestore error:', error);
      setFirebaseStatus('error');
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;
    const fullText = phrases[currentPhrase];

    const type = () => {
      setDisplayedText(fullText.slice(0, index++));
      if (index <= fullText.length) {
        timeout = setTimeout(type, 60);
      } else {
        setTimeout(() => {
          setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, [currentPhrase]);

  return (
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-bold text-center leading-tight"
        >
          {displayedText}
          <span className="blinking-cursor">|</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-cyan-200 mt-6 text-center max-w-xl"
        >
          Una experiencia moderna para tus clientes. Menús diseñados para
          celulares, rápidos de leer y fáciles de actualizar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-10"
        >
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all shadow-lg hover:shadow-cyan-500/25"
            onClick={() => {
              router.push('/demo-menu');
            }}
          >
            Probar demo
          </button>
          <br />
          <button
            onClick={testFirestore}
            disabled={firebaseStatus === 'loading'}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              firebaseStatus === 'loading'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {firebaseStatus === 'loading' ? 'Testing...' : 'Test Firestore'}
          </button>

          <div className="mt-4">
            <div
              className={clsx(
                'p-3 rounded-lg text-sm',
                firebaseStatus === 'success' && 'bg-green-100 text-green-800',
                firebaseStatus === 'error' && 'bg-red-100 text-red-800',
                firebaseStatus === 'idle' && 'bg-gray-100 text-gray-600'
              )}
            >
              Status:{' '}
              {firebaseStatus === 'idle' ? 'Ready to test' : firebaseStatus}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
