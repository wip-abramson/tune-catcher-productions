import * as React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import logo from "../images/tune-catcher-nobg.png"

export default function SEO({ title, description }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `)

  const meta = data.site.siteMetadata

  return (
    <Helmet>
      <title>{title ? `${title} | ${meta.title}` : meta.title}</title>
      <meta name="description" content={description || meta.description} />
      <link rel="icon" href={logo} />
    </Helmet>
  )
}
