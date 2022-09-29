import axios from "axios";
import CID from 'cids'
import crypto from 'crypto'
import { providers } from "near-api-js";
import { AdminUsers, SERVER_URL } from '../config/config'
import { toast } from 'react-toastify';

const discordUserData = JSON.parse(localStorage.getItem("discordUser"));

const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.mainnet.near.org"
);


export const checkAdmin = () => {
  const admin = AdminUsers.find((item) => item === discordUserData?.username || item === discordUserData?.id)
  return admin ? true : false;
}



export const createUser = async (data) => {
  return await axios.post(`${SERVER_URL}/create-user`, data);
}

export const checkWallet = async (data) => {
  return await axios.post(`${SERVER_URL}/check-wallet`, data);
}

export const createRaffle = async (data) => {
  return await axios.post(`${SERVER_URL}/create`, data);
}

export const buyRaffleTicket = async (data) => {
  return await axios.post(`${SERVER_URL}/buy`, data);
}

export const getRaffles = async () => {
  return await axios.get(`${SERVER_URL}/get`);
}

export const getWinner = async (rId) => {
  return await axios.post(`${SERVER_URL}/get_winner`, rId);
}

export const checkNFT = async (nId) => {
  return await axios.post(`${SERVER_URL}/check-id`, nId);
}




export const createNotify = async (type, message) => {
  let toastData = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }
  switch (type) {
    case 'info':
      toast.info(message, toastData);
      break;
    case 'success':
      toast.success(message, toastData);
      break;
    case 'warning':
      toast.warn(message, toastData);
      break;
    case 'error':
      toast.error(message, toastData);
      break;
    default:
      toast(message, toastData);
      break;
  }
}

export const getState = async (txHash, accountId) => {
  const result = await provider.txStatus(txHash, accountId);
  return result;
}



export function truncate(
  text = '',
  [h, t] = [6, 6],
) {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}

export function truncateEvm(text = '') {
  return truncate(text, [10, 10]);
}




//////NFT image URL-----
export default function sha1(data, encoding) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest(encoding || 'hex')
}

export const getNFTimageURL = async (contratId, tokenId) => {
  const seriesId = tokenId.split(':')[0];
  const token = await axios.get(`https://api-v2-mainnet.paras.id/token/${contratId}::${seriesId}/${tokenId}`);
  const { metadata, isMediaCdn } = token.data;
  return parseImgUrl(metadata.media, null, {
    width: `600`,
    useOriginal: true,
    isMediaCdn: isMediaCdn,
  })
}

const parseImgUrl = (imgUrl, defaultValue = '', opts = {}) => {
  console.log(imgUrl)
  if (!imgUrl) {
    return defaultValue
  }
  let url = imgUrl.includes('://') ? imgUrl : `ipfs://${imgUrl}`
  let schema = url.split('://')[0]
  let transformationList = []
  if (opts.width) {
    transformationList.push(`w=${opts.width}`)
    !opts.seeDetails && transformationList.push(`auto=format,compress`)
  } else {
    transformationList.push('w=800')
    !opts.seeDetails && transformationList.push(`auto=format,compress`)
  }
  if (schema === 'ipfs') {
    let parts = url.split('/')
    let hash = parts[2]
    let path = parts.length > 3 ? `/${parts.slice(3).join('/')}` : ''
    let cid
    try {
      cid = new CID(hash)
    } catch (e) {
      console.error(`Unable to parse CID: ${hash}`, e)
      return imgUrl
    }

    if (opts.useOriginal || process.env.APP_ENV !== 'production') {
      if (cid.version === 0) {
        return `https://ipfs-gateway.paras.id/ipfs/${cid}${path}`
      } else {
        return `https://ipfs.fleek.co/ipfs/${cid}${path}`
      }
    }
    return `https://paras-cdn.imgix.net/${cid}${path}?${transformationList.join('&')}`
  } else if (opts.isMediaCdn) {
    const sha1Url = sha1(imgUrl)
    return `https://paras-cdn.imgix.net/${sha1Url}?${transformationList.join('&')}`
  }
  return imgUrl
}

