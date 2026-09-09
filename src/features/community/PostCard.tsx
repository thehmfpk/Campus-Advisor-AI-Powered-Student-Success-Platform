import { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreVertical, Pencil, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, Badge, Button } from '@/components/ui';
import { Card, CardBody } from '@/components/ui';
import { categoryLabel, timeAgo } from './categories';
import {
  useAddComment,
  useComments,
  useDeleteComment,
  useDeletePost,
  useReportPost,
  useToggleLike,
  useUpdatePost,
} from './useCommunity';

/** Renders an image or video from a URL (image files, .mp4/.webm, or YouTube). */
function PostMedia({ url }: { url: string }) {
  const lower = url.toLowerCase();
  const isVideoFile = /\.(mp4|webm|ogg)(\?|$)/.test(lower);
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    return (
      <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-border">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${yt[1]}`}
          title="Post video"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (isVideoFile) {
    return (
      <video src={url} controls className="mt-3 max-h-96 w-full rounded-xl border border-border" />
    );
  }
  return (
    <img
      src={url}
      alt="Post attachment"
      loading="lazy"
      className="mt-3 max-h-96 w-full rounded-xl border border-border object-cover"
    />
  );
}
import { moderatePost } from '@/lib/moderation';
import type { Post } from '@/types/db';

export function PostCard({ post, myProfileId }: { post: Post; myProfileId?: string }) {
  const isDemo = post.id.startsWith('demo-');
  const isOwner = !isDemo && post.author_id === myProfileId;
  const toggleLike = useToggleLike(myProfileId);
  const reportPost = useReportPost(myProfileId);
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const addComment = useAddComment(myProfileId);
  const deleteComment = useDeleteComment();

  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [commentText, setCommentText] = useState('');

  const { data: comments = [] } = useComments(showComments ? post.id : null);

  const saveEdit = async () => {
    const check = moderatePost(editText);
    if (!check.ok) {
      toast.error(check.reason);
      return;
    }
    try {
      await updatePost.mutateAsync({ id: post.id, content: editText });
      setEditing(false);
      toast.success('Post updated.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed.');
    }
  };

  const handleReport = async () => {
    if (isDemo) {
      toast.info('This is a sample post.');
      setMenuOpen(false);
      return;
    }
    try {
      await reportPost.mutateAsync({ postId: post.id, reason: 'Reported by user' });
      toast.success('Reported. Our admins will review it.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not report.');
    }
    setMenuOpen(false);
  };

  const submitComment = async () => {
    if (isDemo) {
      toast.info('This is a sample post. Create your own post to start a discussion.');
      return;
    }
    const check = moderatePost(commentText);
    if (!check.ok) {
      toast.error(check.reason);
      return;
    }
    try {
      await addComment.mutateAsync({ postId: post.id, content: commentText });
      setCommentText('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not comment.');
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={post.author_name} src={post.author_avatar} size={40} />
            <div>
              <p className="text-sm font-semibold text-fg">{post.author_name}</p>
              <p className="text-xs text-muted">
                {post.university_name ?? 'University'}, {timeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">{categoryLabel(post.category)}</Badge>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-muted hover:text-fg"
                aria-label="Post options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-1 w-36 rounded-xl border border-border bg-surface p-1 shadow-card">
                  {isOwner ? (
                    <>
                      <button
                        onClick={() => {
                          setEditing(true);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fg hover:bg-surface-2"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => deletePost.mutate(post.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-danger hover:bg-surface-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleReport}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fg hover:bg-surface-2"
                    >
                      <Flag className="h-3.5 w-3.5" /> Report
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {editing ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface p-3 text-sm text-fg"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} loading={updatePost.isPending}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 whitespace-pre-line text-sm text-fg">{post.content}</p>
        )}

        {post.image_url && <PostMedia url={post.image_url} />}

        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <button
            onClick={() => {
              if (isDemo) {
                toast.info('This is a sample post. Create your own post to interact.');
                return;
              }
              toggleLike.mutate({ postId: post.id, liked: Boolean(post.liked_by_me) });
            }}
            className="flex items-center gap-1.5 transition hover:text-brand"
          >
            <Heart
              className={`h-4 w-4 ${post.liked_by_me ? 'fill-danger text-danger' : ''}`}
            />
            {post.likes_count}
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 transition hover:text-brand"
          >
            <MessageCircle className="h-4 w-4" /> Comments
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-3 border-t border-border pt-3">
            {comments.map((c) => (
              <div key={c.id} className="group flex items-start gap-2">
                <Avatar name={c.author_name} size={28} />
                <div className="rounded-xl bg-surface-2 px-3 py-2">
                  <p className="text-xs font-medium text-fg">{c.author_name}</p>
                  <p className="text-sm text-fg">{c.content}</p>
                </div>
                {c.author_id === myProfileId && (
                  <button
                    onClick={() => deleteComment.mutate({ id: c.id, postId: post.id })}
                    className="mt-1 text-muted opacity-0 transition hover:text-danger group-hover:opacity-100"
                    aria-label="Delete comment"
                    title="Delete your comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-end gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Write a comment…"
                className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
              />
              <Button size="sm" onClick={submitComment} disabled={!commentText.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
