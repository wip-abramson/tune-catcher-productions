import * as React from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import bird from "../images/the-tune-catcher.png"

export default function HomePage() {
  return (
    <Layout>
      <SEO title="Home" />
      <div className="text-[#2b2b2b] flex flex-col items-center justify-center text-center p-8">

        <h1 className="text-5xl font-bold mb-4 text-[#4b2e14] text-center leading-tight flex flex-wrap justify-center">
          <span className="px-1">🎶</span>
          <span className="px-2">Tune Catcher Productions</span>
          <span className="px-1">🎶</span>
        </h1>
        <p className="max-w-xl mb-8">
          Catching, curating, and releasing music back into the world. 
          Funky beats, curated playlists, and soundscapes for every journey.
        </p>
        <p>Coming soon: playlists, blogs, vinyl drops & more.</p>
        <img 
          src={bird} 
          alt="The Tune Catcher" 
          className="max-h-[60vh] object-contain mb-8"
        />
      </div>
    </Layout>
  )
}