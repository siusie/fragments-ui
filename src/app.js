// src/app.js

import { Auth, getUser } from './auth';
import { createFragment, getUserFragments } from './api';


async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const form = document.querySelector('#form');

  // for POSTing a new fragment
  async function onSubmit(event) {
  event.preventDefault();
  var data = document.getElementById('data').value;
  console.log(`Form Submitted! Got input: ${data}`);
    await createFragment(user, data);
  }

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  form.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
  
  // Listen for the form submit
  form.addEventListener("submit", onSubmit);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
