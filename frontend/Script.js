//////////////////////////kif t clicki 3l 'add post' yzidha fl base de donne w yasta3mal l route elli f backend//////////////////////////////////////// 
document.getElementById('add-post').addEventListener('submit',async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const author = localStorage.getItem('username');

    const response= await fetch('http://localhost:4000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    });
    const data=await response.json();
    if(response.ok)
        alert("post added successfully !");
    else
        alert(data.message);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////hadhi bach displayi l posts elli mawjoudin fl bd yasta3mel roue elli f bd ///////////////////////////////////
document.addEventListener('DOMContentLoaded', async() => {
    // Display the welcome message
    const username = localStorage.getItem('username');
    if (username) {
    document.getElementById('welcome').textContent = `Welcome back, ${username} !`;
    }
    // Fetch blog posts from the backend
    const response=await fetch('http://localhost:4000/api/posts');
    const posts=await response.json();
    const Posts = document.getElementById('posts'); // Get the container for posts
    posts.forEach((post) => renderPost(post,Posts));
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////function elli bch  tdhahrelna les posts elli 3ndna fl bd lkol  bl commentaraite ta3hom //////////////////////////////////////////////////////////////
async function renderPost(post, container) {
    const postElement = document.createElement('article');
    postElement.classList.add('post');
    postElement.setAttribute('data-post-id', post.postID);
  
    postElement.innerHTML =
    `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p><strong>Posted by ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
      <section id="comments-${post.postID}">
        <h2>Comments</h2>
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////function este3malnaha fl function elli gbalha renderposts bch k t clicki 3l add comment yetzad fl bd w yesta3mel el route elli deja definit fl backend/////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////  function bech displayi l comments ta3 post kima l 3ada 3endha route fl backend w esta3melnah f runderpost function//////////////////////////////////////////////////
async function fetchComments(postId, postElement) {
  const response = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
  const comments = await response.json();
  const commentsContainer = postElement.querySelector(`#comments-${postId} .comment-list`);
  commentsContainer.innerHTML = ``; // Clear old comments
  comments.forEach((comment) => {
      const commentElement = document.createElement('article');
      commentElement.classList.add('comment');
      commentElement.innerHTML =
      `
          <p><strong>${comment.author}</strong> on ${new Date(comment.date).toLocaleDateString()}:</p>
          <p>${comment.content}</p>
      `;
      commentsContainer.appendChild(commentElement);
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
