import * as React from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import ReactMarkdown from "react-markdown"

import ioeLogo from "../images/ioe_vector_red.png"

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
        <SEO title={imprint.title} style={{ height: "80px", width: "80px" }}/>
        <h1 className="text-4xl font-bold mb-4 text-[#4b2e14]">{imprint.title}</h1>
        <div className="flex justify-center"><img src={ioeLogo} alt="Imprint Logo"/></div>

        <div className="mb-6 text-lg text-[#2b2b2b] max-w-xl mx-auto prose prose-lg prose-[#2b2b2b] prose-a:text-[#c24b2d] hover:prose-a:underline">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a className="text-[#c24b2d]" {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >{imprint.message}</ReactMarkdown>
        </div>
        {/* {imprint.message
          .split("\n")
          .filter(p => p.trim() !== "")
          .map((para, idx) => (
            <p key={idx} className="mb-6 text-lg text-[#2b2b2b] max-w-xl mx-auto">{para}</p>
          ))} */}

        {(hasSpotify && hasYouTube) && (
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setActiveTab("spotify")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "spotify" ? "bg-[#c24b2d] text-white" : "bg-[#e7d8bc] text-[#4b2e14]"
              }`}
            >
              Spotify
            </button>
            <button
              onClick={() => setActiveTab("youtube")}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "youtube" ? "bg-[#c24b2d] text-white" : "bg-[#e7d8bc] text-[#4b2e14]"
              }`}
            >
              YouTube
            </button>
          </div>
        )}

        {activeTab === "spotify" && hasSpotify && (
          <iframe
            style={{ borderRadius: "12px" }}
            src={imprint.playlist.spotify}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}

        {activeTab === "youtube" && hasYouTube && (
          <iframe
            src={imprint.playlist.youtube}
            width="100%"
            height="380"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="rounded-lg shadow-lg"
          />
        )}

        {!hasSpotify && !hasYouTube && (
          <p className="text-[#2b2b2b] mt-6">No playlist available yet.</p>
        )}

        {/* Collection grid */}
        {imprint.collection?.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {imprint.collection.map((item, idx) => {
              const img = item.image ? getImage(item.image) : null
              return (
                <div key={idx} className="bg-white rounded-lg shadow-md p-4">
                  {img && (
                    <GatsbyImage
                      image={img}
                      alt={item.title}
                      className="rounded mb-4 w-full object-contain"
                    />
                  )}
                  <h3 className="text-lg font-bold text-[#4b2e14] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#2b2b2b]">Copies: {item.owners.length}</p>
                  {item.owners?.length > 0 && (
                    <p className="text-sm text-[#2b2b2b]">
                      Stewards: {item.owners.join(", ")}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
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
        collection {
          title
          owners
          image {
            childImageSharp {
              gatsbyImageData(
                width: 800
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
  }
`
