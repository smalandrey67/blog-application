//main veribles
const modal = document.querySelector('.modal')
const form = document.getElementById('form')
const previewContainer = document.querySelector('.form__file-preview') 
const previewImage = document.querySelector('.form__file-preview__image')
const postsContainer = document.querySelector('.blog__container')

//button veribles
const buttonAdd = document.getElementById('add-button')

//filed veribles
const inputFile = document.getElementById('add-file')
const inputUsername = document.getElementById('add-username')
const inputDescription = document.getElementById('add-description')

let posts = []
let currentImageUrl = ''

//getting data whenever page loads 
if(localStorage.getItem('posts')){
    posts = [...JSON.parse(localStorage.getItem('posts'))]

    renderPosts()
}

//update localStorage
function updateLocalStorage(){
    localStorage.setItem('posts', JSON.stringify(posts))
}

//modal functionality
function openModal(){
    if(!modal) return

    modal.classList.add('modal--active')
}

function closeModal(e){
    if(!modal) return

    if(e.target.classList.contains('modal__body') || e.target.classList.contains('modal__close')){
        modal.classList.remove('modal--active') 
    }
}

buttonAdd.addEventListener('click', openModal)
document.addEventListener('click', closeModal)


//getting image
function fileHandler(){
    const dataFile = inputFile.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(dataFile)

    reader.addEventListener('load', (e) => {
        previewContainer.classList.add('form__file-preview--active')
        currentImageUrl = e.target.result
        previewImage.src = e.target.result
    })
}

inputFile.addEventListener('change', fileHandler)

//submit post form
function getUserData(){
    return {
       name: inputUsername.value.trim().toLowerCase(),
       description: inputDescription.value.trim().toLowerCase(),
       image: currentImageUrl,
       id: new Date().getMilliseconds(),
       likes:  0,
       comments: [],
    }
}

function resetFieldsForm(){
    inputUsername.value = ''
    inputDescription.value = ''
    inputFile.value = ''
}

function formHandler(e){
    e.preventDefault()

    if(inputUsername.value === '' || inputDescription.value === '' || inputFile.value === '') {
        console.log('each field is required')

        return
    }

    const userData = getUserData()

    posts = [userData, ...posts]

    modal.classList.remove('modal--active')

    updateLocalStorage()
    resetFieldsForm()
    renderPosts()
}

form.addEventListener('submit', formHandler)



//likes functionality

function likesHandler(id){
    const likesCount = document.querySelector('.post__likes-count')
    likesCount.textContent = ++likesCount.textContent

    const filterPosts = posts.map(post => {
        if(post.id === id) {
            return {...post, likes: ++post.likes}
        }
        return post
    })

    posts = filterPosts

    updateLocalStorage()
}

//follow each click inside of article
function addFunctionality(e){
    const event = e.target
    const dataId = +event.closest('.post__functionality').dataset.post
    
    if(event.classList.contains('post__functionality-like')) likesHandler(dataId)
}

//listener for each artcile
function addListener(){
    const articles = document.querySelectorAll('.post')
   
    articles.forEach(article => article.addEventListener('click', addFunctionality))
}

//render posts
function renderPosts(){
    postsContainer.innerHTML = ''

    const article = document.createElement('article')
    article.classList.add('blog__post', 'post')

    posts.forEach(post => {
        article.innerHTML += `
            <div class="post__body">
                <div class="post__header">
                    <div class="post__avatar">
                        <img class="post__avatar-image" src=${post.image} alt="avatar">
                    </div>
                    <h3 class="post__nickname">${post.name}</h3>
                </div>
                    
                <div class="post__main">
                    <div class="post__image">
                        <img class="post__image-photo" src=${post.image} alt="post">
                    </div>
                </div>

                <div class="post__footer">
                    <p class="post__likes">likes<span class="post__likes-count"> ${post.likes.toString()}</span></p>
                    <div class="post__functionality" data-post=${post.id}>
                        <button class="post__functionality-like post__functionality-button button button-reset">Like</button>
                        <button class="post__functionality-comment post__functionality-button button button-reset">Comment</button>
                    </div>
                    <p class="post__description">${post.description}</p>
                </div>
            </div>
        `
    })

    postsContainer.append(article)
    addListener()
}














