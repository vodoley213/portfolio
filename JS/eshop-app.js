import { setupShop } from './eshop-app-store.js'

setupShop()

const shopingCartIcon = document.querySelector('#shoping-cart-icon')
const shopingCartList = document.querySelector('#shoping-cart-list')
const shopingCartOverlay = document.querySelector('#shoping-cart-overlay')

shopingCartIcon.addEventListener('click', () => {
  shopingCartList.classList.remove('hide')
  shopingCartOverlay.classList.add('show-overlay')
})

shopingCartOverlay.addEventListener('click', () => {
  shopingCartList.classList.add('hide')
  shopingCartOverlay.classList.remove('show-overlay')
})
