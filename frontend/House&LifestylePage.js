document.addEventListener('DOMContentLoaded', async() => {
  const username = localStorage.getItem('username');
  const response=await fetch('http://localhost:4000/api/posts');
  const posts=await response.json();
  const container = document.getElementById('posts'); 
  posts.forEach((post) => {
      if(post.category=="House & Lifestyle"){
          if (post.author==username)
              renderUserPost(post,container)
          else
              renderPost(post,container)
      }
  });
});
async function renderPost(post, container) {
  const postElement = document.createElement('article');
  postElement.classList.add('post');
  postElement.setAttribute('data-post-id', post.postID);
  postElement.innerHTML =
  `
    <h2>${post.title}</h2>
    <p>${post.content}</p>
    <p><strong>Posted by ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
    <p><strong>Category:</strong>${post.category}</p>
    <section id="comments-${post.postID}">
      <div class="comment-list"><!-- Container for comments -->
        <!--commentairat bach yatzadou lahni bl js-->
      </div>  
      <form class="add-comment" data-cmnt-id="${post.postID}">
        <textarea class="comment-content" placeholder="Your comment here" required></textarea>
        <button type="submit">Add Comment</button>
      </form>
    </section>
  `;
  const commentForm = postElement.querySelector('.add-comment');
  commentForm.addEventListener('submit', handleCommentSubmit);
  container.appendChild(postElement);
  fetchComments(post.postID, postElement);
}
async function renderUserPost(post, container) {
  const postElement = document.createElement('article');
  postElement.classList.add('post');
  postElement.setAttribute('data-post-id', post.postID);
  postElement.innerHTML =
  `
      <form class="del-post" data-post-id="${post.postID}">
          <button type="submit"><i class="fas fa-trash-alt"></i></i></button>
      </form>
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p><strong>Posted by ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
      <p><strong>Category:</strong>${post.category}</p>
      <section id="comments-${post.postID}">
      <div class="comment-list"><!-- Container for comments -->
          <!--commentairat bach yatzadou lahni bl js-->
      </div>  
      <form class="add-comment" data-cmnt-id="${post.postID}">
          <textarea class="comment-content" placeholder="Your comment here" required></textarea>
          <button type="submit">Add Comment</button>
      </form>
      </section>
  `;    
  const commentForm = postElement.querySelector('.add-comment');
  commentForm.addEventListener('submit', handleCommentSubmit);
  const deleteForm = postElement.querySelector('.del-post');
  deleteForm.addEventListener('submit',deletePost);
  container.appendChild(postElement);
  fetchComments(post.postID, postElement);
}
async function handleCommentSubmit(event) {
  event.preventDefault();

  const postId = event.target.dataset.cmntId;
  const author = localStorage.getItem('username');
  const content = event.target.querySelector('.comment-content').value;

  const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content }),
  });

  const data = await response.json();
  if (response.ok) {
      alert("Comment added successfully!");
      window.location.reload();
  } else {
      alert(data.message);
  }
}
async function fetchComments(postId, postElement) {
  const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
  const comments = await response.json();
  const commentsContainer = postElement.querySelector(`#comments-${postId} .comment-list`);
  const username = localStorage.getItem('username');
  commentsContainer.innerHTML = ``; 
  comments.forEach((comment) => {
      const commentElement = document.createElement('article');
      commentElement.classList.add('comment');
      commentElement.dataset.commentId = comment.id;
      if(comment.author==username){
        commentElement.innerHTML =
        `
          <form class="del-comment" data-comment-id="${comment.id}">
            <button type="submit"><i class="fas fa-trash-alt"></i></button>
          </form>
          <p><strong>${comment.author}</strong> commented on ${new Date(comment.date).toLocaleDateString()}:</p>
          <p>${comment.content}</p>
        `;}
      else{
        commentElement.innerHTML =
        `
          <p><strong>${comment.author}</strong> commented on ${new Date(comment.date).toLocaleDateString()}:</p>
          <p>${comment.content}</p>
        `;}
      commentsContainer.appendChild(commentElement);
      if (comment.author == username) {
        const deleteForm = commentElement.querySelector('.del-comment');
        deleteForm.addEventListener('submit', deleteComment);
      }
  });
}
async function deletePost(event) {
  event.preventDefault();
  
  const form = event.target;
  const postId = form.dataset.postId; 
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    const postElement = form.closest('.post');
    
    const response = await fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    const data = await response.json();

    if (response.ok)
      alert(data.message);
    else
      alert(data.message);

    if (postElement) {
      postElement.remove();
    }    
  }
async function deleteComment(event) {
  event.preventDefault();    
  const form = event.target;
  const commentId = form.dataset.commentId;    
  const commentElement = form.closest('.comment');    
  const confirmed = confirm('Are you sure you want to delete this comment?');
  if (!confirmed) return;  
  try {
      const response = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
    
      const data = await response.json();
    
      if (response.ok) {
          if (commentElement) {
            commentElement.remove();
          }
          alert('Comment deleted successfully!');
      } 
      else {
          alert(`Error: ${data.message}`);
      }
      }catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
}

document.addEventListener('DOMContentLoaded', async() => {

  document.getElementById('search-form').addEventListener('submit',async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const input = document.getElementById('search-input').value;
    const selectedtype=document.getElementById('search-type').value;
    const Postcontainer= document.getElementById('searched-posts'); 
    const response=await fetch('http://localhost:4000/api/posts');
    const posts=await response.json();
    Postcontainer.innerHTML=``;
    if(selectedtype=="title"){
      posts.forEach((post)=>{
        if(input==post.title && post.category=="House & Lifestyle")
          if(username==post.author)
            renderUserPost(post,Postcontainer);
          else
            renderPost(post,Postcontainer);
      });
      if(Postcontainer.innerHTML==``)
        Postcontainer.innerHTML=`<h1>there is no such post !</h1>`
    }
    else if(selectedtype=="author"){
      posts.forEach((post)=>{
        if(input==post.author && post.category=="House & Lifestyle")
          if (username==post.author)
            renderUserPost(post,Postcontainer);
          else
            renderPost(post,Postcontainer);
      });
        if(Postcontainer.innerHTML==``)
        Postcontainer.innerHTML=`<h1>there is no such post !</h1>`
    }
  });

});
