const _sodium = require('libsodium-wrappers');

module.exports = async() => {
    await _sodium.ready;
    let sodium = _sodium;

    const {publicKey, privateKey} = sodium.crypto_sign_keypair();

    return Object.freeze({
        verifyingKey : publicKey,
        sign: (msg) => {
            return sodium.crypto_sign(msg, privateKey);
        }
    });
}