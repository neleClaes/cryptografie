const _sodium = require('libsodium-wrappers');
const _Decryptor = require('./Decryptor');
const _Encryptor = require('./Encryptor');

let tempObj = async(peer = null) => {
    await _sodium.ready;
    let sodium = _sodium;

    const {publicKey, privateKey} = sodium.crypto_kx_keypair();
    let thisObj = {}, SecureSessionPeer = {}, sessionKeys, encryptor, decryptor, msg_friend;

    if(peer){
        SecureSessionPeer = peer;
        sessionKeys = sodium.crypto_kx_server_session_keys(publicKey, privateKey,peer.publicKey);
        encryptor = await _Encryptor(sessionKeys.sharedTx);
        decryptor = await _Decryptor(sessionKeys.sharedRx);
        await peer.generateCode(publicKey);
    }

    thisObj.publicKey = publicKey;

    thisObj.setSession = (session) => {
        SecureSessionPeer = session;
    }

    thisObj.setMsg = (msg) => {
        msg_friend = msg;
    }

    thisObj.generateCode = async(otherPublicKey) => {
        let sessionKeys = sodium.crypto_kx_client_session_keys(publicKey, privateKey, otherPublicKey);
        encryptor = await _Encryptor(sessionKeys.sharedTx);
        decryptor = await _Decryptor(sessionKeys.sharedRx);
    }

    thisObj.encrypt = (msg) => {
        const nonce= sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        const ciphertext = encryptor.encrypt(msg,nonce);
        return {ciphertext, nonce}
    }

    thisObj.decrypt = (ciphertext, nonce) => {
        return decryptor.decrypt(ciphertext, nonce);
    }

    thisObj.send = (msg) => {
        let encrypted = thisObj.encrypt(msg);
        SecureSessionPeer.setMsg(encrypted);
    }

    thisObj.receive = () => {
        return thisObj.decrypt(msg_friend.ciphertext, msg_friend.nonce);
    }

    if(peer){
        peer.setSession(thisObj);
    }

    return Object.freeze(thisObj);
}


module.exports = tempObj;






