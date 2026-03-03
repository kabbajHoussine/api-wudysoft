"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import SimpleBar from "simplebar-react";
import axios from "axios";
import Icon from "@/components/ui/Icon";

const NotificationPage = () => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyingToName, setReplyingToName] = useState("");
  const [newComment, setNewComment] = useState({ name: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get("/api/comments");
      if (res.data.success) {
        const sortedComments = res.data.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setComments(sortedComments);
      } else {
        throw new Error(res.data.message || "Failed to fetch comments");
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setFetchError(err.message || "Could not load notifications.");
      toast.error(`Error fetching comments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, message } = newComment;
    if (!name.trim() || !message.trim()) {
      toast.error("Name and message cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/comments", {
        name: name.trim(),
        message: message.trim(),
        parentId: replyTo || null,
      });
      setNewComment({ name, message: "" });
      setReplyTo(null);
      setReplyingToName("");
      toast.success("Comment posted successfully!");
      fetchComments();
    } catch (err) {
      toast.error("Failed to post comment. Please try again.");
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleReplyClick = (comment) => {
    setReplyTo(comment._id);
    setReplyingToName(comment.name);
    const messageInput = document.getElementById("commentMessageInput");
    if (messageInput) messageInput.focus();
  };

  return {/* ─── Full-width page wrapper ─────────────────────────────────── */}
  (
    <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="colored"
        toastClassName={(o) =>
          `relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer ${
            o?.type === "success"
              ? "bg-emerald-500 text-white"
              : o?.type === "error"
              ? "bg-red-500 text-white"
              : "bg-sky-500 text-white"
          } dark:text-slate-100 text-sm p-3 m-2 rounded-lg shadow-md`
        }
      />

      <Card
        bodyClass="relative p-0 md:p-0 h-full overflow-hidden"
        className="w-full border border-emerald-500/40 dark:border-emerald-600/60 rounded-2xl shadow-xl
                   bg-white/90 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100
                   backdrop-blur-md"
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="px-5 sm:px-8 py-5 border-b border-slate-200 dark:border-slate-700/60
                        bg-gradient-to-r from-teal-50/60 to-emerald-50/40
                        dark:from-teal-900/20 dark:to-emerald-900/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl
                              bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg">
                <Icon icon="ph:bell-duotone" className="text-2xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent
                               bg-gradient-to-r from-teal-500 to-emerald-500 leading-tight">
                  All Notifications
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {comments.length} notification{comments.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={fetchComments}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400
                         hover:text-emerald-700 dark:hover:text-emerald-300 border border-emerald-300
                         dark:border-emerald-700/60 rounded-lg px-3 py-1.5 transition-colors
                         hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
            >
              <Icon icon={loading ? "svg-spinners:ring-resize" : "ph:arrows-clockwise-duotone"} className="text-sm" />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Loading skeleton ─────────────────────────────────────────── */}
        {loading && comments.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 min-h-[320px]">
            <Icon icon="svg-spinners:blocks-shuffle-3" className="text-5xl text-emerald-500 mb-4" />
            <p className="text-base font-medium text-slate-500 dark:text-slate-300">
              Loading Notifications…
            </p>
          </div>
        )}

        {/* ── Fetch error ───────────────────────────────────────────────── */}
        {fetchError && !loading && (
          <div className="flex flex-col items-center justify-center p-16 min-h-[320px]
                          bg-red-50 dark:bg-red-900/20 rounded-b-2xl">
            <Icon icon="ph:warning-octagon-duotone" className="text-5xl text-red-500 mb-4" />
            <p className="text-base font-semibold text-red-700 dark:text-red-300">
              Failed to Load Notifications
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fetchError}</p>
          </div>
        )}

        {/* ── Comment list + form ───────────────────────────────────────── */}
        {(!loading || comments.length > 0) && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}>
            {/* Scrollable comment list */}
            <SimpleBar className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
              {comments.map((item) => (
                <div
                  key={item._id}
                  className="px-5 sm:px-8 py-5 hover:bg-slate-50/70 dark:hover:bg-slate-700/30
                             transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br
                                    from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700
                                    flex items-center justify-center">
                      <Icon icon="mdi:account-circle" className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {item.message}
                      </p>
                      <button
                        onClick={() => handleReplyClick(item)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium
                                   text-emerald-600 hover:text-emerald-700
                                   dark:text-emerald-400 dark:hover:text-emerald-300
                                   hover:underline transition-colors"
                      >
                        <Icon icon="ph:arrow-bend-up-left-duotone" className="text-sm" />
                        Reply
                      </button>

                      {/* Nested replies */}
                      {item.replies?.length > 0 && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-emerald-200/60
                                        dark:border-emerald-800/60 space-y-4">
                          {item.replies.map((reply) => (
                            <div
                              key={reply._id || reply.timestamp}
                              className="flex items-start gap-3"
                            >
                              <div className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center
                                              bg-slate-100 dark:bg-slate-700">
                                <Icon icon="mdi:account-circle" className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap justify-between items-baseline gap-2 mb-0.5">
                                  <span className="font-medium text-xs text-slate-700 dark:text-slate-200 truncate">
                                    {reply.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                                  {reply.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && !loading && !fetchError && (
                <div className="flex flex-col items-center justify-center p-16 text-center
                                text-slate-400 dark:text-slate-500">
                  <Icon icon="ph:chat-circle-dots-duotone" className="text-6xl mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications yet.</p>
                  <p className="text-sm mt-1">Be the first to post a comment!</p>
                </div>
              )}
            </SimpleBar>

            {/* ── Compose form ─────────────────────────────────────────── */}
            <footer className="px-5 sm:px-8 py-5 border-t border-slate-200 dark:border-slate-700/60
                               bg-slate-50/80 dark:bg-slate-800/40">
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Replying-to badge */}
                {replyTo && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg
                                  bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200
                                  dark:border-emerald-700/50 text-xs">
                    <span className="text-slate-600 dark:text-slate-300">
                      Replying to:{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {replyingToName || replyTo}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => { setReplyTo(null); setReplyingToName(""); }}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600
                                 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      <Icon icon="ph:x-circle-duotone" className="text-sm" />
                      Cancel
                    </button>
                  </div>
                )}

                {/* Input row */}
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  {/* Name field */}
                  <div className="w-full sm:w-48 flex-shrink-0">
                    <label
                      htmlFor="commentNameInput"
                      className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide"
                    >
                      Your Name
                    </label>
                    <input
                      id="commentNameInput"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={newComment.name}
                      onChange={(e) =>
                        setNewComment({ ...newComment, name: e.target.value })
                      }
                      className="w-full bg-white dark:bg-slate-700/80 text-slate-900 dark:text-slate-100
                                 border border-slate-300 dark:border-slate-600
                                 rounded-xl px-4 py-2.5 text-sm
                                 placeholder:text-slate-400 dark:placeholder:text-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400/60
                                 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex-1 w-full">
                    <label
                      htmlFor="commentMessageInput"
                      className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide"
                    >
                      {replyTo ? "Your Reply" : "Your Message"}
                    </label>
                    <textarea
                      id="commentMessageInput"
                      placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
                      value={newComment.message}
                      rows={2}
                      onChange={(e) =>
                        setNewComment({ ...newComment, message: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-700/80 text-slate-900 dark:text-slate-100
                                 border border-slate-300 dark:border-slate-600
                                 rounded-xl px-4 py-2.5 text-sm resize-none
                                 placeholder:text-slate-400 dark:placeholder:text-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400/60
                                 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                 bg-gradient-to-r from-emerald-500 to-teal-500
                                 hover:from-emerald-600 hover:to-teal-600
                                 disabled:from-emerald-400/60 disabled:to-teal-400/60
                                 text-white font-semibold text-sm
                                 px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg
                                 active:scale-95 transition-all duration-150
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
                    >
                      {loading ? (
                        <>
                          <Icon icon="svg-spinners:ring-resize" className="text-base" />
                          Posting…
                        </>
                      ) : (
                        <>
                          <Icon icon="ph:paper-plane-tilt-fill" className="text-base" />
                          Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </footer>
          </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationPage;