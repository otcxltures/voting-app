const PollOption = ({ option, totalVotes, onVote, onDelete, hasVoted, userVote }) => {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  const isUserChoice = userVote === option.id;

  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
        <span className="font-semibold text-gray-800">{option.text}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {option.votes} votes ({percentage}%)
            {isUserChoice && <span className="ml-2 text-green-600 font-bold">✓ Your vote</span>}
          </span>
          <button
            type="button"
            onClick={() => onDelete(option.id)}
            className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="relative h-10 bg-gray-200 rounded-lg overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
            isUserChoice ? 'bg-green-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />

        <button
          onClick={() => onVote(option.id)}
          disabled={hasVoted}
          className={`absolute inset-0 w-full h-full flex items-center justify-center text-sm font-semibold transition ${
            hasVoted
              ? 'bg-gray-200 cursor-not-allowed text-gray-500'
              : 'bg-black text-white hover:bg-gray-900 cursor-pointer'
          }`}
        >
          {hasVoted ? (isUserChoice ? 'Voted' : 'Vote') : 'Vote'}
        </button>
      </div>
    </div>
  );
};

export default PollOption;