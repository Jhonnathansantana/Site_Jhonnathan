import { useEffect, useRef, useState } from 'react';
import type { Pagefind, PagefindSearchFragment, PagefindSearchOptions, PagefindSearchResult } from '../types/pagefind';

const UI_TRANSLATIONS = {
  placeholder: 'Buscar artículos...',
  clear: 'Limpiar búsqueda',
  loading: 'Cargando buscador...',
  noResults: 'No se encontraron resultados.',
  resultsCount: (count: number) => `${count} resultado${count === 1 ? '' : 's'}`,
};

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [pagefind, setPagefind] = useState<Pagefind | null>(null);
  const [results, setResults] = useState<PagefindSearchFragment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // @ts-expect-error Pagefind bundle is generated post-build; not resolvable at build time.
        const pagefindModule: Pagefind = await import('/pagefind/pagefind.js');
        if (cancelled) return;
        await pagefindModule.init?.();
        setPagefind(pagefindModule);
      } catch (err) {
        if (!cancelled) {
          setError('No se pudo cargar el buscador.');
          // eslint-disable-next-line no-console
          console.error('Pagefind init error:', err);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pagefind || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const searchOptions: PagefindSearchOptions = {};
        const response = await pagefind.search(query, searchOptions);

        if (!response?.results?.length) {
          setResults([]);
          return;
        }

        const fragments = await Promise.all(
          response.results.map(async (result: PagefindSearchResult) => {
            const data = await result.data();
            return data;
          })
        );

        setResults(fragments.filter(Boolean));
      } catch (err) {
        setError('Error al buscar.');
        // eslint-disable-next-line no-console
        console.error('Pagefind search error:', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(id);
  }, [query, pagefind]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <label htmlFor="blog-search" className="sr-only">
          Buscar artículos
        </label>
        <input
          ref={inputRef}
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={UI_TRANSLATIONS.placeholder}
          autoComplete="off"
          spellCheck="false"
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={UI_TRANSLATIONS.clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {!pagefind && UI_TRANSLATIONS.loading}
      </div>

      {query.trim().length >= 2 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {UI_TRANSLATIONS.noResults}
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-2">
              {results.map((result, index) => (
                <li key={result.url || index}>
                  <a
                    href={result.url}
                    className="block px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <p
                      className="text-sm font-medium text-slate-900 dark:text-slate-100"
                      dangerouslySetInnerHTML={{ __html: result.meta?.title || result.title || 'Sin título' }}
                    />
                    <div
                      className="mt-1 text-sm text-slate-600 dark:text-slate-400"
                      dangerouslySetInnerHTML={{ __html: result.excerpt || '' }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && !loading && (
            <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {UI_TRANSLATIONS.resultsCount(results.length)}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
