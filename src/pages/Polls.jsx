import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import PollForm from '../components/PollForm';
import PollList from '../components/PollList';
import { toast } from 'react-toastify';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

const Polls = () => {
  const { user } = useAuth();
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setHasVoted(false);
        setUserVote(null);

        // Load options
        const optionsQuery = collection(db, 'options');
        const optionsSnapshot = await getDocs(optionsQuery);
        const optionsData = optionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOptions(optionsData);

        // Check if user has voted
        const votesQuery = query(
          collection(db, 'userVotes'),
          where('userId', '==', user.uid)
        );
        const votesSnapshot = await getDocs(votesQuery);
        if (!votesSnapshot.empty) {
          const userVoteRecord = votesSnapshot.docs[0].data();
          setHasVoted(true);
          setUserVote(userVoteRecord.optionId);
        }
      } catch (error) {
        console.error('Error loading poll data:', error);
        toast.error('Failed to load poll data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddOption = async (text) => {
    const newOption = {
      text,
      votes: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.uid
    };

    try {
      const docRef = await addDoc(collection(db, 'options'), newOption);
      setOptions((prev) => [...prev, { id: docRef.id, ...newOption }]);
      toast.success('Option added successfully!');
    } catch (error) {
      console.error('Error adding option:', error);
      toast.error('Failed to add option');
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

      // Update option votes
      await updateDoc(doc(db, 'options', optionId), {
        votes: updatedVotes
      });

      // Record user vote
      await addDoc(collection(db, 'userVotes'), {
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
      toast.error('Failed to record vote');
    }
  }, [options, hasVoted, user]);

  const handleDeleteOption = async (optionId) => {
    if (!window.confirm('Delete this candidate? This cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'options', optionId));

      // Remove associated votes
      const votesQuery = query(
        collection(db, 'userVotes'),
        where('optionId', '==', optionId)
      );
      const votesSnapshot = await getDocs(votesQuery);
      const deletePromises = votesSnapshot.docs.map((voteDoc) =>
        deleteDoc(doc(db, 'userVotes', voteDoc.id))
      );
      await Promise.all(deletePromises);

      setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
      if (userVote === optionId) {
        setHasVoted(false);
        setUserVote(null);
      }
      toast.success('Candidate deleted successfully!');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all votes? This cannot be undone.')) {
      return;
    }

    try {
      // Reset all option votes
      const resetPromises = options.map((opt) =>
        updateDoc(doc(db, 'options', opt.id), { votes: 0 })
      );
      await Promise.all(resetPromises);

      // Delete all user votes
      const votesQuery = collection(db, 'userVotes');
      const votesSnapshot = await getDocs(votesQuery);
      const deletePromises = votesSnapshot.docs.map((voteDoc) =>
        deleteDoc(doc(db, 'userVotes', voteDoc.id))
      );
      await Promise.all(deletePromises);

      setOptions((prev) => prev.map((opt) => ({ ...opt, votes: 0 })));
      setHasVoted(false);
      setUserVote(null);
      toast.success('All votes have been reset!');
    } catch (error) {
      console.error('Error resetting votes:', error);
      toast.error('Failed to reset votes');
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