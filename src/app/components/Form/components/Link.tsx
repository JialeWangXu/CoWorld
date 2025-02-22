'use client'

interface linkProps {
    text: string;
    linkText: string;
    href: string;
}

export function Links({text,linkText,href}: linkProps) {

    return(
        <p className="text-body-secondary">
            {text}<a href={href} className="text-black fw-bold">{linkText}</a>.
        </p>
    )
}