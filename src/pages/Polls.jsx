import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PollForm from '../components/PollForm';
import PollList from '../components/PollList';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3001';

const Polls = () => {
  const { user } = useAuth();
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setHasVoted(false);
        setUserVote(null);
        
        const optionsResponse = await axios.get(`${API_URL}/options`);
        setOptions(optionsResponse.data || []);
        
        try {
          const votesResponse = await axios.get(`${API_URL}/userVotes`);
          const votes = votesResponse.data || [];
          const userVoteRecord = votes.find(
            vote => vote.userId === user.uid
          );
          
          if (userVoteRecord) {
            setHasVoted(true);
            setUserVote(userVoteRecord.optionId);
          }
        } catch (voteError) {
          console.log('No userVotes found:', voteError.message);
        }
      } catch (error) {
        console.error('Error loading options:', error);
        toast.error('Failed to load poll data. Make sure JSON Server is running on port 3001');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && user.uid) {
      loadData();
    }
  }, [user]);

  const handleAddOption = async (text) => {
    const newOption = {
      id: Date.now().toString(),
      text,
      votes: 0
    };

    try {
      await axios.post(`${API_URL}/options`, newOption);
      setOptions((prev) => [...prev, newOption]);
      toast.success('Option added successfully!');
    } catch (error) {
      console.error('Error adding option:', error);
      toast.error('Failed to add option. Is JSON Server running?');
    }
  };

  const handleVote = useCallback(async (optionId) => {
    if (hasVoted) {
      toast.warning('You have already voted!');
      return;
    }

    try {
      const option = options.find((o) => o.id === optionId);
      if (!option) {
        toast.error('Option not found');
        return;
      }

      const updatedVotes = option.votes + 1;
      
      await axios.patch(`${API_URL}/options/${optionId}`, {
        votes: updatedVotes
      });

      await axios.post(`${API_URL}/userVotes`, {
        id: Date.now().toString(),
        userId: user.uid,
        optionId: optionId,
        votedAt: new Date().toISOString()
      });

      setOptions((prev) =>
        prev.map((opt) => 
          opt.id === optionId ? { ...opt, votes: updatedVotes } : opt
        )
      );

      setHasVoted(true);
      setUserVote(optionId);
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote. Check console for details.');
    }
  }, [options, hasVoted, user]);

  const handleDeleteOption = async (optionId) => {
    if (!window.confirm('Delete this candidate? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/options/${optionId}`);

      try {
        const votesResponse = await axios.get(`${API_URL}/userVotes?optionId=${optionId}`);
        const deletePromises = votesResponse.data.map((entry) =>
          axios.delete(`${API_URL}/userVotes/${entry.id}`)
        );
        await Promise.all(deletePromises);
      } catch (voteError) {
        console.log('No votes to remove for deleted option:', voteError.message);
      }

      setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
      if (userVote === optionId) {
        setHasVoted(false);
        setUserVote(null);
      }
      toast.success('Candidate deleted successfully!');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate. Check console for details.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all votes? This cannot be undone.')) {
      return;
    }

    try {
      const resetPromises = options.map((opt) =>
        axios.patch(`${API_URL}/options/${opt.id}`, { votes: 0 })
      );
      await Promise.all(resetPromises);

      try {
        const votesResponse = await axios.get(`${API_URL}/userVotes`);
        const votes = votesResponse.data || [];
        const deletePromises = votes.map((vote) =>
          axios.delete(`${API_URL}/userVotes/${vote.id}`)
        );
        await Promise.all(deletePromises);
      } catch (e) {
        console.log('No userVotes to clear');
      }

      setOptions((prev) => prev.map((opt) => ({ ...opt, votes: 0 })));
      setHasVoted(false);
      setUserVote(null);
      toast.success('All votes have been reset!');
    } catch (error) {
      console.error('Error resetting votes:', error);
      toast.error('Failed to reset votes. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Voting Poll</h1>
        <p className="text-gray-600">Cast your vote and see live results</p>
      </div>

      <PollForm onAddOption={handleAddOption} />
      
      <PollList
        options={options}
        onVote={handleVote}
        onDelete={handleDeleteOption}
        hasVoted={hasVoted}
        userVote={userVote}
        onReset={handleReset}
      />
    </div>
  );
};

export default Polls;