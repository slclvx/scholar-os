import { todayStr } from './dates';

// SM-2 spaced repetition algorithm
// quality: 0 (complete blackout) to 5 (perfect response)
export function sm2(card, quality) {
  let { ease_factor = 2.5, interval_days = 1, review_count = 0 } = card;

  if (quality >= 3) {
    if (review_count === 0) interval_days = 1;
    else if (review_count === 1) interval_days = 6;
    else interval_days = Math.round(interval_days * ease_factor);

    ease_factor = ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    ease_factor = Math.max(1.3, Number(ease_factor.toFixed(2)));
  } else {
    interval_days = 1;
    review_count = 0;
  }

  const next = new Date();
  next.setDate(next.getDate() + interval_days);
  const yr = next.getFullYear();
  const mo = String(next.getMonth()+1).padStart(2,'0');
  const dy = String(next.getDate()).padStart(2,'0');

  return {
    interval_days,
    ease_factor,
    review_count: review_count + 1,
    next_review: `${yr}-${mo}-${dy}`,
  };
}

export function isDue(card) {
  if (!card.next_review) return true;
  return card.next_review <= todayStr();
}

export function getDueCards(cards) {
  return cards.filter(isDue);
}
