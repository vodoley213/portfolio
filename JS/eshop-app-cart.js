import { formatCurrency } from './utils/formatCurrency.js'
let shoppingCart = []
const cartItemTemplate = document.querySelector('#item-in-cart-template')

const URL = '/assets/plants.json'
const responseFromUrl = await fetch(URL)
const shoppingItems = await responseFromUrl.json()

export function setupShoppingCart() {}

// удалять товары из корзины
// работа корзины на всех страницах магазина

const body = document.querySelector('body')
const shopingCartIcon = document.querySelector('#shoping-cart-icon')
const shopingCartContainer = document.querySelector('#shoping-cart')
const shopingCartList = document.querySelector('#shoping-cart-list')
const shopingCartOverlay = document.querySelector('#shoping-cart-overlay')
const cartQty = document.querySelector('[data-cart-quantity]')
const cartTotalSum = document.querySelector('[data-total-sum]')

// Показать/скрыть корзину при клике
shopingCartIcon.addEventListener('click', () => {
  shopingCartContainer.classList.remove('hide')
  shopingCartOverlay.classList.add('show-overlay')
  body.classList.add('overflow-hidden')
  renderCart()
})
shopingCartOverlay.addEventListener('click', () => {
  shopingCartContainer.classList.add('hide')
  shopingCartOverlay.classList.remove('show-overlay')
  body.classList.remove('overflow-hidden')
})

// Добавить товары в корзину, нескольких товаров одного типа
export function addTocart(itemId) {
  const existingItemInCart = shoppingCart.find(tree => tree.id === itemId)

  if (existingItemInCart) {
    existingItemInCart.qty++
  } else {
    shoppingCart.push({ id: itemId, qty: 1 })
  }
  itemsQtyInCartIcon()
}

// Изменение количества в корзине и пересчет суммы корзины
shopingCartContainer.addEventListener('click', e => {
  const eTargetDecreaseQty = e.target.closest('[data-decrease-qty]')
  const eTargetIncreaseQty = e.target.closest('[data-increase-qty]')
  if (eTargetDecreaseQty == null && eTargetIncreaseQty == null) return

  const parentOfItem = e.target.closest('[data-item-in-cart]')
  const itemId = +parentOfItem.dataset.itemId
  const itemQuantityField = e.target.closest('[data-quantity-input]')
    .children[1]
  let itemQuantity = +itemQuantityField.textContent

  const itemInCartArray = shoppingCart.find(item => item.id === itemId)

  if (eTargetDecreaseQty) {
    itemQuantity--
  } else if (eTargetIncreaseQty) {
    itemQuantity++
  }

  if (itemQuantity === 0) {
    const infexOfItem = shoppingCart.indexOf(itemInCartArray)
    shoppingCart.splice(infexOfItem, 1)
    parentOfItem.remove()
  } else {
    itemQuantityField.textContent = itemQuantity
    itemInCartArray.qty = itemQuantity
  }
  totalSumInCart()
  itemsQtyInCartIcon()
})

function renderCart() {
  shopingCartList.innerHTML = ''
  const shoppingCartFragment = new DocumentFragment()

  shoppingCart.forEach(itemToRender => {
    const item = shoppingItems.find(
      itemFromDB => itemToRender.id === itemFromDB.id
    )

    const cartItem = cartItemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector('[data-item-in-cart]')
    container.dataset.itemId = item.id

    const productImage = cartItem.querySelector('[data-item-in-cart-image]')
    productImage.src = item.urlImg

    const productTitle = cartItem.querySelector('[data-item-in-cart-title]')
    productTitle.textContent = item.nameShort

    const productQty = cartItem.querySelector('[data-trees-quantity]')
    productQty.textContent = itemToRender.qty

    const productBriefDesc = cartItem.querySelector('[data-item-in-cart-desc]')
    productBriefDesc.textContent = item.descShort

    const productPrice = cartItem.querySelector('[data-item-in-cart-price]')
    productPrice.textContent = formatCurrency(item.pricePenny / 100)

    shoppingCartFragment.append(cartItem)
  })

  shopingCartList.append(shoppingCartFragment)

  // cartTotalSum.textContent = formatCurrency(totalSumInCart() / 100)
  totalSumInCart()
}

// Подсчет суммы корзины
function totalSumInCart() {
  const totalPenny = shoppingCart.reduce((sum, itemInCart) => {
    const itemInDB = shoppingItems.find(
      itemFromDB => itemInCart.id === itemFromDB.id
    )
    return sum + itemInDB.pricePenny * itemInCart.qty
  }, 0)
  cartTotalSum.textContent = formatCurrency(totalPenny / 100)
}

// Количество товаров на иконке корзины
function itemsQtyInCartIcon() {
  cartQty.textContent = shoppingCart.reduce((sum, item) => {
    return sum + item.qty
  }, 0)
}
