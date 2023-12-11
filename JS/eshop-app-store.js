import { formatCurrency } from './utils/formatCurrency.js'
import { addTocart } from './eshop-app-cart.js'

const storeItemTemplate = document.querySelector('#shopping-card-template')
const itemsBlock = document.querySelector('#products-block')

const URL = '/JS/plants.json'
const responseFromUrl = await fetch(URL)
export const shoppingItems = await responseFromUrl.json()

// console.log(shoppingItems)

export function setupShop() {
  if (itemsBlock == null) return
  document.addEventListener('click', e => {
    if (e.target.matches('[data-add-to-cart-button]')) {
      const itemId = e.target.closest('[data-shopping-item]').dataset.itemId
      addTocart(+itemId)
    }
  })

  shoppingItems.forEach(renderShopingCard)
}

function renderShopingCard(item) {
  const shoppingItem = storeItemTemplate.content.cloneNode(true)

  const container = shoppingItem.querySelector('[data-shopping-item]')
  container.dataset.itemId = item.id

  const productUrl = shoppingItem.querySelector('[data-link-to-product]')
  productUrl.href = `HTML/${item.URL}`

  const productImage = shoppingItem.querySelector('[data-product-image]')
  productImage.src = item.urlImg

  const productTitle = shoppingItem.querySelector('[data-product-title]')
  productTitle.textContent = item.nameShort

  const productBriefDesc = shoppingItem.querySelector(
    '[data-product-brief-desc]'
  )
  productBriefDesc.textContent = item.descShort

  const productPrice = shoppingItem.querySelector('[data-product-price]')
  productPrice.textContent = formatCurrency(item.pricePenny / 100)

  itemsBlock.append(shoppingItem)
}

// ----- Additional functions -----
