import { useEffect, useState } from "react"
import NftBrowser from "../common/NftBrowser"

function MyNft() {
  const [nfts, setNfts] = useState([])

  useEffect(() => {
    loadNfts();

  }, []);

  const loadNfts = async () => {
    //加载NFT
      setNfts([])
    console.log("mounted!")
  }
  return (
    <div className="main">
      <NftBrowser nfts={nfts} />
    </div>
  )
}
export default MyNft