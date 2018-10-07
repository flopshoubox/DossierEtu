console.log('Début du script');
let scolarityNode = document.getElementsByClassName('profil')[1].childNodes[1];

const semestersTreeWalker = document.createTreeWalker(
  scolarityNode,
  NodeFilter.SHOW_ELEMENT,
  {
    acceptNode: node => {
      if (
        node.nodeName == 'TR' &&
        node.childElementCount > 2 &&
        node.className != 'stotal odd'
      ) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_SKIP;
      }
    }
  },
  false
);
semestersTreeWalker.nextNode();

//Initialisation du tableau qui contiendra toutes les données de scolarité.
const semesters = [];
const category = ['CS', 'TM', 'ST', 'EC', 'ME', 'CT', 'HP', 'NPML'];
//On commence un nouveau semestre
while (semestersTreeWalker.nextNode()) {
  let semesterNode = semestersTreeWalker.currentNode;
  currentSemester = {};
  const termTw = document.createTreeWalker(
    semesterNode,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: node => {
        if (
          node.nodeName == 'TD' &&
          (node.className == 'entete-haut sem' ||
            node.className == 'uvs' ||
            node.className == 'observation')
        ) {
          return NodeFilter.FILTER_ACCEPT;
        } else {
          return NodeFilter.FILTER_SKIP;
        }
      }
    },
    false
  );

  //On récupère les informations sur le semestre
  termTw.nextNode();
  let nodeInfos = termTw.currentNode.textContent.match(/(\w+)/g);
  let infos = {};
  infos['Saison'] = nodeInfos[0];
  infos['Année'] = nodeInfos[1];
  infos['Cursus'] = nodeInfos[2];
  infos['NumSemestre'] = nodeInfos[3];
  if (nodeInfos.length > 4) {
    infos['filière'] = nodeInfos[4];
  }
  currentSemester['infos'] = infos;
  //On récupère les données de chaque catégorie d'Ue
  for (let i = 0; i < 8; i++) {
    uesNode = termTw.nextNode().childNodes[1];
    //On ne traite que les catégories d'ue qui ne sont pas vides
    if (uesNode.childElementCount != 0) {
      const ueTw = document.createTreeWalker(
        uesNode,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: node => {
            return node.nodeName == 'TR'
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
          }
        },
        false
      );
      const ues = [];
      while (ueTw.nextNode()) {
        const ue = {};
        const ueText = ueTw.currentNode.childNodes[1].textContent.match(
          /(\w+)/g
        );
        const ueAffectationSymbol = ueTw.currentNode.childNodes[3].textContent;
        ue['code'] = ueText[0];
        if (ueText.length > 1) {
          ue['résultat'] = ueText[1];
          ue['classement'] = ueText[2];
        }
        ues.push(ue);
      }
      currentSemester[`${category[i]}`] = ues;
    }
  }

  //On s'occupe maintenant de la partie obeservation du semestre
  termTw.nextNode();
  if (termTw.currentNode.childNodes.length > 0) {
    //Si il y a un commentaire
    const decision = termTw.currentNode.childNodes[1].textContent;
    const comment = termTw.currentNode.childNodes[5].textContent;
    currentSemester['observation'] = {
      decision: decision,
      commentaire: comment
    };
  }
  semesters.push(currentSemester);
}
console.log(semesters);
console.log('Fin du script');
