import Link from "next/link";

export default function ThemeLink({ className, href, title }) {
  return (
      <Link
        href={href}
        className={`focus:ring-4 focus:outline-none  
           font-medium rounded-lg text-sm px-8 py-3 text-center flex items-center 
           ${className}`}
      >
        {title}{" "}
        
      </Link>
  );
}
