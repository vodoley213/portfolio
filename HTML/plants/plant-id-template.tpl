    <html>
      <template id="product-card-template">
        <article data-product-id class="tree-product-card grid">
          <img data-product-image alt="" />
          <div>
            <h1 data-product-title class="fs-medium-heading dark-color fw-bold">
            </h1>
            <p data-product-desc class="dark-color">
            </p>
                <div data-product-price class="dark-color fw-bold product-card__price margin-bottom-600">
                </div>
                <div class="tree-product-card__add-to-cart-group">
                  <div class="tree-product-card__quantity-input dark-color">
                    <div
                      data-decrease-qty
                      type="button"
                      class="tree-product-card__quantity-change"
                      aria-labelledby="decrease-qty"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18 12H6"
                        ></path>
                      </svg>
                    </div>
                    <div
                      data-trees-quantity
                      class="tree-product-card__quantity-number"
                    >
                      1
                    </div>
                    <div
                      data-increase-qty
                      type="button"
                      class="tree-product-card__quantity-change"
                      aria-labelledby="increase-qty"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <button data-add-to-cart-button class="product-card__button">Добавить в корзину</button>
                </div>
          </div>
        </article>
      </template>
    </html>
