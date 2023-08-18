// src/app.js

import { Auth, getUser } from './auth';
import { createFragment, getUserFragmentInfo, getFragmentData, updateFragmentData, deleteFragment } from './api';

const getContentType = (extension) => {
  switch (extension.toLowerCase()) {
    case 'md':
      return 'text/markdown';
    case 'html':
      return 'text/html';
    case 'txt':
      return 'text/plain';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
}}

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
  const searchBtn = document.querySelector('#search');
  const searchFragments = document.querySelector('#search-fragments');
  const editBtn = document.querySelector('#edit');
  const deleteBtn = document.querySelector('#delete');
  let searchInput = document.querySelector('#url'); // for storing the url entered into the search bar   

  // event handler for creating a new fragment
  async function onSubmit(event) {
    event.preventDefault();
    const type = document.getElementById('types').value;    
    success.hidden = false;
    let res;

    const extension = (document.querySelector('input').files[0].name).split('.')[1];

    // Need this `if` path to check if the uploaded file is text/markdown, since the
    // `.md` extension is not recognized by the File: type property
    if (extension === 'md' && type === 'text/markdown') {
      res = await createFragment(user, document.querySelector('input').files[0], type);
    }

    // Generate an appropriate response if the file type
    // doesn't match what was selected from the drop-down menu
    else if (document.querySelector('input').files[0].type !== type) {
      return success.innerText = `Please select the correct media type associated with this file.`
    }
    
    else res = await createFragment(user, document.querySelector('input').files[0], type);

    if (!(res instanceof Error)) {
      return success.innerText = `Fragment created!\n\nFragment ID: ${res.data.fragment.id}\nFragment type: ${res.data.fragment.type}\nFragment size: ${res.data.fragment.size} bytes`;
    }
    return success.innerText = `Unable to create fragment. Please ensure that the file is not empty and the selected type matches the extension. [${res}]`;
  }

  // Event handler for searching a fragment
  async function requestSearch(event) {
    event.preventDefault();    
    if (!searchInput.value.toString().replace(/\s/g, '').length)
    {
     document.querySelector('#result').hidden = false;
     return document.querySelector('#result').innerText = 'Invalid URL';
    }
    try
    {
      const fragmentData = await getFragmentData(user, searchInput.value);
      document.querySelector('#result').hidden = false;

      // If the requested fragment is an image, `fragmentData` will contain an URI
      const response = (await (fragmentData.text())).split('"');

      if (response.includes('dataURL')) {
        document.querySelector('#update-delete').hidden = false;
        editBtn.disabled = false;
        deleteBtn.disabled = false;
        const dataUrlIndex = response.length - 2;
        return document.querySelector('#result').innerHTML = `<img src="${response[dataUrlIndex]}">`;
      }

      // If retrieving a non-image fragment's contents, `response` will be an array with 1 element:
      // the fragment's data
      document.querySelector('#update-delete').hidden = false;
      document.querySelector('#edit-form').hidden = true;
      editBtn.disabled = false;
      deleteBtn.disabled = false;
      return document.querySelector('#result').innerText = response.join('"');
    }
    catch(err)    
    {
      // Clear the previously submitted URL; now ready for the next 'submit' event
      searchInput.value = "";
      document.querySelector('#update-delete').hidden = true;

      // For any errors thrown during the GET operation
      document.querySelector('#edit-form').hidden = true;
      return document.querySelector('#result').innerText = 'Error retrieving fragment. It may not exist, or the ID/extension may be invalid.';
    }
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

  // Display a list of fragment metadata when the 'Fragments' button is clicked
  fragmentsBtn.onclick = async () => {
    searchFragments.hidden = true;
    showFragments.hidden = false;
    document.querySelector('#edit').hidden = true;
    document.querySelector('#delete').hidden = true;
    document.querySelector('#result').hidden = true;
    document.querySelector('#update-delete').hidden = true;
    document.querySelector('#edit-form').hidden = true;
    showFragments.querySelector('.all').innerText = "";
    
    const metadata = await getUserFragmentInfo(user);
    form.hidden = true;

    if (metadata.status === 'ok')
    {
      // The returned array is empty -> display appropriate message
      if (!metadata.fragments.length) {
        return showFragments.querySelector('.all').innerHTML = '<img src="https://media.tumblr.com/tumblr_m1dmtxl6MX1qzzgvbo1_400.gif" alt="tumbleweed"></img>';
      }

      // Otherwise, display each fragment and its metadata, making sure to number each
      let counter = 1;
      
      metadata.fragments.forEach(frag => {
        showFragments.querySelector('.all').innerText += `Fragment ${counter}\nID: ${frag.id}\nOwner ID: ${frag.ownerId}\nCreated at: ${frag.created}\nUpdated at: ${frag.updated}\nContent-Type: ${frag.type}\nSize: ${frag.size} bytes\n\n`;
        counter++;
      });
      return;
    }
    return showFragments.querySelector('.all').innerText = 'Unable to retrieve fragments.\n'
  };

  // Display the 'create fragment' form when the 'Create' button is clicked, and hide the current list of fragments
  create.onclick = () => { 
    form.hidden = false;
    showFragments.hidden = true;
    searchFragments.hidden = true;
    document.querySelector('#edit').hidden = true;
    document.querySelector('#delete').hidden = true;
    document.querySelector('#result').hidden = true;
    document.querySelector('#update-delete').hidden = true;
    document.querySelector('#edit-form').hidden = true;
  };

  // Looking up a fragment - display the search bar
  searchBtn.onclick = () => { 
    showFragments.hidden = true;
    form.hidden = true;
    searchFragments.hidden = false;
  };

  // Pressing the 'Edit' button
  editBtn.onclick = () => {
    document.querySelector('#edit-form').hidden = false;
  };
  document.querySelector('#edit-form').addEventListener("submit", requestUpdate);

  // Editing a fragment's content
  async function requestUpdate(event) { 
    event.preventDefault();

    // Need to get the file extension because the '.md' isn't being read as 'text/markdown', causing
    // the content-type header to not be set properly in the PUT request. 
    // The fix (for now): explicitly set the content type and pass it to updateFragmentData
    const extension = (document.querySelector('#input-file').files[0].name).split('.')[1];  // get file extension
    const contentType = getContentType(extension);
      
    const res = await updateFragmentData(user, searchInput.value, document.querySelector('#input-file').files[0], contentType);

    // Updating a fragment's contents successfully will result in a 'fragment' object in response
    if (await res.status === 200) {
      // Make another call to getFragmentData to retrieve the updated contents
      const fragmentData = await getFragmentData(user, searchInput.value);
      const response = (await (fragmentData.text())).split('"');
      editBtn.disabled = false;
      deleteBtn.disabled = false;
      
      if (response.includes('dataURL')) {
        const dataUrlIndex = response.length - 2;
        return document.querySelector('#result').innerHTML = `<img src="${response[dataUrlIndex]}">`;
      }

      return document.querySelector('#result').innerText = response.join('"');
    }
    
    return document.querySelector('#result').innerText = 'Unable to update fragment. Please ensure that the file is not empty and that the content-types match.\n';
  }

  // Pressing the 'Delete' button
  deleteBtn.onclick = async () => { 
    if (!searchInput.value.toString().replace(/\s/g, '').length)
    {
     return document.querySelector('#result').innerText = 'Error';
    }
    const res = await deleteFragment(user, searchInput.value);
    if (res.status !== 'error')
    {
      deleteBtn.disabled = true;
      editBtn.disabled = true;
      document.querySelector('#edit-form').hidden = true;
      return document.querySelector('#result').innerText = 'Fragment deleted.'
    }
    return document.querySelector('#result').innerText = 'Error deleting fragment.\n';    
  };


  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    fragmentsBtn.disabled = true;
    searchBtn.disabled = true;
    return;
  }

  // Update the UI to welcome the user
  userSection.hidden = false;

  form.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  // getUserFragments(user);
  
  // Listen for the form submit
  form.addEventListener("submit", onSubmit);    
  searchFragments.addEventListener("submit", requestSearch);  

}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
