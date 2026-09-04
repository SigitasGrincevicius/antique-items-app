import { Link, useLocation } from "react-router-dom";
import { useCreateCommentMutation, useGetCommentsQuery } from "../../services/api";
import { useAppSelector } from "../../hooks";
import { selectIsAuthenticated } from "../auth/authSlice";
import { ErrorAlert, Skeleton } from "../../components/ui";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import "./comments.css";

export default function CommentsSection({ itemId }: { itemId: string }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const { data: comments = [], isLoading, error } = useGetCommentsQuery(itemId);
  const [createComment, createState] = useCreateCommentMutation();

  const total = comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0);

  const handleCreate = async (content: string) => {
    const result = await createComment({ itemId, body: { content } });
    return !("error" in result);
  };

  return (
    <section className="comments" aria-labelledby="comments-heading">
      <div className="comments-header">
        <h2 id="comments-heading">Discussion</h2>
        <span className="badge badge-neutral">{total}</span>
      </div>

      {isAuthenticated ? (
        <CommentForm
          busy={createState.isLoading}
          error={createState.error}
          onSubmit={handleCreate}
        />
      ) : (
        <div className="alert alert-info">
          <Link to="/login" state={{ from: location.pathname }}>
            Sign in
          </Link>{" "}
          to join the discussion.
        </div>
      )}

      <ErrorAlert error={error} fallback="Comments could not be loaded." />

      {isLoading ? (
        <div className="stack" style={{ marginTop: "1.5rem" }}>
          <Skeleton height="4rem" />
          <Skeleton height="4rem" />
        </div>
      ) : comments.length === 0 ? (
        <p className="muted comments-empty">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} itemId={itemId} canReply />
          ))}
        </ul>
      )}
    </section>
  );
}
