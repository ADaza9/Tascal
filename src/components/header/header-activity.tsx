import Link from "next/link";

export const HeaderActivity = ({ link, title}: { link:string, title: string}) => {
  return (
   <div className="flex items-center align-middle justify-start gap-2 mb-6 mx-4">
        <Link href={link} className="btn btn-primary" aria-label="back to dasboard">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
    );
}