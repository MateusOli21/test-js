function createButton() {
  let baseComp = document.createElement("div");
  baseComp.style.backgroundColor = "#5386E4"
  baseComp.style.padding = "8px"
  baseComp.style.borderRadius = "8px"
  baseComp.style.width = "fit-content"
  
  let paragraph = document.createElement("p");
  paragraph.style.color = "#fff"
  paragraph.append("Compre com Mercado Credits")
  
  baseComp.append(paragraph);
  
  let teste = document.getElementsByClassName("price-holder");
  console.log("BUSCANDO ELEMENTO PRICE-HOLDER", teste)
  teste[0].appendChild(baseComp);

  baseComp.addEventListener("click", function () {
    alert("Fui clicado");
  });
  console.log("FIM DO SCRIPT")
}

createButton()
