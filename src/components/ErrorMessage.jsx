export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error">
      <p>⚠️ {message}</p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
