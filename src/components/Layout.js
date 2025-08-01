import * as React from "react"
import { Link } from "gatsby"
import logo from "../images/tune-catcher-nobg.png"

export default function Layout({ children }) {
  return (
    <div className="bg-[#f3e2c6] text-[#4b2e14] min-h-screen flex flex-col text-white p-4">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="Tune Catcher" 
            style={{ height: "80px", width: "80px" }}
            className="object-contain"
          />
        </Link>
        <nav>
          <Link to="/soundscapes" className="text-[#4b2e14] hover:text-[#a53e26]">
            Soundscapes
          </Link>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}
