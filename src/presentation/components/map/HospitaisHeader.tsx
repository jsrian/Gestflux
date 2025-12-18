import { MapPin } from "lucide-react";

export default function HospitaisHeader() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block mb-6 px">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Hospitais em João Pessoa
        </h1>
        <div className="flex items-center gap-2 text-gray-600 ">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">Sua localização: Manaíra, João Pessoa - PB</p>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden mb-4">
        <h1 className="text-xl font-medium text-gray-900 mb-1">
          Hospitais em João Pessoa
        </h1>
        <p className="text-sm text-gray-600">
          Sua localização: Manaíra, João Pessoa - PB
        </p>
    </div>
    </>
  );
}
