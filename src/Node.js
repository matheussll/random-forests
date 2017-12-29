class Node {
  constructor(father, attributeIndex, sons, value) {
    this.father = father;
    this.attributeIndex = attributeIndex;
    this.sons = sons;
    this.value = value;
  }
}

export default Node;
