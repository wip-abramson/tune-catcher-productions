const path = require("path")
const fetch = require("node-fetch")

// 1. Define schema for Imprints and Playlists
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type ImprintsJson implements Node {
      title: String
      message: String
      playlist: Playlist
      collection: [CollectionItem!]!
      fields: ImprintFields
    }

    type Playlist {
      spotify: String
      youtube: String
    }

    type CollectionItem {
      title: String
      owners: [String!]!
      image: File @fileByRelativePath
    }

    type ImprintFields {
      filename: String
    }

    type SoundscapesJson implements Node {
      spotify: String
      path: String
      title: String
      description: String
    }

    type SpotifyPlaylist implements Node {
      spotifyId: String
      path: String
      title: String
      description: String
      images: [SpotifyImage]
      tracks: [SpotifyTrack]
    }

    type SpotifyImage {
      url: String
      height: Int
      width: Int
    }

    type SpotifyTrack {
      id: String
      name: String
      artists: [String]
      album: String
      durationMs: Int
      previewUrl: String
      albumImageUrl: String
    }
  `)
}

// 2. Attach filename field for imprints
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "ImprintsJson") {
    const fileNode = getNode(node.parent)
    createNodeField({
      node,
      name: "filename",
      value: fileNode.name,
    })
  }
}

// 3. Fetch Spotify data for soundscapes and create pages for both imprints and soundscapes
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, getNodesByType }) => {
  const { createNode } = actions

  // Spotify API credentials from env
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in environment variables")
    return
  }

  // Get Spotify access token (Client Credentials Flow)
  const authRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!authRes.ok) {
    console.error("Failed to authenticate with Spotify API", await authRes.text())
    return
  }

  const authData = await authRes.json()
  const token = authData.access_token

  // Get all SoundscapesJson nodes (from your JSON files)
  const soundscapeJsonNodes = getNodesByType("SoundscapesJson")

  for (const node of soundscapeJsonNodes) {
    const spotifyId = node.spotify
    const pagePath = node.path

    if (!spotifyId || !pagePath) {
      console.warn(`Skipping soundscape node missing spotify or path: ${node.id}`)
      continue
    }

    // Fetch playlist data from Spotify API
    const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${spotifyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!playlistRes.ok) {
      console.warn(`Failed to fetch Spotify playlist for ID ${spotifyId}: ${playlistRes.statusText}`)
      continue
    }

    const playlistData = await playlistRes.json()

    // Create SpotifyPlaylist node with data
    const playlistNode = {
      id: createNodeId(`spotify-playlist-${pagePath}`),
      parent: null,
      children: [],
      internal: {
        type: "SpotifyPlaylist",
        contentDigest: createContentDigest(playlistData),
      },
      spotifyId,
      path: pagePath,
      title: playlistData.name,
      description: playlistData.description,
      images: playlistData.images,
      tracks: playlistData.tracks.items.map(({ track }) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(a => a.name),
        album: track.album.name,
        durationMs: track.duration_ms,
        previewUrl: track.preview_url,
        albumImageUrl: track.album.images[0]?.url,
      })),
    }

    createNode(playlistNode)
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Imprint pages
  const imprintTemplate = path.resolve("src/templates/imprint.js")
  const imprintResult = await graphql(`
    {
      allImprintsJson {
        nodes {
          fields {
            filename
          }
        }
      }
    }
  `)

  if (imprintResult.errors) {
    throw imprintResult.errors
  }

  imprintResult.data.allImprintsJson.nodes.forEach(node => {
    createPage({
      path: `/imprints/${node.fields.filename}`,
      component: imprintTemplate,
      context: {
        imprint: node.fields.filename,
      },
    })
  })

  // Soundscape pages
  const soundscapeTemplate = path.resolve("src/templates/soundscape.js")
  const soundscapeResult = await graphql(`
    {
      allSpotifyPlaylist {
        nodes {
          path
        }
      }
    }
  `)

  if (soundscapeResult.errors) {
    throw soundscapeResult.errors
  }

  soundscapeResult.data.allSpotifyPlaylist.nodes.forEach(({ path }) => {
    createPage({
      path: `/soundscapes/${path}`,
      component: soundscapeTemplate,
      context: { path },
    })
  })
}
