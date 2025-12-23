import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white">
            <div className="relative h-32 w-32 animate-pulse">
                <Image
                    src="/logo.svg"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
