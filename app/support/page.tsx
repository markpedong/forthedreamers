'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { LifeBuoy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSupportTicketMutation, useSupportMessageMutation } from '@/services/useMutation';
import { useSupportTicketQuery, useSupportTicketsQuery } from '@/services/useQuery';

const dates = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'ORDER' | 'PRODUCT' | 'SHIPPING' | 'ACCOUNT' | 'OTHER'>('OTHER');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const ticketsQuery = useSupportTicketsQuery(page, status);
  const ticketQuery = useSupportTicketQuery(selectedId);
  const createMutation = useCreateSupportTicketMutation(ticket => {
    setSubject('');
    setMessage('');
    setCreating(false);
    setSelectedId(ticket.id);
  });
  const replyMutation = useSupportMessageMutation(selectedId ?? '', () => setReply(''));
  const data = ticketsQuery.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const createTicket = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate({ subject: subject.trim(), message: message.trim(), category, priority });
  };

  const sendReply = (event: FormEvent) => {
    event.preventDefault();
    if (selectedId) replyMutation.mutate(reply.trim());
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Help center</p>
          <h1 className="mt-2 text-4xl font-light tracking-tight">Support</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create a ticket or continue an existing conversation.</p>
        </div>
        <Button onClick={() => { setCreating(value => !value); setSelectedId(null); }}>
          <Plus className="h-4 w-4" /> New ticket
        </Button>
      </header>

      {creating && (
        <form onSubmit={createTicket} className="mb-8 space-y-4 border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Create a support ticket</h2>
          <Input value={subject} onChange={event => setSubject(event.target.value)} minLength={5} maxLength={200} required placeholder="Subject" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={category} onChange={event => setCategory(event.target.value as typeof category)} aria-label="Ticket category" className="h-9 border border-input bg-background px-3 text-sm">
              <option value="ORDER">Order</option><option value="PRODUCT">Product</option><option value="SHIPPING">Shipping</option><option value="ACCOUNT">Account</option><option value="OTHER">Other</option>
            </select>
            <select value={priority} onChange={event => setPriority(event.target.value as typeof priority)} aria-label="Ticket priority" className="h-9 border border-input bg-background px-3 text-sm">
              <option value="LOW">Low priority</option><option value="MEDIUM">Medium priority</option><option value="HIGH">High priority</option>
            </select>
          </div>
          <Textarea value={message} onChange={event => setMessage(event.target.value)} minLength={10} maxLength={2000} required placeholder="Describe how we can help" className="min-h-32" />
          <div className="flex gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating ticket…' : 'Create ticket'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
        <section className="border border-border bg-card" aria-label="Support tickets">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-medium">Your tickets</h2>
            <select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} aria-label="Ticket status" className="h-8 border border-input bg-background px-2 text-xs">
              <option value="">All statuses</option><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="CLOSED">Closed</option><option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          {ticketsQuery.isLoading ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Loading tickets…</p>
          ) : ticketsQuery.isError ? (
            <div className="space-y-3 p-8 text-center"><p className="text-sm text-destructive">{ticketsQuery.error.message}</p><Button asChild size="sm"><Link href="/sign-in?next=/support">Sign in</Link></Button></div>
          ) : !data?.tickets.length ? (
            <div className="space-y-3 p-8 text-center"><LifeBuoy className="mx-auto h-8 w-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">No support tickets found.</p></div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {data.tickets.map(ticket => (
                  <button key={ticket.id} type="button" onClick={() => { setSelectedId(ticket.id); setCreating(false); }} className={`w-full p-4 text-left hover:bg-muted/60 ${selectedId === ticket.id ? 'bg-muted' : ''}`}>
                    <span className="block font-medium">{ticket.subject}</span>
                    <span className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{ticket.category} · {ticket.status.replace('_', ' ')}</span><span>{dates.format(new Date(ticket.updatedAt))}</span></span>
                  </button>
                ))}
              </div>
              <nav aria-label="Ticket pagination" className="flex items-center justify-between border-t border-border p-3">
                <Button size="sm" variant="outline" disabled={page <= 1 || ticketsQuery.isFetching} onClick={() => setPage(value => value - 1)}>Previous</Button>
                <span className="text-xs text-muted-foreground">{page} / {pages}</span>
                <Button size="sm" variant="outline" disabled={page >= pages || ticketsQuery.isFetching} onClick={() => setPage(value => value + 1)}>Next</Button>
              </nav>
            </>
          )}
        </section>

        <section className="min-h-96 border border-border bg-card" aria-label="Ticket conversation">
          {!selectedId ? (
            <div className="flex min-h-96 items-center justify-center p-8 text-center text-sm text-muted-foreground">Select a ticket to view its conversation.</div>
          ) : ticketQuery.isLoading ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Loading conversation…</p>
          ) : ticketQuery.isError ? (
            <div className="space-y-3 p-8 text-center"><p className="text-sm text-destructive">{ticketQuery.error.message}</p><Button size="sm" variant="outline" onClick={() => void ticketQuery.refetch()}>Try again</Button></div>
          ) : ticketQuery.data ? (
            <div className="flex min-h-96 flex-col">
              <header className="border-b border-border p-5"><h2 className="text-lg font-medium">{ticketQuery.data.subject}</h2><p className="mt-1 text-xs text-muted-foreground">{ticketQuery.data.status.replace('_', ' ')} · {ticketQuery.data.priority} priority</p></header>
              <div className="flex-1 space-y-4 p-5">
                <div className="mr-8 bg-muted p-4"><p className="text-sm">{ticketQuery.data.message}</p><p className="mt-2 text-xs text-muted-foreground">You · {dates.format(new Date(ticketQuery.data.createdAt))}</p></div>
                {ticketQuery.data.messages?.map(item => (
                  <div key={item.id} className={`p-4 ${item.isStaff ? 'ml-8 bg-primary text-primary-foreground' : 'mr-8 bg-muted'}`}>
                    <p className="text-sm">{item.message}</p><p className={`mt-2 text-xs ${item.isStaff ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{item.isStaff ? 'Support' : 'You'} · {dates.format(new Date(item.createdAt))}</p>
                  </div>
                ))}
              </div>
              {!['CLOSED', 'CANCELLED'].includes(ticketQuery.data.status) && (
                <form onSubmit={sendReply} className="space-y-3 border-t border-border p-5">
                  <Textarea value={reply} onChange={event => setReply(event.target.value)} minLength={10} maxLength={2000} required placeholder="Write a reply" />
                  <Button type="submit" disabled={replyMutation.isPending}>
                    {replyMutation.isPending ? 'Sending…' : 'Send message'}
                  </Button>
                </form>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
