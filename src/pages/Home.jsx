import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Make Your Voice <span className="text-indigo-600">Heard</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Create polls, cast your vote, and see real-time results. 
          Secure authentication ensures one vote per user.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to="/polls"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              Go to Polls
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-800 mb-2">Secure Voting</h3>
            <p className="text-gray-600 text-sm">One vote per authenticated user</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-gray-800 mb-2">Live Results</h3>
            <p className="text-gray-600 text-sm">Real-time vote counting and percentages</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-bold text-gray-800 mb-2">Persistent Data</h3>
            <p className="text-gray-600 text-sm">All data stored on JSON Server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;