import { useState } from "react";

interface snipperProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useSnipper = (): snipperProps => {
    const [isLoading, setIsLoading] = useState(false);
    return {
        isLoading,
        setIsLoading
    };
};