//////////////////////////kif t clicki 3l 'add post' yzidha fl base de donne w yasta3mal l route elli f backend//////////////////////////////////////// 
document.getElementById('add-post').addEventListener('submit',async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const author = localStorage.getItem('username');
    const category1 = document.getElementById('category');
    const category = category1.options[category1.selectedIndex].text;



    const response= await fetch('http://localhost:4000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author, category}),
    });
    const data=await response.json();
    if(response.ok)
        alert(data.message);      
    else
        alert(data.message);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', async() => {

  document.getElementById('search-form').addEventListener('submit',async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const input = document.getElementById('search-input').value;
    const selectedtype=document.getElementById('search-type').value;
    const Postcontainer= document.getElementById('searched-posts'); // Get the container for posts
    const response=await fetch('http://localhost:4000/api/posts');
    const posts=await response.json();
    Postcontainer.innerHTML=``;
    if(selectedtype=="title"){
      posts.forEach((post)=>{
        if(input==post.title)
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
        if(input==post.author)
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
    posts.forEach((post) => {
      if (post.author==username)
       renderUserPost(post,Posts)
      else
        renderPost(post,Posts)
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////function elli bch  tdhahrelna les posts elli 3ndna fl bd lkol  bl commentaraite ta3hom taa3 el user elli deja connecte//////////////////////////////////////////////////////////////
async function renderUserPost(post, container) {
    const postElement = document.createElement('article');
    postElement.classList.add('post');
    postElement.setAttribute('data-post-id', post.postID);
    postElement.innerHTML =
    `
      <form class="del-post" data-post-id="${post.postID}">
        <button type="submit">delete my post</button>
      </form>
      <h2>${post.title}</h2>
      <p id="content-p">${post.content}</p>
      <p id="author-p"><strong>Posted by ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
      <p id="category-p"><strong>Category:</strong>${post.category}</p>
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





async function deletePost(event) {
  event.preventDefault();
  
  const form = event.target;
  const postId = form.dataset.postId; 
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    // Get the post element for removal
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

    // Success - remove post from UI
    if (postElement) {
      postElement.remove();
    }    
  }




  

async function deleteComment(event) {
  event.preventDefault();
  
  // Get the comment ID from the form's data attribute
  const form = event.target;
  const commentId = form.dataset.commentId;
  
  // Get the comment element for removal
  const commentElement = form.closest('.comment');
  
  // Confirmation dialog
  const confirmed = confirm('Are you sure you want to delete this comment?');
  if (!confirmed) return;

  try {
    // Send DELETE request to backend
    const response = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      // Success - remove comment from UI
      if (commentElement) {
        commentElement.remove();
      }
      alert('Comment deleted successfully!');
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    alert('Failed to delete comment. Please try again.');
  }
}






/////////////////////////////////////////function elli bch  tdhahrelna les posts elli 3ndna fl bd lkol  bl commentaraite ta3hom taa3 l users l okhrin//////////////////////////////////////////////////////////////
async function renderPost(post, container) {
  const postElement = document.createElement('article');
  postElement.classList.add('post');
  postElement.setAttribute('data-post-id', post.postID);
  postElement.innerHTML =
  `
    <h2>${post.title}</h2>
    <p id="content-p">${post.content}</p>
    <p id="author-p"><strong>Posted by ${post.author}</strong> on ${new Date(post.date).toLocaleDateString()}</p>
    <p id="category-p"><strong>Category:</strong>${post.category}</p>
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
  const username = localStorage.getItem('username');
  commentsContainer.innerHTML = ``; // Clear old comments
  comments.forEach((comment) => {
      const commentElement = document.createElement('article');
      commentElement.classList.add('comment');
      commentElement.dataset.commentId = comment.id;
      if(comment.author==username){
        commentElement.innerHTML =
        `
          <form class="del-comment" data-comment-id="${comment.id}">
            <button type="submit">delete my comment</button>
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////                TESTING PHASE       ///////////////////////////////////////////////////////////////

function testRenderPost() {
  const testContainer = document.createElement('div');
  const testPost = {
    postID: 999,
    title:"Test Post",
    content: "This is a test post.",
    author: "tester",
    date: new Date().toISOString(),
    category: "Testing"
  };

  renderPost(testPost, testContainer);

  const postElement = testContainer.querySelector('.post');
  if (!postElement) {
    console.error("❌ renderPost() failed: Post element not created");
    return;
  }

  const title = postElement.querySelector('h2').textContent;
  const content = postElement.querySelector('#content-p').textContent;
  const author = postElement.querySelector('#author-p').textContent;
  const category = postElement.querySelector('#category-p').textContent;

  const hasCommentForm =postElement.querySelector('.add-comment');

  if (testPost.title == null || testPost.author==null || testPost.content==null || testPost.category==null || testPost.postID==null)
    console.error("❌ renderPost() failed: there is a null input");
  else if (!hasCommentForm)
    console.log("❌ renderPost() failed: there is no comments form")

  else if ( title != "Test Post" || !content.includes("This is a test post.") || !author.includes("tester") || !category.includes("Testing"))
    console.error("❌ renderPost() failed: Incorrect post rendering");
  else 
    console.log("✅ renderPost() passed");
}

function testRenderUserPost() {

  const testContainer = document.createElement('div');
  const testPost = {
    postID: 999,
    title: "Test User Post",
    content: "This is a test post by the current user.",
    author: localStorage.getItem('username') || "current_user",
    date: new Date().toISOString(),
    category: "Testing"
  };


  renderUserPost(testPost, testContainer);

  const postElement = testContainer.querySelector('.post');
  if (!postElement) {
    console.error("❌ renderUserPost() failed: Post element not created");
    return;
  }

  const hasDeleteButton = postElement.querySelector('.del-post');
  const hasCommentForm = postElement.querySelector('.add-comment');

  if (!hasDeleteButton && hasCommentForm) 
    console.error("❌ renderUserPost() failed: Missing delete post button");
  else if (hasDeleteButton && !hasCommentForm)
    console.error("❌ renderUserPost() failed: Missing delete comment button");
  else if (!hasDeleteButton && !hasCommentForm)
    console.error("❌ renderUserPost() failed: Missing both delete comment and delete post buttons");
  else
    console.log("✅ renderUserPost() passed");

}


async function testSearch() {
    const response = await fetch('http://localhost:4000/api/posts');
    const posts = await response.json();
    const type="author";
    const search="bob";
    let found = false;
    if (type === "title") {
      posts.forEach((post)=>{
        if(post.title===search)
          found = true;
      });
    } 
    else if (type === "author") {
      posts.forEach((post)=>{
        if(post.author===search)
          found= true;
      });
    }

    if (found) 
      console.log(`✅ Search by ${type} for "${search}" passed`);
    else 
      console.error(`❌ Search by ${type} for "${search}" failed`);
}











function runAllTests() {
  console.log("=== Starting Tests ===");
  testRenderPost();
  testRenderUserPost();
  testSearch(); 
  console.log("=== Tests Complete ===");
}
document.addEventListener('DOMContentLoaded', runAllTests);



