import { useState } from "react";

const initialComments = [];

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

// Displays one comment.
function CommentCard({ comment, onLike, onDelete }) {
  return (
    <article className="comment-card">
      <div className="avatar" aria-hidden="true">
        {comment.author.charAt(0).toUpperCase()}
      </div>

      <div className="comment-content">
        <div className="comment-heading">
          <div>
            <h3>{comment.author}</h3>
            <span className="comment-time">{formatTime(comment.createdAt)}</span>
          </div>

          <button
            className="delete-button"
            type="button"
            onClick={() => onDelete(comment.id)}
            aria-label={`Delete comment by ${comment.author}`}
            title="Delete comment"
          >
            Delete
          </button>
        </div>

        <p className="comment-text">{comment.text}</p>

        <button
          className={`like-button ${comment.liked ? "liked" : ""}`}
          type="button"
          onClick={() => onLike(comment.id)}
          aria-pressed={comment.liked}
        >
          {comment.liked ? "♥ Liked" : "♡ Like"}
          <span>{comment.likes}</span>
        </button>
      </div>
    </article>
  );
}


export default function App() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  function handlePost(event) {
    event.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    const comment = {
      id: Date.now(),
      author: "You",
      text,
      likes: 0,
      liked: false,
      createdAt: Date.now()
    };

    setComments((currentComments) => [comment, ...currentComments]);
    setNewComment("");
  }

  function handleLike(id) {
    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (comment.id !== id) return comment;
        const nextLikedState = !comment.liked;
        return {
          ...comment,
          liked: nextLikedState,
          likes: comment.likes + (nextLikedState ? 1 : -1)
        };
      })
    );
  }

  function handleDelete(id) {
    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== id)
    );
  }

  const totalLikes = comments.reduce((total, comment) => total + comment.likes, 0);

  return (
    <main className="page">
      <section className="app">
        <header className="app-header">
          <div>
            <p className="eyebrow">COMMUNITY</p>
            <h1>Comments</h1>
            <p className="subtitle">Share your thoughts and join the conversation.</p>
          </div>
          <div className="comment-count" aria-live="polite">
            <strong>{comments.length}</strong>
            <span>{comments.length === 1 ? "comment" : "comments"}</span>
          </div>
        </header>

        <form className="comment-form" onSubmit={handlePost}>
          <label htmlFor="comment-input">Write a comment</label>
          <textarea
            id="comment-input"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="What would you like to say?"
            rows="3"
            maxLength="280"
          />
          <div className="form-footer">
            <span className="character-count">{newComment.length}/280</span>
            <button className="post-button" type="submit" disabled={!newComment.trim()}>
              Post comment
            </button>
          </div>
        </form>

        <div className="list-heading">
          <h2>Latest comments</h2>
          <span>{totalLikes} {totalLikes === 1 ? "like" : "likes"} total</span>
        </div>

        <section className="comments-list" aria-label="Comments">
          {comments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✎</div>
              <h3>No comments yet</h3>
              <p>Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>
      </section>
      <footer className="page-footer">Made for sharing ideas</footer>
    </main>
  );
}
