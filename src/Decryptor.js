const _sodium = require('libsodium-wrappers');

module.exports = async(key = false) => {
    await _sodium.ready;
    const sodium = _sodium;
    var _key = key;
    if(!key)
    {
        throw 'no key';
    }
    return Object.freeze(
        {
            decrypt :  (ciphertext, nonce) => {
                if(ciphertext == undefined || nonce == undefined)
                {
                    throw Error;
                }
                return sodium.crypto_secretbox_open_easy(ciphertext,nonce,_key,'uint8array');
            }
        }
    );
}