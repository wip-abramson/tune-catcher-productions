import * as React from "react"
import Layout from "../components/Layout"

export default function SoundscapesPage() {
  return (
    <Layout>
      <div className="text-[#2b2b2b] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-[#4b2e14]">🌊 Soundscapes 🌊</h1>
        <p className="max-w-xl">
          Explore immersive sound journeys curated by the Tune Catcher.
          More coming soon!
        </p>
      </div>
    </Layout>
  )
}
