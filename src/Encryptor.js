const _sodium = require('libsodium-wrappers');

module.exports= async(sharedRx) => {
    await _sodium.ready;
    let sodium = _sodium;
    let ciphertext, nonce;
    return Object.freeze({ 
        encrypt: (msg, nonce) => {
            return sodium.crypto_secretbox_easy(msg,nonce,sharedRx);
        }   
    });
}