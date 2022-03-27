//main veribles
const modal = document.querySelector('.modal')
const popup = document.querySelector('.popup')
const commetsModal = document.querySelector('.comments')
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
const warningContainer = document.querySelector('.blog__warning')
const cardsList = document.querySelector('.cards__list')
const spinner = document.querySelector('.spinner')

//button veribles
const buttonAdd = document.getElementById('add-button')
const buttonAvatar = document.querySelector('.header__avatar')
const buttonNext = document.getElementById('button-next')
const buttonPrev = document.getElementById('button-prev')

//filed veribles
const inputFile = document.getElementById('add-file')
const inputAvatar = document.getElementById('avatar-add')
const inputUsername = document.getElementById('add-username')
const inputDescription = document.getElementById('add-description')
const inputSearch = document.getElementById('search-post')

let posts = []
let cuttedComments = []
let currentImageUrl = ''

let personalUserData = {
    currentAvatarUrl: 'images/default-avatar.png',
    currentUsername: 'анонімус',
}


let offset = 0
const phrases = [
    'Так, так, я люблю тебе',
    'Я в тебе вірю',
    'Життя - це те, що з тобою відбувається', 
    'Мы чекаємо на тебе', 
    'Неосмислене життя не варте того, щоб його прожити', 
    'Залишилось ще трішки',
    'Перемога - це ще не все, все це постійне бажання перемагати',
    'У твоєму словнику немає слова неможливо',
    'Найкраща помста - величезний успіх',
    'У всьому є своя краса, але не кожен може її побачити',
    'Твоє щастя залежить тільки від тебе',
    'Якщо немає вітру, беріться за весла',
    'Путін скоро здохне',
    'Ми стаємо тим, про що ми думаємо',
    'Будь собою, інші ролі зайняті',
    'Пакуй валізи скоро до дому',
    'Заходь на каву',
    'Прагніть не до успіху, а до цінностей',
    'В тебе все вийде',
    'Перемога за нами'
]

const POST_ADD_LIKE = 'post__add-like'
const POST_ADD_COMMENT = 'post__add-comment'
const POST_COMMENT_BUTTON = 'post__comment-button'
const POST_DESCRIPTION_MORE = 'post__description-more'
const POST_DESCRIPTION_HIDE = 'post__description-hide'
const POST_ALL = 'post__all'
const POST_DELETE_IMAGE = 'post__delete-image'


if(!posts.length){
    addClass(spinner, 'spinner--active')
}

//getting data whenever page loads 
if(localStorage.getItem('posts')){
    posts = JSON.parse(localStorage.getItem('posts'))

    removeClass(spinner, 'spinner--active')
    
    renderPosts(posts)
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

function stringValidate(string, count){
    return string.length >= count ? `${string.slice(0, count)}...<button id="show-more" class="post__description-more post__description--button button-reset">more</button>` : string;
}

function commentValidate(string, count){
    return string.length >= count ? `${string.slice(0, count)}...` : string;
}

function addClass(element, type){ 
    element.classList.add(type)
}

function removeClass(element, type){
    element.classList.remove(type)
}

function findElement(array, id){
    return array.find(item => item.id === id)
}


//cards functionality
function randomPhrase(){
    const uniqueSet = new Set()
    for(let i = 0; i < phrases.length; i++){
        uniqueSet.add(Math.floor(0 + Math.random() * (phrases.length - 1 + 1 - 0)))
    }

    return Array.from(uniqueSet).slice(0, 4)
}

function createPhrases(){
    const uniqueIndexOfPhrase = randomPhrase()
    let out = ''

    for(let i = 0; i < uniqueIndexOfPhrase.length; i++){
        out += `
            <div class="cards__item card">
                <h3 class="card__title">&#9728 ${phrases[uniqueIndexOfPhrase[i]]}</h3>
            </div>
        `
    }

    cardsList.innerHTML = out 
}   

createPhrases()

function skipNextCard(){
    offset += 160

    if(offset > 320) offset = 0

    cardsList.style.left = `${-offset}px`
}

function skipPrevCard(){
    offset -= 160

    if(offset < 0) offset = 320

    cardsList.style.left = `${-offset}px`
}

buttonPrev.addEventListener('click', skipPrevCard)
buttonNext.addEventListener('click', skipNextCard)


//modal functionality
function openModal(){
    if(!modal) return

    addClassModal(modal, 'modal--active')
}

function closeModal(e){
    if(!modal) return

    if(e.target.classList.contains('modal__body') || e.target.classList.contains('modal__close')){

        removeClassModal(modal, 'modal--active')
        removeClass(formFileContainer, 'form__add--hide')
        removeClass(previewContainer, 'form__file-preview--active')
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

        removeClass(formFileContainer, 'form__add--hide')
        removeClassModal(popup, 'popup--active')
        removeClass(previewAvatarContainer, 'form-popup__file-preview--active')
        resetFieldsPopupForm()
    }
}

buttonAvatar.addEventListener('click', openPopup)
document.addEventListener('click', closePopup)

//comments modal functinality
function closeComments(e){
    if(!commetsModal) return 

    if(e.target.classList.contains('comments__body') || e.target.classList.contains('comments__close')){
        
        removeClassModal(commetsModal, 'comments--active')
        removeClass(commetsModal, 'comments--active')
    }
}

document.addEventListener('click', closeComments)

//getting image url
function fileHandler(e, type){
    const dataFile = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(dataFile)

    reader.addEventListener('load', (e) => {
        if(type === 'POST'){
            addClass(formFileContainer, 'form__add--hide')
           
            addClass(previewContainer, 'form__file-preview--active')
    
            currentImageUrl = e.target.result
            previewImage.src = e.target.result

            return
        }
        addClass(previewAvatarContainer, 'form-popup__file-preview--active')
     
    
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
        alert('Всі поля повинні бути заповнені')

        return
    }

    const userData = getUserData()

    posts = [userData, ...posts]

    removeClassModal(modal, 'modal--active')
    removeClass(formFileContainer, 'form__add--hide')
    removeClass(previewContainer, 'form__file-preview--active')
    
    updateLocalStorage()
    resetFieldsForm()
    renderPosts(posts)
}

form.addEventListener('submit', formHandler)

//popup submit
function formPopupHandler(e){
    e.preventDefault()

    personalUserData = {
        ...personalUserData,
        currentUsername: inputUsername.value.length ? inputUsername.value.trim().toLowerCase() : personalUserData.currentUsername,
    }

    imageAvatar.src = personalUserData.currentAvatarUrl

    removeClassModal(popup, 'popup--active')
    resetFieldsPopupForm()
    updateAvatarLocalStorage()
}

formPopup.addEventListener('submit', formPopupHandler)

//search post functionality
function searchPostHandler(e){
    if(!posts.length) return

    const visiblePosts = posts.filter(post => post.personal.currentUsername.includes(e.target.value.trim().toLowerCase()))

    renderPosts(visiblePosts)
}

inputSearch.addEventListener('input', searchPostHandler)


//likes functionality
function likesHandler(id, parent){ 
    const likesCount = parent.querySelector('.post__likes-count')

    parent.querySelector('.post__likes').style.color = 'red'
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

//comment functionality
function showCommetsHandler(id){
    const commentsList = document.querySelector('.comments__list')
    const elementOfComments = findElement(posts, id)

    commentsList.innerHTML = ''

    if(!elementOfComments.comments.length){
        alert('Поки у цієї фотографії немає коментарів')

        return
    }

    elementOfComments.comments.forEach(comment => {
        commentsList.innerHTML += `
            <li class="post__feedback-item">
                <h4 class="post__feedback-item__name">${comment.name}:</h4> 
                ${comment.comment}
            </li>
        `
    }) 
    addClassModal(commetsModal, 'comments--active')
}

function renderComments(id, parent){
    const commentsCount = parent.querySelector('.post__all')
    const listContainer = parent.querySelector('.post__feedback')

    const elementWithComments = findElement(posts, id)

    commentsCount.textContent =  `всі ${elementWithComments.comments.length} коментарі`
   
    listContainer.innerHTML = ''

    elementWithComments.comments.slice(0, 2).forEach(comment => {
        listContainer.innerHTML += `
            <li class="post__feedback-item">
                <h4 class="post__feedback-item__name">${comment.name}:</h4> 
                ${commentValidate(comment.comment, 28)}
            </li>
        `
    })
}


function addCommentHandler(id, parent){
    const postContainer = parent.querySelector('.post__comment')
    const fieldAddComment = parent.querySelector('.post__comment-field')

    if(!fieldAddComment.value.length) {
        alert('Ти не можеш відправити пустий коментарій')

        return
    }

        const elementOfComments = posts.map(post => {
            if(post.id === id){
                return {
                    ...post, 
                    comments: [
                        {
                            name: personalUserData.currentUsername,
                            comment: fieldAddComment.value.trim(),
                        },
                        ...post.comments
                    ]
                }
            }

            return post
        })

        posts = elementOfComments

        fieldAddComment.value = ''
         
        removeClass(postContainer, 'post__comment--active')
        renderComments(id, parent)
        updateLocalStorage()
}

function commentHandler(parent){
    const postContainer = parent.querySelector('.post__comment')

    postContainer.classList.toggle('post__comment--active')
}

//delete functionality
function deletePostHandler(id){
    const arrayAfterDeleted = posts.filter(post => post.id !== id) 

    posts = arrayAfterDeleted

    renderPosts(posts)
    updateLocalStorage()
}

//show more description
function descriptionHandler(id, element){
    const parentOfElement = element.closest('.post__description')
    const elementOfFllDescription = findElement(posts, id)

    parentOfElement.innerHTML = `${elementOfFllDescription.description} <button class="post__description-hide post__description--button button-reset">hide</button>`
}

function hideDescriptionHandler(element){
    const parentOfElement = element.closest('.post__description')

    parentOfElement.innerHTML = `${stringValidate(parentOfElement.textContent, 35)}`
}

//follow each click inside of article
function addFunctionality(e){
    const event = e.target
    const parentOfElement = event.closest('.post')
    const dataId = +event.closest('.post').dataset.post
    
    if(event.classList.contains(POST_ADD_LIKE)){
        likesHandler(dataId, parentOfElement)
    }else if(event.classList.contains(POST_ADD_COMMENT)){
        commentHandler(parentOfElement)
    }else if(event.classList.contains(POST_COMMENT_BUTTON)){
        addCommentHandler(dataId, parentOfElement)
    }else if(event.classList.contains(POST_DESCRIPTION_MORE)){
        descriptionHandler(dataId, event)
    }else if(event.classList.contains(POST_DESCRIPTION_HIDE)){
        hideDescriptionHandler(event)
    }else if(event.classList.contains(POST_ALL)){
        showCommetsHandler(dataId)
    }else if(event.classList.contains(POST_DELETE_IMAGE)){
        deletePostHandler(dataId)
    }
}

//listener for each artcile
function addListener(){
    const articles = document.querySelectorAll('.post')
   
    articles.forEach(article => article.addEventListener('click', addFunctionality))
}

//render posts
function renderPosts(array){
    postsContainer.innerHTML = ''

    if(!array.length){    
        addClass(warningContainer, 'blog__warning--active')
        warningContainer.textContent = 'нічого не було знайдено'

        return
    }

    removeClass(warningContainer, 'blog__warning--active')
    const div = document.createElement('div')
    div.classList.add('blog__wrapper')

    array.forEach(post => {
        div.innerHTML += `
        <article class="blog__post post" data-post=${post.id}>
            <div class="post__body">
                <div class="post__header">
                    <div class="post__wrapper">
                        <div class="post__avatar">
                            <img class="post__avatar-image" src=${post.personal.currentAvatarUrl} alt="avatar">
                        </div>
                        <h3 class="post__nickname">${post.personal.currentUsername || 'anonymus'}</h3>
                    </div>

                    <div class="post__delete">
                        <img class="post__delete-image" src="images/cross-close.png" alt="delete">
                    </div>

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
                    <p class="post__description">${stringValidate(post.description, 35)}</p>
                    <div class="post__comment">
                        <input class="post__comment-field input-reset input" name="comment" type="text" placeholder="напиши свій комент">
                        <button class="post__comment-button button-reset button">+</button>
                    </div>
            
                    <ul class="post__feedback">
                        ${post.comments.length !== 0 ? post.comments.slice(0, 2).map(comment => {
                            return `
                                <li class="post__feedback-item">
                                    <h4 class="post__feedback-item__name">${comment.name}:</h4>
                                     ${commentValidate(comment.comment, 28)}
                                </li>
                            `
                        }).join('') : ''}
                    </ul>

                    ${post.comments && `<button class="post__all button-reset">всі ${post.comments.length} коментарі<button>`}
                </div>
            </div>
        </article>
        `
    })

    postsContainer.append(div)
    addListener()
}














