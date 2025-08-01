function parseCookies(request) {
  const cookieHeader = request.headers.get("cookie") || ""
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim().split("="))
      .filter(([k, v]) => k && v)
  )
}

export default async (request, context) => {
  const url = new URL(request.url)
  
  // Skip assets
  const assetExtensions = [".css", ".js", ".png", ".ico", ".svg", ".json", ".webmanifest", ".woff2"]
  if (assetExtensions.some(ext => url.pathname.endsWith(ext))) {
    return context.next()
  }
  
  // Only protect /imprints/*
  if (!url.pathname.startsWith("/imprints/")) {
    return context.next()
  }
  
  const imprintName = url.pathname.split("/")[2]  // e.g. "like-drs"
  if (!imprintName) {
    return context.next()  // or redirect / show 404
  }
  
  const requestCookies = parseCookies(request)
  const keyFromQuery = url.searchParams.get("key")
  const keyFromCookie = requestCookies && requestCookies[`imprint_key_${imprintName}`]
  

  const expectedKeyIdentifier = `IMPRINT_KEY_${imprintName.toUpperCase().replace(/-/g, "_")}`
  console.log(`Checking key for imprint: ${imprintName}, expected key identifier: ${expectedKeyIdentifier}`)
  const expectedKey = Deno.env.get(expectedKeyIdentifier)

  console.log(`Expected key: ${expectedKey}, Key from query: ${keyFromQuery}, Key from cookie: ${keyFromCookie}`)
  
  // If no expected key set in env, allow access (optional)
  if (!expectedKey) {
    return context.next()
  }
  
  // Check if key matches either query or cookie
  if (keyFromQuery !== expectedKey && keyFromCookie !== expectedKey) {
    return Response.redirect(`/`, 302)
  }
  
  // If key from query, set cookie and redirect to clean URL without ?key= param
  if (keyFromQuery === expectedKey) {
    const cleanUrl = `${url.origin}${url.pathname}`
    const headers = new Headers()
    headers.set(
      "Set-Cookie",
      `imprint_key_${imprintName}=${keyFromQuery}; Path=/imprints/${imprintName}; Max-Age=2592000; SameSite=Lax`
    )
    headers.set("Location", cleanUrl)
    return new Response(null, { status: 302, headers })
  }
  
  // Authorized - proceed to page
  return context.next()
}
