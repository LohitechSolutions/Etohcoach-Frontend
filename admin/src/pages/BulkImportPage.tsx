import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { fb } from '../firebase';
import {
  parseCsvText,
  parseXlsxArrayBuffer,
  runBulkImport,
  type BulkImportValidationError,
} from '../lib/bulkImport';

export function BulkImportPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errors, setErrors] = useState<BulkImportValidationError[]>([]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    setErrors([]);
    const form = e.currentTarget;
    const input = form.elements.namedItem('file') as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      setErrors([{ line: 0, message: 'Choose a .csv or .xlsx file.' }]);
      return;
    }

    setBusy(true);
    try {
      const name = file.name.toLowerCase();
      let numbered;
      if (name.endsWith('.csv')) {
        const text = await file.text();
        numbered = parseCsvText(text);
      } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const buf = await file.arrayBuffer();
        numbered = parseXlsxArrayBuffer(buf);
      } else {
        setErrors([{ line: 0, message: 'Use a .csv, .xls, or .xlsx file.' }]);
        return;
      }

      const outcome = await runBulkImport(fb.db, numbered);
      if (!outcome.ok) {
        setErrors(outcome.errors);
        return;
      }
      setResult(
        `Imported ${outcome.summary.courses} course(s), ${outcome.summary.lessons} lesson(s), ` +
          `${outcome.summary.flashcards} flashcard(s), ${outcome.summary.quizQuestions} quiz question(s).`,
      );
      input.value = '';
    } catch (err) {
      setErrors([
        {
          line: 0,
          message: err instanceof Error ? err.message : 'Import failed.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/courses">Courses</Link>
        <span>/</span>
        <span>Bulk import</span>
      </nav>
      <header className="page-head">
        <div>
          <h1>Bulk import (CSV / XLSX)</h1>
          <p className="muted">
            All rows are validated first. If anything is invalid, nothing is written. Re-import creates new
            documents (no upsert).
          </p>
        </div>
        <a className="button ghost" href="/etoh-coach-bulk-import-demo.csv" download>
          Download demo CSV
        </a>
      </header>

      <form className="card form-grid" onSubmit={(e) => void onSubmit(e)}>
        <label>
          File
          <input name="file" type="file" accept=".csv,.xlsx,.xls" disabled={busy} required />
        </label>
        <p className="muted small">
          Required per row: <code>course_title</code>, <code>category</code> (<code>attract</code> |{' '}
          <code>convince</code> | <code>convert</code>), <code>language</code>, <code>lesson_title</code>, at
          least one <code>flashcard_N</code>, and one <code>question_N</code> with <code>qN_option_a</code>,{' '}
          <code>qN_option_b</code>, … and <code>qN_correct</code> (letter matching an option).
        </p>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={busy}>
            {busy ? 'Importing…' : 'Validate & import'}
          </button>
        </div>
      </form>

      {result ? <p className="pad muted">{result}</p> : null}
      {errors.length > 0 ? (
        <div className="card" role="alert">
          <h2 className="error">Fix these issues</h2>
          <ul className="stack">
            {errors.map((er, i) => (
              <li key={`${er.line}-${i}`}>
                {er.line > 0 ? (
                  <>
                    Row <strong>{er.line}</strong>: {er.message}
                  </>
                ) : (
                  er.message
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
