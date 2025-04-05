import { Terminal } from "lucide-react";

const Logo = () => {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <Terminal className="h-5 w-5" strokeWidth={2.5} />
      <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity hover:opacity-100" />
    </div>
  );
};

export default Logo;
