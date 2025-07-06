import 'react-native-get-random-values';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import * as Crypto from 'expo-crypto';
import { APP_URL, REDIRECT_URI, PHANTOM_CLUSTER } from '../constants/AppConfig';
import * as Linking from 'expo-linking';

export type PhantomSession = {
    nonce: string;
    dappEncryptionPublicKey: string;
    dappSecretKey: Uint8Array;
};

export const generatePhantomSession = async (): Promise<PhantomSession> => {
    const nonceBytes = await Crypto.getRandomBytesAsync(24);
    const nonce = bs58.encode(nonceBytes);
    const keypair = nacl.box.keyPair();

    return {
        nonce,
        dappEncryptionPublicKey: bs58.encode(keypair.publicKey),
        dappSecretKey: keypair.secretKey,
    };
};

export const openPhantomConnect = async (session: PhantomSession) => {
    const url = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(APP_URL)}&redirect_link=${encodeURIComponent(
        REDIRECT_URI
    )}&dapp_encryption_public_key=${session.dappEncryptionPublicKey}&nonce=${session.nonce}&cluster=${PHANTOM_CLUSTER}`;

    console.log('🔗 Opening Phantom Connect URL:', url);
    await Linking.openURL(url);
};

export const decryptPhantomPayload = ({
    data,
    nonce,
    phantomEncryptionPublicKey,
    dappSecretKey,
}: {
    data: string;
    nonce: string;
    phantomEncryptionPublicKey: string;
    dappSecretKey: Uint8Array;
}): string | null => {
    const sharedSecret = nacl.box.before(
        bs58.decode(phantomEncryptionPublicKey),
        dappSecretKey
    );

    const decrypted = nacl.box.open.after(
        bs58.decode(data),
        bs58.decode(nonce),
        sharedSecret
    );

    if (!decrypted) return null;

    return new TextDecoder().decode(decrypted);
};