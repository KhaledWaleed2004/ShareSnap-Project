

let currentPage = 1;
let lastPage = 1;
// ========= INFINITE SCROLL =========
window.addEventListener("scroll", function () {

    const endOfPage = window.scrollY + window.innerHeight >= document.body.scrollHeight;

    if (endOfPage && currentPage < lastPage) {
        getPosts(false, currentPage + 1)
        currentPage = currentPage + 1
    }
});
// ========= INFINITE SCROLL =========
setupUI()
getPosts()
function userClicked(userId) {
    window.location = `profile.html?userid=${userId}`
}
function getPosts(reloud = true, page = 1) {
    toggleLoader(true)
    axios.get(`${baseURL}/posts?limit=2&page=${page}`, {

    })
        .then((response) => {
            toggleLoader(false)
            const posts = response.data.data
            lastPage = response.data.meta.last_page
            if (reloud) {
                document.getElementById('posts').innerHTML = ''
            }

            for (post of posts) {

                const author = post.author

                let postTitle = ""
                // SHOW OR HIDE EDIT BUTTON 
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editButtonContent = ``;

                if (isMyPost) {
                    editButtonContent = `
                   

                    <div style="display: flex;">
                    <button delete type="button" class="btn btn-danger" title="Delete" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"><i class="fa-solid fa-trash-can"></i></button>
                    <i id="edit" class="fa fa-light fa-pen-to-square" title="Edit" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"></i></div>
                    
                    `
                }
                if (post.title != null) {
                    postTitle = post.title
                }

                let content = `
                <!-- POST -->
                <div class="card shadow my-4 text-white" style="background-color: #141414;">

                
                    <div class="card-header" id="card-header">
                    <div  onclick="userClicked(${author.id})">
                        <img src=${author.profile_image} class="rounded-circle border-3" alt="Photo" style="cursor: pointer;">
                        <a class="text-white" href="#"><b class="">@${author.username}</b></a>
                        </div>
                        ${editButtonContent}
                    </div>
                    <div class="card-body">
                        <img class="w-100 mt-1" src=${post.image}>
                        <h6>
                            ${post.created_at}
                        </h6>
                        <h5>
                            ${postTitle}
                        </h5>
                        <p>
                            ${post.body}
                        </p>
                        <hr>
    
                        <div class="comment" onclick="commentClicked(${post.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-chat" viewBox="0 0 16 16">
                                <path
                                    d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                            </svg>
                            <span>
                                (${post.comments_count}) Comments
                                <span id="post-tags-${post.id}">
                                
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- // POST // -->
                `

                document.getElementById('posts').innerHTML += content
                let currentPostTagsId = `post-tags-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ''
                for (tag of post.tags) {
                    let tagsContent =
                        `<button class=" btn btn-sm rounded-5" style="background-color: gray; color: white;">
                                ${tag.name}
                                </button>`
                    document.getElementById(currentPostTagsId).innerHTML += tagsContent
                }
            }
        })
        .catch(function (error) {
            // alert("Network Error")
            // window.location = '404Error.html'
        });
}



