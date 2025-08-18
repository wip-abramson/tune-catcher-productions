import * as React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import { graphql } from "gatsby"
import ReactMarkdown from "react-markdown"

// ---- Helpers (JS only) ----
function spotifyEmbedUrl(input) {
  if (!input) return null
  if (/^https?:\/\//.test(input)) return input
  const s = String(input)
  const urlMatch = s.match(/playlist\/([a-zA-Z0-9]+)(?:\?|$)/)
  const uriMatch = s.match(/spotify:playlist:([a-zA-Z0-9]+)/)
  const id = (urlMatch && urlMatch[1]) || (uriMatch && uriMatch[1]) || s
  return `https://open.spotify.com/embed/playlist/${id}`
}

function youtubeEmbedUrl(input) {
  if (!input) return null
  if (/^https?:\/\//.test(input)) {
    try {
      const u = new URL(input)
      const list = u.searchParams.get("list")
      if (list) return `https://www.youtube.com/embed/videoseries?list=${list}`
      return input
    } catch {
      return input
    }
  }
  return `https://www.youtube.com/embed/videoseries?list=${String(input)}`
}

// ---- Card ----
function SoundscapeCard({ s }) {
  const spotifySrc = spotifyEmbedUrl(s?.playlist?.spotify)
  const youtubeSrc = youtubeEmbedUrl(s?.playlist?.youtube)

  const hasSpotify = Boolean(spotifySrc)
  const hasYouTube = Boolean(youtubeSrc)

  const [activeTab, setActiveTab] = React.useState(
    hasSpotify ? "spotify" : hasYouTube ? "youtube" : null
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-left">
      <h3 className="text-lg font-bold text-[#4b2e14] mb-2">
        {s?.title || "Untitled Soundscape"}
      </h3>


      {s?.description ? <p className="mb-4 text-[#4b2e14]">{s.description}</p> : null}

      {hasSpotify && hasYouTube ? (
        <div className="flex mb-4 space-x-4">
          <button
            onClick={() => setActiveTab("spotify")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "spotify" ? "bg-[#c24b2d] text-white" : "bg-[#e7d8bc] text-[#4b2e14]"
            }`}
            type="button"
          >
            Spotify
          </button>
          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "youtube" ? "bg-[#c24b2d] text-white" : "bg-[#e7d8bc] text-[#4b2e14]"
            }`}
            type="button"
          >
            YouTube
          </button>
        </div>
      ) : null}

      {activeTab === "spotify" && hasSpotify && (
        <iframe
          style={{ borderRadius: "12px" }}
          src={spotifySrc}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${s?.title || "Soundscape"} — Spotify`}
        />
      )}

      {activeTab === "youtube" && hasYouTube && (
        <iframe
          src={youtubeSrc}
          width="100%"
          height="380"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="rounded-lg shadow-lg"
          loading="lazy"
          title={`${s?.title || "Soundscape"} — YouTube`}
        />
      )}

      {!hasSpotify && !hasYouTube && (
        <p className="text-[#2b2b2b] mt-2">No playlist available yet.</p>
      )}
    </div>
  )
}

// ---- Page ----
export default function SoundscapesPage({ data }) {
  const soundscapes = data?.allSoundscapesJson?.nodes || []

  return (
    <Layout>
      <div className="p-8 text-center bg-[#f3e2c6] min-h-screen">
        <SEO title="Soundscapes" />
        <h1 className="text-4xl font-bold mb-4 text-[#4b2e14]">🌊 Soundscapes 🌊</h1>

        <p className="mb-6 text-lg text-[#2b2b2b] max-w-xl mx-auto prose prose-lg prose-[#2b2b2b]">
          Explore immersive sound journeys curated with love by the Tune Catcher.
        </p>

        {soundscapes.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {soundscapes.map((s, idx) => (
              <SoundscapeCard key={s?.path || s?.title || idx} s={s} />
            ))}
          </div>
        ) : (
          <p className="text-[#2b2b2b] mt-6">More coming soon!</p>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query SoundscapesPageQuery {
    allSoundscapesJson(sort: { path: DESC }) {
      nodes {
        path
        title
        description
        playlist {
          spotify
          youtube
        }
      }
    }
  }
`
