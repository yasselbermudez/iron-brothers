import { Loader2 } from "lucide-react";

export default function Loader({text}:{text?:string}){
    return (
      <div className="min-h-screen flex rounded-xl bg-slate-900 justify-center ">
        <div className="flex gap-3 mt-8 text-xl text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          {text?text:"Cargando..."}
        </div>
      </div>
    );
}