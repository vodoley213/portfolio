import { formatCurrency } from './utils/formatCurrency.js'

const storeItemTemplate = document.querySelector('#city-card-template')
const itemsBlock = document.querySelector('#products-block')

const URL = '/assets/plants.json'
const responseFromUrl = await fetch(URL)
const shoppingItems = await responseFromUrl.json()

// console.log(shoppingItems)

export function setupShop() {
  shoppingItems.forEach(renderShopingCard)
}

function renderShopingCard(item) {
  const shoppingItem = storeItemTemplate.content.cloneNode(true)
  // console.log('shoppingItem: ', shoppingItem)

  const container = shoppingItem.querySelector('[data-shopping-item]')
  container.dataset.itemId = item.id

  const productImage = shoppingItem.querySelector('[data-product-image]')
  productImage.src = item.URL

  const productTitle = shoppingItem.querySelector('[data-product-title]')
  productTitle.textContent = item.nameShort

  const productBriefDesc = shoppingItem.querySelector(
    '[data-product-brief-desc]'
  )
  productBriefDesc.textContent = item.descShort

  const productPrice = shoppingItem.querySelector('[data-product-price]')
  productPrice.textContent = formatCurrency(item.pricePenny / 100)

  itemsBlock.append(shoppingItem)

  // console.log('shoppingItem after initialising: ', shoppingItem)
}

// ----- Additional functions -----
