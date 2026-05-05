import { useState } from 'react';

const PollForm = ({ onAddOption }) => {
  const [newOption, setNewOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter a new poll option..."
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-md"
        >
          Add Option
        </button>
      </div>
    </form>
  );
};

export default PollForm;