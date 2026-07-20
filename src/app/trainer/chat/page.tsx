'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';
import { trainerApi } from '@/lib/api';

type Thread = { userId: string; name: string; email: string; lastMessage: string; lastAt: string };
type ChatMessage = { id: string; body: string; fromMe: boolean; createdAt: string };
type Conversation = { contact: { id: string; name: string; email: string } | null; messages: ChatMessage[] };

function initials(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatClock(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatThreadTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  if ((now.getTime() - d.getTime()) / 86400000 < 7) {
    return d.toLocaleDateString([], { weekday: 'long' });
  }
  return d.toLocaleDateString();
}

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function loadThreads(autoSelect = false) {
    try {
      const data = await trainerApi.chatThreads();
      const list = Array.isArray(data) ? data : [];
      setThreads(list);
      if (autoSelect && list.length > 0) {
        setSelectedUserId((prev) => prev ?? list[0].userId);
      }
    } catch {
      setThreads([]);
    } finally {
      setLoadingThreads(false);
    }
  }

  useEffect(() => {
    loadThreads(true);
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    let cancelled = false;
    setLoadingMessages(true);
    setConversation(null);
    trainerApi
      .chatMessages(selectedUserId)
      .then((data) => {
        if (cancelled) return;
        setConversation({ contact: data?.contact ?? null, messages: Array.isArray(data?.messages) ? data.messages : [] });
      })
      .catch(() => {
        if (!cancelled) setConversation({ contact: null, messages: [] });
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation?.messages.length]);

  async function handleSend() {
    const text = input.trim();
    if (!text || !selectedUserId || sending) return;
    setSending(true);
    try {
      const msg = await trainerApi.sendChat(selectedUserId, text);
      setConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, msg] } : { contact: null, messages: [msg] },
      );
      setInput('');
      loadThreads(); // refresh lastMessage in the sidebar
    } catch {
      // keep the typed text so the trainer can retry
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedThread = threads.find((t) => t.userId === selectedUserId) ?? null;
  const headerName = conversation?.contact?.name ?? selectedThread?.name ?? '';

  return (
    <div className="gt-rise flex h-[calc(100vh-8rem)] min-h-[520px] flex-col gap-5 md:flex-row">

      {/* Sidebar / Contacts */}
      <div className="gt-card flex h-full w-full flex-col overflow-hidden md:w-80">
        <div className="border-b border-[var(--gt-border)] p-5">
          <h2 className="mb-4 text-lg font-bold text-[var(--gt-text)]">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gt-text-3)]" />
            <input
              type="text"
              placeholder="Search students…"
              className="gt-input pl-10"
            />
          </div>
        </div>
        <div className="gt-scroll flex-1 overflow-y-auto">
          {loadingThreads ? (
            <div className="p-6 text-center text-sm text-[var(--gt-text-2)]">Loading conversations…</div>
          ) : threads.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--gt-text-3)]">No conversations yet</div>
          ) : (
            threads.map((contact) => {
              const active = contact.userId === selectedUserId;
              return (
                <button
                  key={contact.userId}
                  onClick={() => setSelectedUserId(contact.userId)}
                  className={`flex w-full items-center gap-3 border-b border-[var(--gt-border)] border-l-2 p-4 text-left transition-colors ${
                    active
                      ? 'border-l-[var(--gt-accent)] bg-[var(--gt-accent-soft)]'
                      : 'border-l-transparent hover:bg-[var(--gt-surface-2)]'
                  }`}
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gt-accent)] to-[var(--gt-accent-2)] text-sm font-bold text-white">
                      {initials(contact.name)}
                    </div>
                    {active && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--gt-panel)] bg-[var(--gt-success)]" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-bold text-[var(--gt-text)]">{contact.name}</h4>
                      <span className="whitespace-nowrap text-xs text-[var(--gt-text-3)]">{formatThreadTime(contact.lastAt)}</span>
                    </div>
                    <p className="truncate text-xs text-[var(--gt-text-2)]">{contact.lastMessage}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="gt-panel flex h-full flex-1 flex-col overflow-hidden">
        {!selectedUserId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-[var(--gt-text-2)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-text-3)]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <p className="text-sm">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-[var(--gt-border)] p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gt-accent)] to-[var(--gt-accent-2)] text-sm font-bold text-white">
                  {initials(headerName)}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--gt-text)]">{headerName}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-[var(--gt-success)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--gt-success)]" /> Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="gt-scroll flex-1 space-y-5 overflow-y-auto p-6">
              {loadingMessages ? (
                <div className="my-4 text-center text-xs text-[var(--gt-text-3)]">Loading messages…</div>
              ) : !conversation || conversation.messages.length === 0 ? (
                <div className="my-4 text-center text-xs text-[var(--gt-text-3)]">No messages yet</div>
              ) : (
                conversation.messages.map((m) =>
                  m.fromMe ? (
                    <div key={m.id} className="ml-auto flex max-w-[80%] flex-row-reverse items-end gap-3">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--gt-accent)] to-[var(--gt-accent-2)]" />
                      <div className="rounded-2xl rounded-br-sm bg-gradient-to-r from-[var(--gt-accent)] to-[var(--gt-accent-2)] p-3.5 text-sm text-white shadow-[0_8px_22px_-10px_rgba(240,89,31,0.75)]">
                        {m.body}
                      </div>
                      <span className="mb-1 text-[10px] text-[var(--gt-text-3)]">{formatClock(m.createdAt)}</span>
                    </div>
                  ) : (
                    <div key={m.id} className="flex max-w-[80%] items-end gap-3">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)]" />
                      <div className="rounded-2xl rounded-bl-sm border border-[var(--gt-border)] bg-[var(--gt-surface-2)] p-3.5 text-sm text-[var(--gt-text)]">
                        {m.body}
                      </div>
                      <span className="mb-1 text-[10px] text-[var(--gt-text-3)]">{formatClock(m.createdAt)}</span>
                    </div>
                  ),
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[var(--gt-border)] p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  className="gt-input flex-1"
                />
                <button
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="gt-btn gt-btn--primary gt-btn--icon"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
