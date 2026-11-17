export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="loader" role="status">
      <div className="loader__d20" />
      <p>{text}</p>
    </div>
  )
}
