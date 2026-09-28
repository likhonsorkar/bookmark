export default function InfoGrid({ rows }) {
  const visible = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== '')
  if (visible.length === 0) return null
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
      {visible.map((row) => (
        <div key={row.label}>
          <dt className="text-xs text-gray-500">{row.label}</dt>
          <dd className="mt-0.5 text-[0.92rem]">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
