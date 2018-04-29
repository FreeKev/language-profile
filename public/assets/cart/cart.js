
function updateShoppingCartBadge() {
  let gifts = sessionStorage.getItem("giftamt") || "[]";
  gifts = JSON.parse(gifts);

  if (gifts.length > 0) {
    $("#shoppingCartBadge").html(gifts.length);
    $("#shoppingCartBadge").addClass("has-items")
  }
  else {
    $("#shoppingCartBadge").html("")
    $("#shoppingCartBadge").removeClass("has-items")
  }
}

$('.donate-btn').click(function(e) {
  let donateAmount = Number($(e.target).attr('data-price'));
  let gifts = sessionStorage.getItem("giftamt") || "[]";
  gifts = JSON.parse(gifts);
  gifts.push(donateAmount);
  sessionStorage.setItem("giftamt", JSON.stringify(gifts));

  updateShoppingCartBadge();

  // show notification - $50 dollar donation added to Cart

  // http post to put cart into database
  let cartId = sessionStorage.getItem("cartId")
  let postData = { gifts: JSON.stringify(gifts), projectName: window.projectName}
  if (cartId) {
    postData.cartId = cartId;
  }

  $.post( "/update-cart",
    postData,
    (data) => {
      if (data.cartId) {
        sessionStorage.setItem("cartId", data.cartId);
      }
      console.log("post to cart success")
    }
  );
})

updateShoppingCartBadge()

// document.getElementById("result").innerHTML = localStorage.getItem("lastname");
