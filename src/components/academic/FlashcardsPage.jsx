import { useState } from 'react';
import { useAcademic } from '../../store/useAppStore';
import { sm2, getDueCards } from '../../utils/spacedRepetition';
import { todayStr } from '../../utils/dates';
import { Modal, FormField, Input, Textarea, Btn, IconBtn, SectionHeader, Empty, Card, ProgressBar } from '../shared/UI';

export default function FlashcardsPage() {
  const { flashcardDecks, flashcards, addDeck, deleteDeck, addFlashcard, updateFlashcard, deleteFlashcard } = useAcademic();
  const [view, setView] = useState('decks'); // decks | deck | review
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [deckForm, setDeckForm] = useState(null);
  const [cardForm, setCardForm] = useState(null);
  const [reviewState, setReviewState] = useState({ idx: 0, flipped: false, complete: false });

  const activeDeck = flashcardDecks.find((d) => d.id === activeDeckId);
  const deckCards = flashcards.filter((f) => f.deckId === activeDeckId);
  const dueCards = getDueCards(deckCards);

  const startReview = () => {
    if (dueCards.length === 0) return;
    setReviewState({ idx: 0, flipped: false, complete: false });
    setView('review');
  };

  const rate = (quality) => {
    const card = dueCards[reviewState.idx];
    const updates = sm2(card, quality);
    updateFlashcard(card.id, updates);
    const nextIdx = reviewState.idx + 1;
    if (nextIdx >= dueCards.length) {
      setReviewState({ ...reviewState, complete: true });
    } else {
      setReviewState({ idx: nextIdx, flipped: false, complete: false });
    }
  };

  if (view === 'review') {
    if (reviewState.complete) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Review Complete!</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Reviewed {dueCards.length} cards</p>
          <Btn onClick={() => setView('deck')}>Back to Deck</Btn>
        </div>
      );
    }
    const card = dueCards[reviewState.idx];
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Btn variant="ghost" onClick={() => setView('deck')}>← Back</Btn>
          <span style={{ fontSize: 13, color: '#64748b' }}>{reviewState.idx + 1} / {dueCards.length}</span>
        </div>
        <ProgressBar value={reviewState.idx} max={dueCards.length} />
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div
            onClick={() => setReviewState({ ...reviewState, flipped: !reviewState.flipped })}
            style={{
              width: '100%', maxWidth: 600, minHeight: 220,
              background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)',
              borderRadius: 16, padding: 40, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .2s', gap: 12,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#475569', textTransform: 'uppercase' }}>
              {reviewState.flipped ? 'Answer' : 'Question'}
            </div>
            <div style={{ fontSize: 18, color: '#f1f5f9', textAlign: 'center', lineHeight: 1.6, fontWeight: reviewState.flipped ? 400 : 600 }}>
              {reviewState.flipped ? card.back : card.front}
            </div>
            {!reviewState.flipped && (
              <div style={{ fontSize: 12, color: '#374151', marginTop: 8 }}>Tap to reveal answer</div>
            )}
          </div>
          {reviewState.flipped && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { q: 0, label: '😰 Blackout', color: '#ef4444' },
                { q: 2, label: '😕 Hard', color: '#f97316' },
                { q: 3, label: '🙂 Good', color: '#eab308' },
                { q: 5, label: '😊 Easy', color: '#22c55e' },
              ].map(({ q, label, color }) => (
                <button key={q} onClick={() => rate(q)} style={{
                  padding: '10px 20px', borderRadius: 10, border: `1px solid ${color}44`,
                  background: `${color}11`, color, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'deck' && activeDeck) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <button onClick={() => setView('decks')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: '0 0 8px', display: 'block' }}>← All Decks</button>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{activeDeck.name}</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{deckCards.length} cards · {dueCards.length} due</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" onClick={() => setCardForm({ front: '', back: '', deckId: activeDeckId, _new: true })}>+ Card</Btn>
            {dueCards.length > 0 && <Btn onClick={startReview}>📖 Review ({dueCards.length})</Btn>}
          </div>
        </div>
        {deckCards.length === 0 ? (
          <Empty icon="🃏" text="No cards yet" action={() => setCardForm({ front: '', back: '', deckId: activeDeckId, _new: true })} actionLabel="+ Add Card" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {deckCards.map((c) => (
              <Card key={c.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                  <IconBtn onClick={() => setCardForm({ ...c })}>✏️</IconBtn>
                  <IconBtn danger onClick={() => deleteFlashcard(c.id)}>🗑</IconBtn>
                </div>
                <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Front</div>
                <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, marginBottom: 12 }}>{c.front}</div>
                <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Back</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{c.back}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: '#374151' }}>Next review: {c.next_review}</div>
              </Card>
            ))}
          </div>
        )}
        {cardForm && (
          <Modal title={cardForm._new ? 'New Card' : 'Edit Card'} onClose={() => setCardForm(null)}>
            <FormField label="Front (Question)"><Textarea rows={3} value={cardForm.front} onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })} autoFocus /></FormField>
            <FormField label="Back (Answer)"><Textarea rows={3} value={cardForm.back} onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })} /></FormField>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Btn onClick={() => {
                if (!cardForm.front.trim()) return;
                if (cardForm._new) { const { _new, ...d } = cardForm; addFlashcard(d); }
                else updateFlashcard(cardForm.id, cardForm);
                setCardForm(null);
              }} style={{ flex: 1 }}>Save</Btn>
              <Btn variant="ghost" onClick={() => setCardForm(null)}>Cancel</Btn>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // Decks view
  return (
    <div>
      <SectionHeader
        title="Flashcards"
        subtitle="Spaced repetition study system"
        action={<Btn onClick={() => setDeckForm({ name: '', subject: '', _new: true })}>+ New Deck</Btn>}
      />
      {flashcardDecks.length === 0 ? (
        <Empty icon="🃏" text="No decks yet — create your first study deck!" action={() => setDeckForm({ name: '', subject: '', _new: true })} actionLabel="+ Create Deck" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {flashcardDecks.map((d) => {
            const cards = flashcards.filter((f) => f.deckId === d.id);
            const due = getDueCards(cards).length;
            return (
              <div
                key={d.id}
                onClick={() => { setActiveDeckId(d.id); setView('deck'); }}
                style={{ background: 'hsl(222,47%,8%)', border: '1px solid hsl(217,33%,15%)', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border-color .15s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(217,33%,15%)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>🃏</span>
                  <IconBtn danger onClick={(e) => { e.stopPropagation(); deleteDeck(d.id); }}>🗑</IconBtn>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{d.name}</div>
                {d.subject && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{d.subject}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{cards.length} cards</span>
                  {due > 0 && <span style={{ fontSize: 12, color: '#f97316', fontWeight: 700 }}>🔔 {due} due</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {deckForm && (
        <Modal title="New Deck" onClose={() => setDeckForm(null)}>
          <FormField label="Deck Name"><Input value={deckForm.name} onChange={(e) => setDeckForm({ ...deckForm, name: e.target.value })} autoFocus /></FormField>
          <FormField label="Subject"><Input value={deckForm.subject} onChange={(e) => setDeckForm({ ...deckForm, subject: e.target.value })} placeholder="e.g. AP Biology, Calculus..." /></FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Btn onClick={() => {
              if (!deckForm.name.trim()) return;
              const { _new, ...d } = deckForm; addDeck(d); setDeckForm(null);
            }} style={{ flex: 1 }}>Create Deck</Btn>
            <Btn variant="ghost" onClick={() => setDeckForm(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
