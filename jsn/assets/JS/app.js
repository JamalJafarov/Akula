const api_url="https://dummyjson.com";
//IIFE
(async function (){
      const allProducts=await getProductList();
      addHTML(allProducts.products);
      searchEngine();
      LoadMoreProducts();
      addCategoryToHTML();
      filterProductByCategory();
      openProductModal();
      stopModalContentClick();
})();


async function getProductList(){
    return await (await fetch(`${api_url}/products`)).json();
}

function addHTML(products){

    if(products && products.length==0){
        document.querySelector(".product-list .row")
        .innerHTML="Product Does Not Found";
        return;
    }
    for(let pro of products){
        const productItemCol=document
        .querySelector(".product-list .product-item")
        .parentNode.cloneNode(true);
        const productItem=productItemCol.querySelector(".product-item")

        productItem.setAttribute("pro-id", pro.id);
        productItem.classList.remove("d-none")
        productItem.querySelector(".pro-img").setAttribute("src", pro.thumbnail)
        productItem.querySelector(".title").innerText=pro.title;
        productItem.querySelector(".price").innerText=pro.price+"AZN";
        productItem.querySelector(".description").innerText=pro.description;
        document.querySelector(".product-list .row").appendChild(productItemCol)


    }
}

function searchEngine(){
    const searchInput=document.querySelector(".search-area input")
    const searchBtn=document.querySelector(".search-area button")
    searchBtn.addEventListener("click", async function(){
    document.querySelector(".product-list .row").innerHTML=""; 

        const searchVal=searchInput.value;
        const searchUrl=api_url+ "/products/search?q="+searchVal;
        const data = await( await fetch(searchUrl)).json();
        addHTML(data.products);
    })
}


function LoadMoreProducts(){
    const btnLoadMore = document.querySelector(".load-more button")
    let skipProduct=0;
    btnLoadMore.addEventListener("click",async function(){
        skipProduct+=30;
        const data = await(await fetch(api_url+ "/products?skip="+skipProduct)).json(); 
        if(skipProduct+data.limit>=data.total){
            btnLoadMore.style.display="none"
        }
        if(skipProduct+data.limit<=data.total){
            addHTML(data.products);

        }

    })

}

async function getCategoryList(){
    return await (await fetch(`${api_url}/products/categories`)).json();
}


async function addCategoryToHTML(){
    const categoryList= await getCategoryList();
    for(let cat of categoryList){
        const bt= document.createElement("button");
        bt.innerText=cat;
            bt.className="btn btn-outline-success me-2 mb-2"
        document.querySelector("#category-area .d-flex").appendChild(bt);
    }
}

async function filterProductByCategory(){
    const categoryBtn=document.querySelector("#category-area .d-flex button");
    for(let cat of categoryBtn){
        cat.onclick=async function(){
            document.querySelector(".product-list .row").innerText="";
            const categoryText=this.innerText;
            const productList= await getProductListForCategory(categoryText);
            addHTML(productList.products)
        }
    }
}

async function getProductListForCategory(catName){
    return await (await fetch(`${api_url}/products/category/${catName}`)).json();
}

async function getproductById(pId){
    return await(await fetch(`${api_url}/products/${pId}`)).json();
}

function openProductModal(){
    const productItems= document.querySelectorAll(".product-item")
    for(let pro of productItems){
        pro.onclick= async function(){
            const modal = document.getElementById("my-modal");
            modal.classList.add("modal-active");
            const productId=this.getAttribute("pro-id")
            const productInfo = await getproductById(productId);
            addModalHTML(productInfo);


        }
    }
}

function closeModal(){
    const myModal = document.getElementById("my-modal");
    myModal.classList.remove("modal-active");

}

function stopModalContentClick(){
    const modalContent =document.querySelector("#my-modal .modal-middle");
    modalContent.onclick= function(c){
        c.stopPropagation();
    }
}

function addModalHTML(prod){
    const myModal=document.getElementById("my-modal");
    const modalImg=myModal.querySelector(".modal-img img");
    const modelProductTitle=myModal.querySelector(".modal-product-content h4")
    const modelProductDesc=myModal.querySelector(".modal-product-content .modal-desc")
    const modelProductPrice=myModal.querySelector(".modal-product-content .modal-price")

    modelProductTitle.innerText=prod.title;
    modelProductDesc.innerText=prod.description;
    modelProductPrice.innerText=prod.price+"AZN";
    modalImg.src=prod.thumbnail;


}

function changeMode(){
    const darkModeBtn= document.querySelector(".dark-mode");
    const lightModeBtn= document.querySelector(".light-mode");
    const changeModeBtn= document.querySelector(".change-mode");

    changeModeBtn.onclick=function(){
        const modeLocal=localStorage.getItem("color-mode");
        localStorage.setItem("mode","dark");
        if(modeLocal && modeLocal==="light"){
            localStorage.setItem("color-mode","dark");
        }
        else{
            localStorage.setItem("color-mode","light");
        }

        // const findMode = this.
    }
}