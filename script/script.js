//main veribles
const modal = document.querySelector('.modal')
const popup = document.querySelector('.popup')
const form = document.getElementById('form')
const formPopup = document.getElementById('form-avatar')
const postsContainer = document.querySelector('.blog__container')
const imageAvatar = document.querySelector('.header__avatar-image')
const nicknameContainer = document.querySelector('.form-popup__nickname')
const previewContainer = document.querySelector('.form__file-preview') 
const previewImage = document.querySelector('.form__file-preview__image')
const previewAvatarContainer = document.querySelector('.form-popup__file-preview') 
const previewAvatarImage = document.querySelector('.form-popup__file-preview__image')
const formFileContainer = document.querySelector('.form__add')


//button veribles
const buttonAdd = document.getElementById('add-button')
const buttonAvatar = document.querySelector('.header__avatar')

//filed veribles
const inputFile = document.getElementById('add-file')
const inputAvatar = document.getElementById('avatar-add')
const inputUsername = document.getElementById('add-username')
const inputDescription = document.getElementById('add-description')

let posts = []
let currentImageUrl = ''

let personalUserData = {
    currentAvatarUrl: 'images/default-avatar.png',
    currentUsername: '',
}

if(!posts.length){
   document.querySelector('.spinner').classList.add('spinner--active')
}

//getting data whenever page loads 
if(localStorage.getItem('posts')){
    posts = JSON.parse(localStorage.getItem('posts'))
    
    renderPosts()
}

if(localStorage.getItem('avatar')){
    personalUserData = JSON.parse(localStorage.getItem('avatar'))

    imageAvatar.src = personalUserData.currentAvatarUrl
}

//update localStorage
function updateLocalStorage(){
    localStorage.setItem('posts', JSON.stringify(posts))
}

function updateAvatarLocalStorage(){
    localStorage.setItem('avatar', JSON.stringify(personalUserData))
}

//helper functions
function addClassModal(element, type){
    document.body.classList.add('body--active')
    element.classList.add(type)
}

function removeClassModal(element, type){
    document.body.classList.remove('body--active')
    element.classList.remove(type) 
}

function stringValidate(string){
    return string.length >= 35 ? `${string.slice(0, 35)}...<button id="show-more" class="post__description-more post__description--button button-reset">more</button>` : string;
}

function addActiveImageUpload(element, type){ 
    element.classList.add(type)
}

function resetActiveImageUpload(element, type){
    element.classList.remove(type)
}

//modal functionality
function openModal(){
    if(!modal) return

    addClassModal(modal, 'modal--active')
}

function closeModal(e){
    if(!modal) return

    if(e.target.classList.contains('modal__body') || e.target.classList.contains('modal__close')){
        formFileContainer.classList.remove('form__add--hide') 

        removeClassModal(modal, 'modal--active')
        resetActiveImageUpload(previewContainer, 'form__file-preview--active')
        resetFieldsForm()
    }
}

buttonAdd.addEventListener('click', openModal)
document.addEventListener('click', closeModal)

//popup functionality
function openPopup(){ 
    if(!popup) return

    // whenever we open popup whe put inside of each filed data
    nicknameContainer.textContent = personalUserData.currentUsername
    previewAvatarImage.src = personalUserData.currentAvatarUrl

    addClassModal(popup, 'popup--active')
}

function closePopup(e){
    if(!popup) return
    
    if(e.target.classList.contains('popup__body') || e.target.classList.contains('popup__close')){
        formFileContainer.classList.remove('form__add--hide') 

        removeClassModal(popup, 'popup--active')
        resetActiveImageUpload(previewAvatarContainer, 'form-popup__file-preview--active')
        resetFieldsPopupForm()
    }
}

buttonAvatar.addEventListener('click', openPopup)
document.addEventListener('click', closePopup)


//getting image url
function fileHandler(e, type){
    const dataFile = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(dataFile)

    reader.addEventListener('load', (e) => {
        if(type === 'POST'){
            formFileContainer.classList.add('form__add--hide') 
        
            addActiveImageUpload(previewContainer, 'form__file-preview--active')
    
            currentImageUrl = e.target.result
            previewImage.src = e.target.result

            return
        }
        addActiveImageUpload(previewAvatarContainer, 'form-popup__file-preview--active')
     
    
        personalUserData.currentAvatarUrl = e.target.result
        previewAvatarImage.src = e.target.result
    })
}

inputFile.addEventListener('change', (e) => fileHandler(e, 'POST'))
inputAvatar.addEventListener('change', fileHandler)



//reset fields functions
function resetFieldsForm(){
    inputDescription.value = ''
    inputFile.value = ''
}

function resetFieldsPopupForm(){
    inputAvatar.value = ''
    inputUsername.value = ''
}

//create post object
function getUserData(){
    return {
       description: inputDescription.value.trim(),
       personal: personalUserData,
       image: currentImageUrl,
       id: new Date().getMilliseconds(),
       likes:  0,
       comments: [],
    }
}

//post submit
function formHandler(e){
    e.preventDefault()

    if(inputDescription.value === '' || inputFile.value === '') {
        console.log('each field is required')

        return
    }

    const userData = getUserData()

    posts = [userData, ...posts]

    formFileContainer.classList.remove('form__add--hide') 

    removeClassModal(modal, 'modal--active')
    resetActiveImageUpload(previewContainer, 'form__file-preview--active')
    
    updateLocalStorage()
    resetFieldsForm()
    renderPosts()
}

form.addEventListener('submit', formHandler)

//popup submit
function formPopupHandler(e){
    e.preventDefault()

    personalUserData = {
        ...personalUserData,
        currentUsername: inputUsername.value.trim()
    }

    popup.classList.remove('popup--active')
    document.body.classList.remove('body--active')

    imageAvatar.src = personalUserData.currentAvatarUrl

    resetFieldsPopupForm()
    updateAvatarLocalStorage()
}

formPopup.addEventListener('submit', formPopupHandler)



//likes functionality
function likesHandler(id, parent){ 
    // const likeItem = posts.find(post => post.id === id) 
    const likesCount = parent.querySelector('.post__likes-count')
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

//show more description
function descriptionHandler(id, element){
    const parentOfElement = element.closest('.post__description')
    const elementOfFllDescription = posts.find(post => post.id === id)

    parentOfElement.innerHTML = `${elementOfFllDescription.description} <button class="post__description-hide post__description--button button-reset">hide</button>`
}

function hideDescriptionHandler(element){
    const parentOfElement = element.closest('.post__description')

    parentOfElement.innerHTML = `${stringValidate(parentOfElement.textContent)}`
}

//follow each click inside of article
function addFunctionality(e){
    const event = e.target
    const currentParent = event.closest('.post')
    const dataId = +event.closest('.post').dataset.post
    
    if(event.classList.contains('post__add-like')){
        likesHandler(dataId, currentParent)
    }else if(event.classList.contains('post__description-more')){
        descriptionHandler(dataId, event)
    }else if(event.classList.contains('post__description-hide')){
        hideDescriptionHandler(event)
    }
}

//listener for each artcile
function addListener(){
    const articles = document.querySelectorAll('.post')
   
    articles.forEach(article => article.addEventListener('click', addFunctionality))
}

//render posts
function renderPosts(){
    postsContainer.innerHTML = ''

    const div = document.createElement('div')
    div.classList.add('blog__wrapper')

    posts.forEach(post => {
        div.innerHTML += `
        <article class="blog__post post" data-post=${post.id}>
            <div class="post__body">
                <div class="post__header">
                    <div class="post__avatar">
                        <img class="post__avatar-image" src=${post.personal.currentAvatarUrl} alt="avatar">
                    </div>
                    <h3 class="post__nickname">${post.personal.currentUsername || 'anonymus'}</h3>
                </div>
                    
                <div class="post__main">
                    <div class="post__image">
                        <img class="post__image-photo" src=${post.image} alt="post">
                    </div>
                </div>

                <div class="post__footer">
                    <div class="post__functionality">
                        <p class="post__likes">&#10084 <span class="post__likes-count"> ${post.likes.toString()}</span></p>

                        <div class="post__add">
                            <button class="post__add-like post__add-button button button-reset">&#10084</button>
                            <button class="post__add-comment post__add-button button button-reset">&#128394</button>
                        </div>
                        
                    </div>
                    <p class="post__description">${stringValidate(post.description)}</p>
                </div>
            </div>
        </article>
        `
    })

    postsContainer.append(div)
    addListener()
}














