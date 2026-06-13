export default function ErrorBanner({ error }: { error: string }) {
  return (
    <div className="card border-rel-critical/30 p-7 text-center max-w-lg mx-auto mt-10" role="alert">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-rel-critical/12 text-2xl text-rel-critical">!</div>
      <p className="text-rel-critical font-display font-bold text-lg mb-1">Couldn’t load the data</p>
      <p className="text-ink-soft text-sm">{error}</p>
      <p className="text-ink-faint text-xs mt-4">
        Run the pipeline first:
        <code className="mt-2 block font-mono bg-surface-sunken px-3 py-2 rounded-lg text-ink">
          cd pipeline &amp;&amp; python seed_demo.py &amp;&amp; python ingest.py &amp;&amp; python build_json.py
        </code>
      </p>
    </div>
  )
}
