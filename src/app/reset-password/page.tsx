'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPwdPage(){
    const [token, setToken] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) setToken(urlToken);
    }, [searchParams]);
    return(
        <><h1>Reset your password</h1><div>
            <p>Token: {token}</p>
        </div></>
    );
}