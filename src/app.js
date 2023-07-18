// src/app.js

import { Auth, getUser } from './auth';
import { createFragment, getUserFragments, getUserFragmentInfo } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const form = document.querySelector('#form');
  const success = document.querySelector('#success');
  const fragmentsBtn = document.querySelector('#fragments');
  const showFragments = document.querySelector('#show-fragments');
  const create = document.querySelector('#create');

  // event handler for creating a new fragment
  async function onSubmit(event) {
    event.preventDefault();
    const data = document.getElementById('data').value;
    const type = document.getElementById('types').value;
    const res = await createFragment(user, data, type);
    success.hidden = false;
    if (!(res instanceof Error)) {
      return success.innerText = `Fragment created!\n\nFragment ID: ${res.data.fragment.id}\nURL: ${(res.location)}\ntype: ${res.data.fragment.type}\nsize: ${res.data.fragment.size}`;
    }
    return success.innerText = res;
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
  // Show a list of fragment metadata when the 'Fragments' button is clicked
  fragmentsBtn.onclick = async () => {
    showFragments.querySelector('.all').innerText = "";
    const metadata = await getUserFragmentInfo(user);
    form.hidden = true;
    showFragments.hidden = false;
    if (!metadata.fragments.length) {
      return showFragments.querySelector('.all').innerHTML = '<img src="https://media.tumblr.com/tumblr_m1dmtxl6MX1qzzgvbo1_400.gif" alt="tumbleweed"></img>';
    }
    // let test = metadata.fragments;
    let counter = 1;
    
    metadata.fragments.forEach(frag => {
      showFragments.querySelector('.all').innerText += `Fragment ${counter}\nID: ${frag.id}\nOwner ID: ${frag.ownerId}\nCreated at: ${frag.created}\nUpdated at: ${frag.updated}\nType: ${frag.type}\nSize: ${frag.size}\n\n`;
      counter++;
    });
  };
  // Display the 'create fragment' form when the 'Create' button is clicked, and hide the current list of fragments
  create.onclick = () => { 
    form.hidden = false;
    showFragments.hidden = true;
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    fragmentsBtn.disabled = true;
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
