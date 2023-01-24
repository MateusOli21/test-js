function createButton() {
  console.log("COMEÇANDO SCRIPT")
  let baseComp = document.createElement("div");
  let paragraph = document.createElement("p");
  paragraph.style.backgroundColor = "#5386E4"
  paragraph.style.color = "#fff"
  paragraph.style.padding = "8px"
  paragraph.style.borderRadius = "8px"
  baseComp.append("Testando elemento", paragraph);
  
  console.log("CRIADO ELEMENTO P")
  let teste = document.getElementsByClassName("price-holder");
  
  console.log("BUSCANDO ELEMENTO PRICE-HOLDER", teste)
  teste[0].appendChild(baseComp);

  baseComp.addEventListener("click", function () {
    alert("Fui clicado");
  });
  
  console.log("FIM DO SCRIPT")
}

createButton()
