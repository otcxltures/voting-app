import PollOption from './PollOption';

const PollList = ({ options, onVote, onDelete, hasVoted, userVote, onReset }) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Poll Options</h2>
        <div className="text-sm text-gray-600">
          Total Votes: <span className="font-bold text-indigo-600">{totalVotes}</span>
        </div>
      </div>

      {options.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No options yet. Add one above!</p>
      ) : (
        <div className="space-y-4">
          {options.map((option) => (
            <PollOption
              key={option.id}
              option={option}
              totalVotes={totalVotes}
              onVote={onVote}
              onDelete={onDelete}
              hasVoted={hasVoted}
              userVote={userVote}
            />
          ))}
        </div>
      )}

      {options.length > 0 && (
        <button
          onClick={onReset}
          className="mt-6 w-full py-3 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition"
        >
          Reset All Votes
        </button>
      )}
    </div>
  );
};

export default PollList;