"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Auth0Button({ text = "Continue with Auth0" }: { text?: string }) {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleAuth0SignIn = () => {
        setLoading(true);
        signIn("auth0", { callbackUrl });
    };

    return (
        <button
            onClick={handleAuth0SignIn}
            disabled={loading}
            style={styles.auth0Btn}
        >
            {loading ? (
                <span style={styles.spinner} />
            ) : (
                <>
                    <img
                        src="https://cdn.auth0.com/website/press/resources/auth0-logo-monochrome.svg"
                        alt="Auth0"
                        width={18}
                        height={18}
                        style={{ marginRight: 12, filter: "brightness(0)" }}
                    />
                    {text}
                </>
            )}
        </button>
    );
}

const styles: Record<string, React.CSSProperties> = {
    auth0Btn: {
        width: "100%",
        padding: "12px",
        background: "#fff",
        color: "#000",
        border: "1px solid #ddd",
        fontSize: "0.85rem",
        fontWeight: 700,
        letterSpacing: "normal",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, border-color 0.2s",
        marginTop: 8,
        borderRadius: 0,
    },
    spinner: {
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid #eee",
        borderTopColor: "#000",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
};
