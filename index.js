// @ts-nocheck
const postsList = document.querySelector('.posts__list');
const getPostsBtn = document.querySelector('.posts__get-posts');

const postTitle = document.querySelector('.new-post__title');
const postBody = document.querySelector('.new-post__body');
const addNewPost = document.querySelector('.new-post__add');

const state = {
   posts: [],
   newPost: {
      title: '',
      body: ''
   },
   editPost: {}
}

const cleanData = () => {
   state.newPost.title = '';
   state.newPost.body = '';

   postTitle.value = '';
   postBody.value = '';
}

const editPost = (index) => {
   const editeblePost = state.posts[index];
   state.editPost = editeblePost;

   postTitle.value = state.editPost.title;
   postBody.value = state.editPost.body;
}

const deletePost = (index) => {
   const editeblePost = state.posts[index];

   removePostRequest(editeblePost.id);

   state.posts.splice(index, 1);

   fillPostsList(state.posts);
}

const createPost = (post, index) => `
   <div class="post">
      <div class=""post__wrapper>
         <h1 class="wrapper__title">${post.title}</h1>
         <div class="wrapper__body">${post.body}</div>
      </div>

      <div class="post__buttons">
         <button class="buttons__edit" onclick="editPost(${index})">Edit</button>
         <button class="buttons__delete" onclick="deletePost(${index})">Delete</button>
      </div>
   </div>
`

const fillPostsList = (posts) => {
   postsList.innerHTML = "";

   if (posts.length) {
      posts.forEach((post, index) => postsList.innerHTML += createPost(post, index));
   }
}

postTitle.addEventListener('change', (e) => {
   if (!!state.editPost.title) {
      return state.editPost.title = e.target.value;
   }

   return state.newPost.title = e.target.value;
});

postBody.addEventListener('change', (e) => {
   if (!!state.editPost.title) {
      return state.editPost.body = e.target.value;
   }

   return state.newPost.body = e.target.value;
});

addNewPost.addEventListener('click', async () => {
   if (!!state.editPost.title || !!state.editPost.body) {
      await updatePostRequest();
   } else {
      await createPostRequest();
   }
 
   cleanData();
   fillPostsList(state.posts);
})

getPostsBtn.addEventListener('click', async () => {
   await getPostsRequest();
   fillPostsList(state.posts);
})

function getPostsRequest() {
   return fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
      method: 'GET',
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
   })
   .then((res) => res.json())
   .then((posts) => state.posts = state.posts.concat(posts))
}

function createPostRequest() {
   return fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(state.newPost),
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
   })
   .then((res) => res.json())
   .then((post) => state.posts.push(post))
}

function updatePostRequest() {
   return fetch(`https://jsonplaceholder.typicode.com/posts/${state.editPost.id}`, {
      method: 'PUT',
      body: JSON.stringify(state.editPost),
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
   })
   .then((res) => res.json())
   .then((data) => data)
}

function removePostRequest(id) {
   return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
   })
}