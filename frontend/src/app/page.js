export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-orange-400 flex items-center justify-center p-8">
      <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl p-10 max-w-2xl w-full text-center">
        
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
          Welcome to <span className="text-orange-500">iRoomie</span>
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Your roommate matching platform for UIUC 🎓
        </p>

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
