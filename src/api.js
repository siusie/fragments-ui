// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log(`Requesting user fragments data from ${apiUrl}/v1/fragments`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function createFragment(user, fragmentData) {
  // console.log(`user.authorizationHeaders(): ${JSON.stringify(user.authorizationHeaders(), null, 4)}`);
  
  try {
    // console.log(`POST: ${apiUrl}/v1/fragments`);
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        "Authorization": user.authorizationHeaders().Authorization,
      },
      body: fragmentData,
    });
    const data = await res.json();
    console.log(`POST response: ${JSON.stringify(data, null, 4)}`);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
  }  
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });    
  }
  
}