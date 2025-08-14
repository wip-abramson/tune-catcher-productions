/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Tune Catcher Productions`,
    description: `Catching, curating, and releasing music back into the world.`,
    siteUrl: `https://tunecatcherproductions.com`,
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tune Catcher Productions`,
        short_name: `Tune Catcher`,
        start_url: `/`,
        background_color: `#f3e2c6`,
        theme_color: `#c24b2d`,
        display: `minimal-ui`,
        icon: `src/images/tune-catcher-nobg.png`, // Path to your logo
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `imprints`,
        path: `${__dirname}/src/data/imprints`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `soundscapes`,
        path: `${__dirname}/src/data/soundscapes/`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
  ],
}
