function TreeChart() {
  var init = function init(treeData, containerID) {
    this.treeData = treeData;
    this.containerID = containerID;
    this.containerIDElm = document.getElementById(this.containerID);
  };

  var createTemplate = function () {
    console.log("Tree data -> ", this.treeData);
    if (this.treeData && this.treeData.length) {
      const constructedTree = createTreeElements(
        this.treeData,
        this.containerID
      );
      this.containerIDElm.appendChild(constructedTree);
    } else {
      this.containerIDElm.innerText = "No Data found";
    }
    addClickListener.call(this);
  };

  function createTreeElements(treeData, containerID, isHidden) {
    let treeContainer = document.createElement("ul");
    treeContainer.setAttribute("id", `${containerID}-tree-container`);
    if (isHidden) {
      treeContainer.className = "hidden";
    } else {
      treeContainer.setAttribute("tabindex", 1);
    }
    treeData.forEach((data) => {
      let elm = document.createElement("li");
      elm.setAttribute("id", `${containerID}-${data.id}`);
      elm.setAttribute("tabindex", 1);
      let iconElm = document.createElement("span");
      let textElm = document.createElement("span");
      textElm.className = "adjustMargin";
      textElm.innerText = data.name;
      if (data.children) {
        iconElm.innerText = "▶";
        elm.appendChild(iconElm);
        elm.appendChild(textElm);
        elm.appendChild(
          createTreeElements(data.children, `${containerID}-${data.id}`, true)
        );
      } else {
        iconElm.innerText = "•";
        elm.appendChild(iconElm);
        elm.appendChild(textElm);
      }

      treeContainer.appendChild(elm);
    });
    return treeContainer;
  }

  function addClickListener() {
    this.containerIDElm.addEventListener("click", onClick.bind(this), false);
  }

  function onClick(event) {
    let nextSibling = event.target.nextSibling;
    if (nextSibling) {
      if (nextSibling instanceof HTMLUListElement) {
        if (nextSibling.className.includes("hidden")) {
          nextSibling.className = nextSibling.className.replace("hidden", "");
          nextSibling.previousSibling.previousSibling.innerText = "▼";
        } else {
          nextSibling.className += " hidden";
          nextSibling.previousSibling.previousSibling.innerText = "▶";
        }
      } else {
        nextSibling = nextSibling.nextSibling;
        if (nextSibling instanceof HTMLUListElement) {
          if (nextSibling.className.includes("hidden")) {
            nextSibling.className = nextSibling.className.replace("hidden", "");
            nextSibling.previousSibling.previousSibling.innerText = "▼";
          } else {
            nextSibling.className += " hidden";
            nextSibling.previousSibling.previousSibling.innerText = "▶";
          }
        }
      }
    }
  }

  return {
    init: init,
    createTemplate: createTemplate,
  };
}

function getBackendData(conatinerID) {
  fetchData()
    .then((treeData) => {
      console.log("Data Successfully retrieved");
      loadTree(treeData, conatinerID);
    })
    .catch((error) => {
      console.log("Error in getting abckend Data -> ", error);
    });
}

function loadTree(treeData, conatinerID) {
  const tree1 = TreeChart();
  tree1.init(treeData, conatinerID);
  tree1.createTemplate();
}

getBackendData("container-tree");
