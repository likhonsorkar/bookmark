import { bookmarkGroups } from '../bookmarks.js'
import { Link } from '../router.jsx'

const accentBorder = {
  purple: 'border-t-brand-purple',
  red: 'border-t-brand-red',
}

function BookmarkCard({ item }) {
  const classes = `text-left bg-white border border-line border-t-4 ${
    accentBorder[item.accent] || accentBorder.purple
  } rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition-transform block w-full`

  const inner = (
    <>
      <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
      <p className="text-sm text-gray-500">{item.description}</p>
    </>
  )

  if (item.type === 'internal') {
    return (
      <Link to={`/${item.view}`} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <a href={item.url} target="_blank" rel="noreferrer" className={classes}>
      {inner}
    </a>
  )
}

export default function Home() {
  return (
    <section>
      <div className="rounded-2xl bg-gradient-to-br from-[#f3e9f5] via-white to-[#fdf3ee] border border-line px-6 py-10 md:px-10 md:py-14">
        <h1 className="text-2xl md:text-3xl leading-snug max-w-[28ch] font-semibold">
          দোকানের দরকারি বুকমার্ক ও টুলস, এক জায়গায়
        </h1>
        <p className="mt-3 text-gray-500 max-w-[60ch] md:text-base">
          বিল চেক করা থেকে শুরু করে রোজকার প্রয়োজনীয় লিংক — সব এখানে সাজানো থাকবে।
        </p>
      </div>

      {bookmarkGroups.map((group) => (
        <div key={group.title} className="mt-9">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((item) => (
              <BookmarkCard key={item.label} item={item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
