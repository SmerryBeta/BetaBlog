const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { meta: {}, body: raw }
  const meta = {}
  m[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  })
  return { meta, body: raw.slice(m[0].length) }
}

export default Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontMatter(raw)
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      tags: (meta.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
      body,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))
