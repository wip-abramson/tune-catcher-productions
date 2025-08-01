import * as React from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import SEO from "../components/SEO"

export default function ImprintPage({ data }) {
  const imprint = data.allImprintsJson.nodes[0] || {}

  const hasSpotify = imprint.playlist?.spotify
  const hasYouTube = imprint.playlist?.youtube

  const [activeTab, setActiveTab] = React.useState(
    hasSpotify ? "spotify" : hasYouTube ? "youtube" : null
  )

  if (!imprint.title) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h1 className="text-2xl">Imprint Not Found</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8 text-center bg-[#f3e2c6] min-h-screen">
        <SEO title={imprint.title}/>
        <h1 className="text-4xl font-bold mb-4 text-[#4b2e14]">{imprint.title}</h1>

        <p className="mb-6 text-lg text-[#2b2b2b] max-w-xl mx-auto">
          {imprint.message}
        </p>

        {(hasSpotify && hasYouTube) && (
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setActiveTab("spotify")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "spotify"
                  ? "bg-[#c24b2d] text-white"
                  : "bg-[#e7d8bc] text-[#4b2e14]"
              }`}
            >
              Spotify
            </button>
            <button
              onClick={() => setActiveTab("youtube")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "youtube"
                  ? "bg-[#c24b2d] text-white"
                  : "bg-[#e7d8bc] text-[#4b2e14]"
              }`}
            >
              YouTube
            </button>
          </div>
        )}
        {activeTab === "spotify" && hasSpotify && (
          <iframe data-testid="embed-iframe" style={{borderRadius:"12px"}} src={imprint.playlist.spotify} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        )
        }

        {activeTab === "youtube" && hasYouTube && (
          <iframe
            src={imprint.playlist.youtube}
            width="100%"
            height="380"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="rounded-lg shadow-lg"
          ></iframe>
        )}

        {!hasSpotify && !hasYouTube && (
          <p className="text-[#2b2b2b] mt-6">No playlist available yet.</p>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($imprint: String!) {
    allImprintsJson(filter: { fields: { filename: { eq: $imprint } } }) {
      nodes {
        title
        message
        playlist {
          spotify
          youtube
        }
      }
    }
  }
`
