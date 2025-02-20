import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ title: '', content: '', author: '' });
  const [newReply, setNewReply] = useState({ content: '', author: '' });

  // Fetch all topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  // Handle topic creation
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/topics', newTopic);
      setTopics([response.data, ...topics]);
      setNewTopic({ title: '', content: '', author: '' });
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  // Handle reply submission
  const handleAddReply = async (topicId) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/topics/${topicId}/replies`,
        newReply
      );
      const updatedTopics = topics.map((topic) =>
        topic.id === topicId
          ? { ...topic, replies: [...topic.replies, response.data] }
          : topic
      );
      setTopics(updatedTopics);
      setNewReply({ content: '', author: '' });
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="App">
      <h1>Forum</h1>

      {/* Create Topic Form */}
      <form onSubmit={handleCreateTopic}>
        <h2>Create a New Topic</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newTopic.content}
          onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={newTopic.author}
          onChange={(e) => setNewTopic({ ...newTopic, author: e.target.value })}
          required
        />
        <button type="submit">Create Topic</button>
      </form>

      {/* List Topics */}
      <div>
        <h2>Topics</h2>
        {topics.map((topic) => (
          <div key={topic.id} className="topic">
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <p className="author">By: {topic.author}</p>

            {/* List Replies */}
            <div>
              <h4>Replies</h4>
              {topic.replies.map((reply) => (
                <div key={reply.id} className="reply">
                  <p>{reply.content}</p>
                  <p className="author">By: {reply.author}</p>
                </div>
              ))}

              {/* Add Reply Form */}
              <form
                className="add-reply-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddReply(topic.id);
                }}
              >
                <textarea
                  placeholder="Your Reply"
                  value={newReply.content}
                  onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newReply.author}
                  onChange={(e) => setNewReply({ ...newReply, author: e.target.value })}
                  required
                />
                <button type="submit">Add Reply</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;