import Image from 'next/image';
export default function Home() {
 return (
   <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex items-center justify-center p-8">
     <div className="absolute inset-0 flex items-start pointer-events-none select-none">
       <div className="w-full px-4 pt-3 space-y-5">
         <p className="uppercase tracking-[0.1em] text-white/15 text-8xl font-bold">
         I-L-L / I-N-I / I-L-L / I-N-I / I
         -L-L / I-N-I / I-L-L / I-N-I / I-
         L-L / I-N-I / I-L-L / I-N-I / I-L
         -L / I-N-I / I-L-L / I-N-I / I-L-
         L / I-N-I / I-L-L / I-N-I / I-L-L
         / I-N-I / I-L-L / I-N-I / I-L-L /
         I-N-I / I-L-L / I-N-I / I-L-L / I
         -N-I / I-L-L / I-N-I / I-L-L / I-
         </p>
       </div>
     </div>
     <div className="bg-[#ecf2ff] backdrop-blur-xl shadow-xl rounded 3xl w-400 h-400 flex flex-col items-center justify-center p-6 text-center">
      
       <div className="flex items-center justify-center">
     <Image
       src="/iroomielogofinal.png"
       alt="iRoomie logo"
       width={400}
       height={400}
     />
   </div>
       <div className="flex justify-center gap-6">
         <a
           href="/register/"
           className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 transition-all"
         >
           Register
         </a>


         <a
           href="/login/"
           className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all"
         >
           Login
         </a>
        
       </div>


     </div>
   </div>
 );
}



