let baseURL = 'https://tarmeezacademy.com/api/v1'
scrollToUp()
// ========= POSTS REQUESTS =========
function commentClicked(postId) {
    // alert(postId)
    window.location = `postDetails.html?postId=${postId}`
}
function addBtnClicked() {

    document.getElementById('post-modal-submit-btn').innerHTML = 'Cteate';
    document.getElementById('post-id-input').value = "";
    document.getElementById('post-modal-title').innerHTML = "Create A New Post";
    document.getElementById('post-title-input').value = '';
    document.getElementById('post-body-input').value = '';
    let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
    postModal.toggle()
}


function toggleLoader(show = true) {
    if (show) {
        document.getElementById('loader').style.visibility = 'visible'
    } else {
        document.getElementById('loader').style.visibility = 'hidden'
    }
}
function createNewPostClicked() {
    let postId = document.getElementById('post-id-input').value;
    let isCreate = postId == null || postId == ""


    let title = document.getElementById('post-title-input').value;
    let body = document.getElementById('post-body-input').value;
    let image = document.getElementById('post-image-input').files[0];
    let token = localStorage.getItem("token");

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)


    let URL = `${baseURL}/posts`
    let tokenHeaders = {
        "Content-Type": 'multipart/form-data',
        "authorization": `Bearer ${token}`
    }
    if (isCreate == true) {
        URL = `${baseURL}/posts`
        toggleLoader(true)
        axios.post(URL, formData, {
            'headers': tokenHeaders
        })


            .then((response) => {

                console.log(response);
                let modal = document.getElementById('create-post-modal')
                let modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showAlert('New Post Has Been  Created');
                getPosts()


            }).catch((error) => {
                let message = error.response.data.message
                showAlert(message, 'danger')
            }).finally(() => {
                toggleLoader(false)
            })
    } else {
        formData.append("_method", "put")
        URL = `${baseURL}/posts/${postId}`
        toggleLoader(true)
        axios.post(URL, formData, {
            'headers': tokenHeaders
        })


            .then((response) => {

                console.log(response);
                let modal = document.getElementById('create-post-modal')
                let modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showAlert('Post Has Been  Updated');
                getPosts()


            }).catch((error) => {
                let message = error.response.data.message
                showAlert(message, 'danger')
            }).finally(() => {
                toggleLoader(false)
            })
    }

}

function editPostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post);
    document.getElementById('post-modal-submit-btn').innerHTML = 'Update';
    document.getElementById('post-id-input').value = post.id;
    document.getElementById('post-modal-title').innerHTML = "Edit Post";
    document.getElementById('post-title-input').value = post.title;
    document.getElementById('post-body-input').value = post.body;
    let postModal = new bootstrap.Modal(document.getElementById('create-post-modal'), {})
    postModal.toggle()

}
function deletePostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post);
    document.getElementById('delete-post-id-input').value = post.id
    let postModal = new bootstrap.Modal(document.getElementById('delete-post-modal'), {})
    postModal.toggle()
    
}
function confirmPostDelete() {

    let token = localStorage.getItem("token");
    const postId = document.getElementById('delete-post-id-input').value
    let tokenHeaders = {
        "Content-Type": 'multipart/form-data',
        "authorization": `Bearer ${token}`
    }
    toggleLoader(true)
    axios.delete(`${baseURL}/posts/${postId}`, {
        headers: tokenHeaders
    })

        .then((response) => {

            console.log(response);

            let modal = document.getElementById('delete-post-modal')
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('The Post Has Been Deleted Successfully!')
            getPosts()
            setupUI()

        }).catch((error) => {
            let message = error.response.data.message
            showAlert(message, 'danger')
        }).finally(() => {
            toggleLoader(false)
        })
}
function profileClicked() {
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}
function setupUI() {


    let token = localStorage.getItem('token');
    let logindiv = document.getElementById('login-div');
    let logoutidv = document.getElementById('logout-div');
    let addBtn = document.getElementById('addBtn');
    let navUserName = document.getElementById('navUserName')



    if (token != null) //user is loggen in
    {
        if (addBtn != null) {
            addBtn.style.setProperty('display', 'flex', 'important');
        }

        logindiv.style.setProperty('display', 'none', 'important');
        logoutidv.style.setProperty('display', 'flex', 'important');
        navUserName.style.setProperty('display', 'flex', 'important');


    } else {
        if (addBtn != null) {
            addBtn.style.setProperty('display', 'none', 'important');
        }

        logindiv.style.setProperty('display', 'flex', 'important');
        logoutidv.style.setProperty('display', 'none', 'important');
        navUserName.style.setProperty('display', 'none', 'important');
    }


    // تعريف `baseURL`
    let baseURL = 'https://tarmeezacademy.com/api/v1';

    // التحقق من أن المستخدم الحالي موجود
    if (!localStorage.getItem('token')) {
        // المستخدم غير موجود
        return;
    }

    // استرداد المستخدم الحالي
    let user = getCurrentUser();

    // تحديث UI بناءً على حالة المستخدم
    if (user) {
        document.getElementById('navUserName').innerHTML = user.username;
        document.getElementById('navUserImage').src = user.profile_image;
    } else {
        document.getElementById('navUserName').innerHTML = '';
        document.getElementById('navUserImage').src = '';
    }
}
// ======== AUTH FUNCTION ========
function loginBtnClicked() {
    let username = document.getElementById('username-input').value
    let password = document.getElementById('password-input').value
    let params = {
        "username": username,
        "password": password
    }
    toggleLoader(true)
    axios.post(`${baseURL}/login`, params)


        .then((response) => {
            toggleLoader(false)
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            let modal = document.getElementById('login-modal')
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('You are Logged in Successfully!')
            setupUI()

        }).catch((error) => {

            let message = error.response.data.message
            showAlert(message, 'danger')
        }).finally(() => {
            toggleLoader(false)
        })
}
function registerBtnClicked() {
    let name = document.getElementById('register-name-input').value
    let username = document.getElementById('register-username-input').value
    let password = document.getElementById('register-password-input').value
    let email = document.getElementById('register-email-input').value
    let profileImage = document.getElementById('register-image-input').files[0];

    let formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)
    formData.append("email", email)
    formData.append("name", name)
    formData.append("image", profileImage)


    let headers = {
        "Content-Type": 'multipart/form-data',
    }
    toggleLoader(true)
    axios.post(`${baseURL}/register`, formData, {
        'headers': headers
    })
        .then((response) => {

            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            let modal = document.getElementById('register-modal')
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert('New User Register Successfully!')
            setupUI()

        }).catch((error) => {
            let message = error.response.data.message
            showAlert(message, 'danger')
        }).finally(() => {
            toggleLoader(false)
        })
}
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setupUI()
    showAlert('Logged out Successfully')
}
function showAlert(customMessage, type = 'success') {
    const alertPlaceholder = document.getElementById('successAlert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)

    }

    appendAlert(customMessage, type)

}
function getCurrentUser() {
    let user = null;
    let storageUser = localStorage.getItem("user");

    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user
}

// استدعاء الدالة عند تحميل الصفحة

setupCommentInput();

function scrollToUp() {
    let scrollUp = document.getElementById('scrollUp')
    window.onscroll = function () {
        if (scrollY >= 700) {
            scrollUp.style.display = 'block'
        } else {
            scrollUp.style.display = 'none'
        }
    }
    scrollUp.onclick = function () {
        scroll({
            top: 0,
            behavior: 'smooth'
        })
    }

}

