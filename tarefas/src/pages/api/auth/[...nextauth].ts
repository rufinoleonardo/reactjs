import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // ...add more providers here
    ],

    authorization: {
        params: {
            prompt: "consent", // Sempre pede consentimento
            access_type: "offline", // Solicita um refresh token
            response_type: "code", // Usa o fluxo de autorização com o código
        },
    },

    secret: process.env.JWT_SECRET as string /**Criado no https://www.md5hashgenerator.com/ */,
}

export default NextAuth(authOptions)