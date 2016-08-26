var products = {};
var cart = {};
$.get("https://jsonhost-d6ae1.firebaseapp.com/hockeystore.json")
  .then((data) => {
    products = data;
    setUpInventory();
    //getFeaturedItems();
    addNavCategories();
    $(".jumbotron").show();
    $("#enterStore").click(function() {
      $(".jumbotron").hide();
      $("main").show();
      //$(".myMain2").css('display', 'flex');
    })
    $('.navCat').click(function() {
      $(".threeFour").empty();
      showCategory(getRidOfSpaces($(this).text()));
    })
    $('.navbar-form').submit(function(event) {
      event.preventDefault();
      $(".jumbotron").hide();
      $("main").show();
      //$(".myMain2").css('display', 'flex');
      searchForSomething($(".myInput").val());
      $(".myInput").val('');
    })
    $('.searchButton2').click(function() {
      $(".jumbotron").hide();
      $("main").show();
      //$(".myMain2").css('display', 'flex');
      searchForSomething($(".myInput2").val());
      $(".myInput").val('');
    })
    $('.cartLink').click(function() {
      $(".jumbotron").hide();
      $("main").show();
      //$(".myMain2").css('display', 'flex');
      console.log("trying")
      showCart();
      //showCart2();
    })
    $('.goHome').click(function() {
      $("main").hide();
      $(".jumbotron").show();
      //$(".myMain2").hide();
    })
    // $('.inventoryFilterSelector').change(function() {
    //   $('.mainGallery').empty();
    //   if ($(this).val() === "Featured") {
    //     showFeaturedItems();
    //   } else {
    //     showCategory2(getRidOfSpaces($(this).val()));
    //   }
    // })
  })

skus = [];
categories = []; //category names
categoryImages = {};
brands = []; //brand names
kinds = [];//different product kinds (maybe rename this because its confusing as fuck)
inventoryBySKU = {}; //product inventory where keys are product SKU's
inventoryByCategory = {}; //keys are category names with values of arrays containing different product objects
inventoryByBrand = {};
inventoryByKind = {};
featuredItems = {};

function getRidOfSpaces(str) {
  let arr = []
  for (s in str.split("")) {
    if (str[s] === " ") {
      arr.push("_")
    } else {
      arr.push(str[s])
    }
  }
  return arr.join("")
}

function getRidOfUnderscores(str) {
  let arr = []
  for (s in str.split("")) {
    if (str[s] === "_") {
      arr.push(" ")
    } else {
      arr.push(str[s])
    }
  }
  return arr.join("")
}

//this is gonna fill up our inventory objects and the category array
function setUpInventory() {
    for (p of products) {
      p.Category = getRidOfSpaces(p.Category); //gets rid of spaces in category names and replaces them with _'s
      p.Brand = getRidOfSpaces(p.Brand);
      if (p.Kind === undefined) {
        p.Kind = "";
      } else {
        p.Kind = getRidOfSpaces(p.Kind);
      }
      let newT = [];
      for (let j of p.Type.split(" ")) {
        if (j !== p.Brand) {
          newT.push(j);
        }
      }
      skus.push(p.SKU);
      p.Type = newT.join(" ");
      inventoryBySKU[p.SKU] = p; //puts the product into inventory w/ the SKU as a key

      if (inventoryByCategory[p.Category] === undefined) {
        categories.push(p.Category);
        categoryImages[p.Category] = p.ImgUrl;
        inventoryByCategory[p.Category] = [];
      };
      inventoryByCategory[p.Category].push(p);

      if (inventoryByBrand[p.Brand] === undefined) {
        brands.push(p.Brand);
        inventoryByBrand[p.Brand] = [];
      };
      inventoryByBrand[p.Brand].push(p);


      if (inventoryByKind[p.Kind] === undefined) {
        kinds.push(p.Kind);
        inventoryByKind[p.Kind] = [];
      };
      inventoryByKind[p.Kind].push(p);
    };
};

function makeItemObject(sku) {
    item = inventoryBySKU[sku];
    itemObject = $('<div class="card col-lg-3 col-md-4 col-sm-6 col-xs-12">\
      <div class="myCard">\
        <div class="cardPhotoHolder">\
          <img class="card-img-top cardPhoto" src="'+item.ImgUrl+'" alt="Card image cap" width="200px">\
        </div>\
        <div class="card-block cardBlock" id="cardBlock'+item.SKU+'">\
          <div class="row">\
            <div class="myLeftLogo">\
              <img class="cardLogo" src="logos/'+item.Brand+'.png" alt="Card image cap" height="40px" width="40px">\
            </div>\
            <div class="myRightTitle">\
              <h6 class="card-title itemTitle">'+item.Type+' '+getRidOfUnderscores(item.Kind)+'</h6>\
            </div>\
          </div>\
          <p class="card-text">'+item.Price+'</p>\
          <div class="adderSection">\
            <input type="number" class="form-control nToAdd" id="nToAddof'+item.SKU+'" value="1">\
            <button type="button" class="btn btn-primary form-control itemAdder" id="itemAddBtn'+item.SKU+'" onclick="confirmAdd('+item.SKU+')">Add to Cart</button>\
          </div>\
        </div>\
      </div>\
    </div>');
    return itemObject;
}

// function makeItemObject2(sku) {
//     item = inventoryBySKU[sku];
//     itemObject = $('<div class="card myCard2">\
//         <div class="cardPhotoHolder">\
//           <img class="card-img-top cardPhoto" src="'+item.ImgUrl+'" alt="Card image cap" width="200px">\
//         </div>\
//         <div class="card-block cardBlock" id="cardBlock'+item.SKU+'">\
//           <div>\
//             <div class="myLeftLogo">\
//               <img class="cardLogo" src="logos/'+item.Brand+'.png" alt="Card image cap" height="40px" width="40px">\
//             </div>\
//             <div class="myRightTitle">\
//               <h6 class="card-title itemTitle">'+item.Type+' '+getRidOfUnderscores(item.Kind)+'</h6>\
//             </div>\
//           </div>\
//           <p class="card-text itemPrice">'+item.Price+'</p>\
//           <div class="adderSection">\
//             <input type="number" class="form-control nToAdd" id="nToAddof'+item.SKU+'" value="1">\
//             <button type="button" class="btn btn-primary form-control itemAdder" id="itemAddBtn'+item.SKU+'" onclick="confirmAdd('+item.SKU+')">Add to Cart</button>\
//           </div>\
//         </div>\
//       </div>');
//     return itemObject;
// }

function replaceItemGuts(sku) {
    let item = inventoryBySKU[sku];
    console.log(item)
    itemObject = $('<div class="row">\
            <div class="myLeftLogo">\
              <img class="cardLogo" src="logos/'+item.Brand+'.png" alt="Card image cap" height="40px" width="40px">\
            </div>\
            <div class="myRightTitle">\
              <h6 class="card-title itemTitle">'+item.Type+' '+getRidOfUnderscores(item.Kind)+'</h6>\
            </div>\
          </div>\
          <p class="card-text">'+item.Price+'</p>\
          <div class="adderSection">\
            <input type="number" class="form-control nToAdd" id="nToAddof'+item.SKU+'" value="1">\
            <button type="button" class="btn btn-primary form-control itemAdder" id="itemAddBtn'+item.SKU+'" onclick="confirmAdd('+item.SKU+')">Add to Cart</button>\
          </div>\
          ');
    console.log(itemObject);
    $("#cardBlock"+sku).append(itemObject);
}

function addNavCategories() {
  for (let c in categories.sort()) {
    let newobj = $('<li class="nav-item navCat"><img src="'+categoryImages[categories[c]]+'" class="catImage">'+getRidOfUnderscores(categories[c])+'</li>');
    $('.catSelector').append(newobj);
    // let newobj2 = $('<option value="'+getRidOfUnderscores(categories[c])+'" class="inventoryFilter">'+getRidOfUnderscores(categories[c])+'</option>');
    // $('.inventoryFilterSelector').append(newobj2);
  }
}

// function getFeaturedItems() {
//   $('.mainGallery').empty();
//   for (i = 0; i < 4; i++) {
//     let randy = Math.random();
//     let indyOfRandy = ((skus.length)*randy).toFixed(0);
//     let randySKU = skus[indyOfRandy];
//     if (featuredItems[randySKU] === undefined) {
//       featuredItems[randySKU] = inventoryBySKU[randySKU];
//     } else {
//       i--;
//     }
//   }
//   showFeaturedItems();
// }

// function showFeaturedItems() {
//   for (i in featuredItems) {
//     let itemObject = makeItemObject2(i);
//     $('.mainGallery').append(itemObject);
//   }
// }

function showCategory(cat) {
  let theWholeCategory = inventoryByCategory[cat];
  for (let c of theWholeCategory) {
    let obj = makeItemObject(c.SKU);
    $(".threeFour").append(obj);
  }
  $(".pageTitle").text(getRidOfUnderscores(cat));
}

// function showCategory2(cat) {
//   let theWholeCategory = inventoryByCategory[cat];
//   for (let c of theWholeCategory) {
//     let obj = makeItemObject(c.SKU);
//     $(".mainGallery").append(obj);
//   }
//   //$(".pageTitle").text(getRidOfUnderscores(cat));
// }

function changeTitleAndEmpty(str) {
  $('.pageTitle').text(str);
  $(".threeFour").empty();
}

function showAllOfBrand(brand) {
  let theWholeBrand = inventoryByBrand[brand];
  for (let b of theWholeBrand) {
    let obj = makeItemObject(b.SKU);
    $(".threeFour").append(obj);
  }
}

function showAllOfKind(kind) {
  let theWholeKind = inventoryByKind[kind];
  for (let k of theWholeKind) {
    let obj = makeItemObject(k.SKU);
    $(".threeFour").append(obj);
  }
}

function showSKU(sku) {
  let obj = makeItemObject(sku);
  $(".threeFour").append(obj);
}

function searchForSomething(sVal) {
  $(".threeFour").empty();
  var searchMethod = $("#select").val();
  var searchValue = sVal;
  console.log("searching for the term '"+searchValue+"'");
  console.log("searching by "+searchMethod)
  switch (searchMethod) {
    case 'Brand':
      for (brand of brands) {
        if (getRidOfUnderscores(brand).toLowerCase() == searchValue.toLowerCase()) {
          changeTitleAndEmpty(brand);
          showAllOfBrand(brand);
          break;
        }
      }
      console.error("No brand of '"+searchValue+"' was found.")
      break;
    case 'Kind':
      for (kind of kinds) {
        if (getRidOfUnderscores(kind).toLowerCase() == searchValue.toLowerCase()) {
          changeTitleAndEmpty(kind);
          showAllOfKind(kind);
          break;
        }
      }
      console.error("No kind of '"+searchValue+"' was found.");
      break;
    case 'SKU':
        if (inventoryBySKU[searchValue] === undefined) {
          console.error("No SKU of '"+searchValue+"' was found.'");
        } else {
          changeTitleAndEmpty("SKU");
          showSKU(searchValue);
        }
      break;
    case 'Everything':
      let k = false;
      let b = false;
      let s = false;
      let c = false;
      let cmatches = [];

      for (cat of categories) {
        if (cat.toLowerCase().indexOf(getRidOfSpaces(searchValue).toLowerCase()) !== -1) {
          c = true;
          cmatches.push(cat)
        }
      }
      for (brand of brands) {
        if (getRidOfUnderscores(brand).toLowerCase() == searchValue.toLowerCase()) {
          b = brand;
        }
      }
      for (kind of kinds) {
        if (getRidOfUnderscores(kind).toLowerCase() == searchValue.toLowerCase()) {
          k = kind;
        }
      }
      if (inventoryBySKU[searchValue]) {
        s = searchValue;
      }
      if (b !== false || k !== false || s !== false || c !== false) {
        changeTitleAndEmpty("All Results");
        if (b !== false) {
          showAllOfBrand(b);
        }
        if (k !== false) {
          showAllOfKind(k);
        }
        if (s !== false) {
          showSKU(s);
        }
        if (c !== false) {
          for (match of cmatches) {
            showCategory(match);
          }
        }
      } else {
        console.error("Nothing was found matching the term '"+searchValue+"'.")
      }
      break;
    default:
      console.error("Search error. Invalid Method.")
    }
}

var beingAdded = null;

function addItemToCart(sku, n) {
  console.log("Adding '"+n+"' of '"+sku+"' to the cart.");
  console.log(inventoryBySKU[sku]);
  if (cart[sku] === undefined) {
    cart[sku] = n;
  } else {
    cart[sku] += n;
  }
  updateCartCount();
  $(".addConfirmBox").remove();
  replaceItemGuts(sku);
  beingAdded = null;
}

function confirmAdd(sku) {
  if (beingAdded !== null) {
    cancelAdd(beingAdded);
    console.log(beingAdded)
  }
  beingAdded = sku;
  console.log(beingAdded," being added");
  var numberToAdd = $("#nToAddof"+sku).val();
  if (numberToAdd <= 0) {
    alert("Cannot add negative quantities.")
    $("#nToAddof"+sku).val(1);
    return false;
  }
  tempConfirm = $('<div class="addConfirmBox">\
    <div class="modal-dialog modal-sm myModal" role="document">\
      <div class="">\
        Add '+numberToAdd+' to your cart?\
      </div><br>\
      <button type="button" class="btn btn-danger" onclick="cancelAdd('+sku+');">No</button>\
      <button type="button" class="btn btn-success" onclick="addItemToCart('+sku+', '+numberToAdd+')">Yes</button>\
    </div>\
  </div>');
  $("#cardBlock"+sku).empty();
  $("#cardBlock"+sku).append(tempConfirm);
}

function cancelAdd(sku) {
  console.log("bye confirm box");
  $(".addConfirmBox").remove();
  console.log("Replacing guts ",sku);
  replaceItemGuts(sku);
}


function makeCart() {
  let c = $('<div class="myCart">\
      <div class="cartRow cartTitles">\
        <div class="cartRowLogo">\
          Picture\
        </div>\
        <span class="myCenterTitle cartRowTitle">Item</span>\
        <span class="cartRowUnit">Unit</span>\
        <span class="cartRowQuantity">Qty</span>\
        <span class="myRightPrice cartRowPrice">Price</span>\
      <div>\
    </div>\
  ');
  for (item in cart) {
    let i = makeItemInCart(item,cart[item])
    c.append(i);
  }
  let t = makeCartTotals();
  c.append(t);
  let s = $('<div class="cartRow">\
      <input type="button" value="submit" onclick="processOrder()">\
    </div>\
    ');
  c.append(s);
  return c;
}

function processOrder() {
  alert("Your order has been submitted.");
  cart = {};
  updateCartCount();
  $('.threeFour').empty();
  showCart();
}

function makeItemInCart(sku, n) {
  let item = inventoryBySKU[sku];
  let itemSub = ((Number(item.Price.replace("$","")))*n).toFixed(2);
  let i = $('<div class="cartRow anItemInCart">\
      <div class="cartRowLogo">\
        <img class="cardLogo" src="'+item.ImgUrl+'" alt="Card image cap" height="40px" width="40px">\
      </div>\
      <span class="myCenterTitle cartRowTitle">'+getRidOfUnderscores(item.Brand)+' '+item.Type+' '+getRidOfUnderscores(item.Kind)+'</span>\
      <span class="cartRowUnit">'+item.Price+'</span>\
      <span class="cartRowQuantity">\
        <button value="-" class="btn-danger oneLessButton" onclick=oneLess('+sku+')>-</button>\
        '+n+'\
        <button value="-" class="btn-success oneMoreButton" onclick=oneMore('+sku+')>+</button>\
      </span>\
      <span class="myRightPrice cartRowPrice">$'+itemSub+'</span>\
    </div>\
  ');
  return i;
}

function oneLess(sku) {
  console.log("Removing one of ",sku," from the cart.")
  if (cart[sku] === 1) {
    delete cart[sku];
  } else {
    cart[sku] -= 1;
  }
  console.log(cart[s]);
  updateCartCount();
  showCart();
}

function oneMore(sku) {
  console.log("Adding one of ",sku," to the cart.")
  cart[sku] += 1;
  updateCartCount();
  showCart();
}

function makeCartTotals() {
  let tempt = 0;
  for (item in cart) {
    let iinfo = inventoryBySKU[item];
    let icount = cart[item];
    let iprice = Number(iinfo.Price.replace("$",""));
    let isub = iprice*icount;
    tempt += isub;
  }
  let r = $('<div class="cartRow cartTotals">\
        <span class="myCenterTitle cartRowTotal">Total</span>\
        <span class="myRightPrice cartTotal">$'+tempt.toFixed(2)+'</span>\
      <div>\
  ');
  return r;
}

function showCart() {
    $('.pageTitle').text("Cart");
    $(".threeFour").empty();
    let c = makeCart();
    $(".threeFour").append(c);
}
// function showCart2() {
//     $(".mainGallery").empty();
//     let c = makeCart();
//     $(".mainGallery").append(c);
// }

function hideCart() {

}

function updateCartCount() {
  var cnt = 0;
  for (c in cart) {
    cnt+=cart[c]
  }
  $('.cartCounter').text(cnt);
}
