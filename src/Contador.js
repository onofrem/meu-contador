import React, { useCallback, useEffect, useState } from 'react';
import { changeCounter, getCounter, updateCounterLimits } from './api';

function Contador({ locale, text }) {
  const [counter, setCounter] = useState(null);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadCounter = useCallback(async () => {
    setHasError(false);
    try {
      const result = await getCounter();
      setCounter(result);
      setMinInput(String(result.min));
      setMaxInput(String(result.max));
    } catch {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    loadCounter();
  }, [loadCounter]);

  const runRequest = async (action) => {
    setBusy(true);
    setHasError(false);
    try {
      const result = await action();
      setCounter(result);
      setMinInput(String(result.min));
      setMaxInput(String(result.max));
    } catch {
      if (counter) {
        setMinInput(String(counter.min));
        setMaxInput(String(counter.max));
      }
      setHasError(true);
    } finally {
      setBusy(false);
    }
  };

  const updateLimitInput = (limit, value) => {
    if (limit === 'min') {
      setMinInput(value);
    } else {
      setMaxInput(value);
    }
  };

  const limitsAreValid =
    minInput.trim() !== '' &&
    maxInput.trim() !== '' &&
    Number.isSafeInteger(Number(minInput)) &&
    Number.isSafeInteger(Number(maxInput)) &&
    Number(minInput) < Number(maxInput);

  if (!counter) {
    return (
      <div className="contador-card">
        {hasError ? (
          <div className="api-error" role="alert">
            <p>{text.apiError}</p>
            <button className="btn-reset" type="button" onClick={loadCounter}>
              {text.retry}
            </button>
          </div>
        ) : (
          <p className="api-status" role="status">{text.loading}</p>
        )}
      </div>
    );
  }

  const { count, min, max } = counter;
  const progress = ((count - min) / (max - min)) * 100;
  const formatNumber = (value) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

  return (
    <div className="contador-card">
      <div className="counter-panel">
        <div className="counter-meta">
          <span>{text.currentValue}</span>
          <span className="range-label">{formatNumber(min)} <span aria-hidden="true">—</span> {formatNumber(max)}</span>
        </div>
        <div className="contador-display" aria-live="polite" aria-atomic="true">
          <span key={count} className="count-value">{formatNumber(count)}</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={text.progress}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={count}
        >
          <span className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="contador-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => runRequest(() => changeCounter('decrement'))}
          disabled={busy || count <= min}
          aria-label={text.decrease}
        >
          <span aria-hidden="true">−</span> 1
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => runRequest(() => changeCounter('increment'))}
          disabled={busy || count >= max}
          aria-label={text.increase}
        >
          <span aria-hidden="true">+</span> 1
        </button>
      </div>

      <section className="limits" aria-labelledby="limits-title">
        <div className="limits-heading">
          <div>
            <h2 id="limits-title">{text.limitsTitle}</h2>
            <p>{text.limitsDescription}</p>
          </div>
          <button
            className="btn-reset"
            type="button"
            onClick={() => runRequest(() => changeCounter('reset'))}
            disabled={busy}
          >
            {text.reset}
          </button>
        </div>
        <div className="limit-fields">
          <label className="limit-field">
            <span>{text.minimum}</span>
            <input
              type="number"
              step="1"
              value={minInput}
              onChange={(event) => updateLimitInput('min', event.target.value)}
              aria-label={text.minimum}
              aria-invalid={!limitsAreValid}
              disabled={busy}
            />
          </label>
          <span className="limit-separator" aria-hidden="true">{text.to}</span>
          <label className="limit-field">
            <span>{text.maximum}</span>
            <input
              type="number"
              step="1"
              value={maxInput}
              onChange={(event) => updateLimitInput('max', event.target.value)}
              aria-label={text.maximum}
              aria-invalid={!limitsAreValid}
              disabled={busy}
            />
          </label>
        </div>
        <button
          className="btn btn-primary apply-limits"
          type="button"
          onClick={() =>
            runRequest(() =>
              updateCounterLimits(Number(minInput), Number(maxInput))
            )
          }
          disabled={busy || !limitsAreValid}
        >
          {text.applyLimits}
        </button>
        {!limitsAreValid && (
          <p className="limit-error" role="alert">
            {text.invalidLimits}
          </p>
        )}
        {hasError && <p className="limit-error" role="alert">{text.apiError}</p>}
      </section>
    </div>
  );
}

export default Contador;
