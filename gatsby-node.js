const path = require("path")

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type ImprintsJson implements Node {
      title: String
      message: String
      playlist: Playlist
      fields: ImprintFields
    }

    type Playlist {
      spotify: String
      youtube: String
    }

    type ImprintFields {
      filename: String
    }
  `)
}
// Attach the filename to each ImprintsJson node
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "ImprintsJson") {
    const fileNode = getNode(node.parent)
    createNodeField({
      node,
      name: "filename",
      value: fileNode.name, // like-drs, another, etc.
    })
  }
}

// Create pages for each ImprintsJson node
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const imprintTemplate = path.resolve("src/templates/imprint.js")

  const result = await graphql(`
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

  if (result.errors) {
    throw result.errors
  }

  result.data.allImprintsJson.nodes.forEach(node => {
    createPage({
      path: `/imprints/${node.fields.filename}`,
      component: imprintTemplate,
      context: {
        imprint: node.fields.filename,
      },
    })
  })
}
