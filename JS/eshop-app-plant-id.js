import { shoppingItems } from './eshop-app-store.js'
import { formatCurrency } from './utils/formatCurrency.js'
import { addTocart } from './eshop-app-cart.js'
const productPageUrl = document.location.href
const pageId = +productPageUrl.match(/(?<=id)\d*/)[0]

const parser = new DOMParser()
const idURL = 'plant-id-template.tpl'
const responseFromIdUrl = await fetch(idURL)
const textFromIdUrl = await responseFromIdUrl.text()

const plantTemplateHtml = parser.parseFromString(textFromIdUrl, 'text/html')

const productCardTemplate = plantTemplateHtml.querySelector(
  '#product-card-template'
)

const placeToAppendCard = document.querySelector('#placeToAppendCard')
const productCardFromTemplate = productCardTemplate.content.cloneNode(true)

const productCardContainer =
  productCardFromTemplate.querySelector('[data-product-id]')

renderFullProductCard()
const itemQuantityField = document.querySelector('[data-trees-quantity]')

let itemQuantity = +itemQuantityField.textContent

productCardContainer.addEventListener('click', e => {
  const eTargetDecreaseQty = e.target.closest('[data-decrease-qty]')
  const eTargetIncreaseQty = e.target.closest('[data-increase-qty]')
  const addToCartButtonPressed = e.target.matches('[data-add-to-cart-button]')
  console.log(addToCartButtonPressed)
  if (
    eTargetDecreaseQty == null &&
    eTargetIncreaseQty == null &&
    addToCartButtonPressed === false
  )
    return

  if (addToCartButtonPressed === true) {
    console.log('Add button')
    addTocart(pageId, itemQuantity)
    return
  } else if (eTargetDecreaseQty) {
    console.log('Minus')
    itemQuantity--
  } else if (eTargetIncreaseQty) {
    console.log('plus')
    itemQuantity++
  }
  if (itemQuantity === 0) {
    itemQuantity = 1
    return
  }
  itemQuantityField.textContent = itemQuantity
})

function renderFullProductCard() {
  const item = shoppingItems.find(itemFromDB => pageId === itemFromDB.id)

  productCardContainer.dataset.itemId = pageId

  const productImage = productCardFromTemplate.querySelector(
    '[data-product-image]'
  )
  productImage.src = item.urlImg

  const productTitle = productCardFromTemplate.querySelector(
    '[data-product-title]'
  )
  productTitle.textContent = item.nameLong

  const productDesc = productCardFromTemplate.querySelector(
    '[data-product-desc]'
  )
  productDesc.textContent = item.descLong

  const productPriceInPenny = productCardFromTemplate.querySelector(
    '[data-product-price]'
  )
  productPriceInPenny.textContent = formatCurrency(item.pricePenny / 100)
  // console.log(productCardFromTemplate)

  placeToAppendCard.append(productCardFromTemplate)
}
