// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice. We expect a user to have an `idToken` attached,
 * so we can send that along with the request.
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
    return data;
  } catch (err) {
    return err;
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
    return err;
  }
}

export async function getFragmentData(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "GET",
      headers: {
        "Authorization": user.authorizationHeaders().Authorization,
      }
    });
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    return res;
  } catch (err) {
    return err;
  }
}

export async function createFragment(user, fragmentData, contentType) {  
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Authorization": user.authorizationHeaders().Authorization,
      },
      body: fragmentData,
    });
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    return { location: res.headers.get("Location"), data: await res.json() };
  } catch (err) {
    return err;
  }  
}

export async function updateFragmentData(user, id, fragmentData, contentType) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type" : contentType ? contentType : '',
        "Authorization": user.authorizationHeaders().Authorization,
      },
      body: fragmentData,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return {status: res.status};
  } catch (err) {
    return err;
  }
}

export async function deleteFragment(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": user.authorizationHeaders().Authorization,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    return err;
  }
}
