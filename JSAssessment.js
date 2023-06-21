
let numberOfNFTs = 0;

let nftMetadata = {};

function mintNFT(name, description, image) {
  // Create an NFT object with metadata
  const newNFT = {
    name: name,
    description: description,
    image: image
  };

  // Store the NFT in the variable and increment the count
  numberOfNFTs++;
  nftMetadata[numberOfNFTs] = newNFT;
}

function listNFTs() {
  for (let nftId in nftMetadata) {
    const nft = nftMetadata[nftId];
    console.log("Name: " + nft.name);
    console.log("Description: " + nft.description);
    console.log("Image: " + nft.image);
    console.log("-------------------");
  }
}

function getTotalSupply() {
  return numberOfNFTs;
}

mintNFT("NFT 1", "This is the first NFT", "image1.jpg");
mintNFT("NFT 2", "This is the second NFT", "image2.jpg");

listNFTs(); 
console.log("Total NFTs: " + getTotalSupply()); 
