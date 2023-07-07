// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

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
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

/**
 * Gets the current user's fragments, including metadata.
 */
export async function getUserFragmentInfo(user) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function createFragment(user, fragmentData, contentType) {  
  try {
    if (!fragmentData.replace(/\s/g, '').length) {
      // throw error if the fragment data sent by user contains whitespace (ie. spaces, tabs or line breaks)
      throw new Error('A fragment\'s content can\'t be empty!');
    }
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Authorization": user.authorizationHeaders().Authorization,
      },
      body: fragmentData,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return { location: res.headers.get("Location"), data: await res.json() };
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
    return err;
  }  
}
