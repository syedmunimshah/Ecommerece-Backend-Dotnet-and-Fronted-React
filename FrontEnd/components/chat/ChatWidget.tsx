"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/features/auth/useAuth";
import { useSendChatMessageMutation } from "@/lib/store/api/api";
import type { ChatMessageDto } from "@/lib/types/api";

const GREETING =
  "Hi! I can search the catalogue, check your cart, and look up your orders. What are you after?";

// Sent back to the API each turn — the backend is stateless, like every other endpoint.
// The server trims this again, so this cap is only about request size.
const MAX_HISTORY = 20;

export function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isAuthenticated) return null;

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const history = messages.slice(-MAX_HISTORY);
    setMessages([...messages, { role: "user", content: message }]);
    setInput("");

    try {
      const result = await sendChatMessage({ message, history }).unwrap();
      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: describeError(error) }]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the shopping assistant" : "Open the shopping assistant"}
        className="fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg transition hover:opacity-90 lg:bottom-6 lg:right-6"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-36 right-4 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl lg:bottom-24 lg:right-6"
          >
            <header className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-semibold text-[var(--foreground)]">Shopping assistant</p>
              <Link
                href="/ai-assistant"
                onClick={() => setOpen(false)}
                className="ml-auto text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--foreground)]"
              >
                How to use
              </Link>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              <Bubble role="assistant" content={GREETING} />
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}
              {isLoading && <Bubble role="assistant" content="Thinking…" />}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 border-t border-[var(--border)] p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                placeholder="Ask about a product or an order…"
                className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--search-bg)] px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Say what actually went wrong. "Couldn't reach the assistant" for a server that answered
// perfectly clearly with "not configured" sends people looking for a network problem.
function describeError(error: unknown): string {
  const { status, data } = (error ?? {}) as { status?: number | string; data?: unknown };

  if (status === 503) {
    return typeof data === "string" && data.trim()
      ? data
      : "The assistant is switched off on this server.";
  }
  if (status === 401) return "Your session has expired — please sign in again.";
  if (status === 429) return "Too many messages at once. Give it a few seconds.";

  return "Sorry — I couldn't reach the assistant. Please try again.";
}

function Bubble({ role, content }: ChatMessageDto) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
          isUser
            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
            : "bg-[var(--surface)] text-[var(--foreground)]"
        }`}
      >
        {content}
      </p>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
