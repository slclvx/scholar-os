// helpers.js
export const uid = () => crypto.randomUUID();

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const truncate = (str, n) =>
  str?.length > n ? str.slice(0, n) + '…' : (str || '');

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key] ?? 'Other';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

export const sumBy = (arr, key) =>
  arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);

export const pick = (obj, keys) =>
  keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});

export const exportJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJSON = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { resolve(JSON.parse(e.target.result)); }
      catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
