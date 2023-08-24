import { shoppingItems } from './eshop-app-store.js'
import { formatCurrency } from './utils/formatCurrency.js'
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

// productCardContainer.addEventListener('click', () => console.log('sdfsdfsf'))

// shopingCartContainer.addEventListener('click', e => {
//   const eTargetDecreaseQty = e.target.closest('[data-decrease-qty]')
//   const eTargetIncreaseQty = e.target.closest('[data-decrease-qty]')
//   if (eTargetDecreaseQty == null && eTargetIncreaseQty == null) return

//   const parentOfItem = e.target.closest('[data-item-in-cart]')
//   const itemId = +parentOfItem.dataset.itemId
//   const itemQuantityField = e.target.closest('[data-quantity-input]')
//     .children[1]
//   let itemQuantity = +itemQuantityField.textContent

//   const itemInCartArray = shoppingCart.find(item => item.id === itemId)

//   if (eTargetDecreaseQty) {
//     itemQuantity--
//   } else if (eTargetIncreaseQty) {
//     itemQuantity++
//   }

//   if (itemQuantity === 0) {
//     const infexOfItem = shoppingCart.indexOf(itemInCartArray)
//     shoppingCart.splice(infexOfItem, 1)
//     parentOfItem.remove()
//     cartTotalSumField.classList.add('visibility-hidden')
//   } else {
//     itemQuantityField.textContent = itemQuantity
//     itemInCartArray.qty = itemQuantity
//   }
//   if (shoppingCart.length === 0) {
//     emptycart.classList.remove('display-none')
//   } else {
//     totalSumInCart()
//   }
//   itemsQtyInCartIcon()
//   saveCart()
// })

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
