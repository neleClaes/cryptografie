const _sodium = require('libsodium-wrappers');

module.exports = async () => {
    await _sodium.ready;
    const sodium = _sodium;

    return Object.freeze({
        verify: (hashedPass, pass) => {
            if(!hashedPass || !pass){
                throw  'Missing parameter';
            }
            return sodium.crypto_pwhash_str_verify(hashedPass,pass);
        }    
    });
}