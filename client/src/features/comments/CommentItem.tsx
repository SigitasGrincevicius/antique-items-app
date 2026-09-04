import { useState } from "react";
import type { Comment } from "../../types";
import { useAppSelector } from "../../hooks";
import { selectAuthUser, selectIsAdmin } from "../auth/authSlice";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "../../services/api";
import { Avatar, ConfirmDialog } from "../../components/ui";
import { EditIcon, ReplyIcon, TrashIcon } from "../../components/Icons";
import { formatRelative } from "../../utils/format";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  itemId: string;
  /** Replies can only be one level deep, so nested comments cannot be replied to. */
  canReply: boolean;
}

export default function CommentItem({ comment, itemId, canReply }: CommentItemProps) {
  const authUser = useAppSelector(selectAuthUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isAuthenticated = Boolean(authUser);
  const canModify = Boolean(authUser && (isAdmin || comment.authorId === authUser.sub));

  const [mode, setMode] = useState<"idle" | "reply" | "edit">("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [createComment, createState] = useCreateCommentMutation();
  const [updateComment, updateState] = useUpdateCommentMutation();
  const [deleteComment, deleteState] = useDeleteCommentMutation();

  const authorName = comment.author?.name ?? "Unknown collector";
  const wasEdited = comment.updatedAt !== comment.createdAt;

  const handleReply = async (content: string) => {
    const result = await createComment({ itemId, body: { content, parentCommentId: comment.id } });
    if ("error" in result) return false;
    setMode("idle");
    return true;
  };

  const handleEdit = async (content: string) => {
    const result = await updateComment({ id: comment.id, itemId, content });
    if ("error" in result) return false;
    setMode("idle");
    return true;
  };

  const handleDelete = async () => {
    await deleteComment({ id: comment.id, itemId });
    setConfirmDelete(false);
  };

  return (
    <li className="comment">
      <Avatar name={authorName} size="sm" />
      <div className="comment-main">
        <div className="comment-header">
          <span className="comment-author">{authorName}</span>
          <span className="muted small">
            {formatRelative(comment.createdAt)}
            {wasEdited && " · edited"}
          </span>
        </div>

        {mode === "edit" ? (
          <CommentForm
            initialValue={comment.content}
            submitLabel="Save"
            autoFocus
            busy={updateState.isLoading}
            error={updateState.error}
            onSubmit={handleEdit}
            onCancel={() => setMode("idle")}
          />
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}

        {mode !== "edit" && (
          <div className="comment-actions">
            {canReply && isAuthenticated && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMode("reply")}>
                <ReplyIcon /> Reply
              </button>
            )}
            {canModify && (
              <>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMode("edit")}>
                  <EditIcon /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm comment-delete"
                  onClick={() => setConfirmDelete(true)}
                >
                  <TrashIcon /> Delete
                </button>
              </>
            )}
          </div>
        )}

        {mode === "reply" && (
          <div className="comment-reply-form">
            <CommentForm
              placeholder={`Reply to ${authorName}…`}
              submitLabel="Reply"
              autoFocus
              busy={createState.isLoading}
              error={createState.error}
              onSubmit={handleReply}
              onCancel={() => setMode("idle")}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <ul className="comment-replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} itemId={itemId} canReply={false} />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete comment?"
        message="This comment and any replies to it will be removed."
        busy={deleteState.isLoading}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </li>
  );
}
