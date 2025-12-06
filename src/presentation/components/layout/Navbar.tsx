import { Bell, MapPin, Menu, Phone, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


export default function Navbar() {
  return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <img src="\logo.jpeg" alt="" className="rounded-lg" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Gestflux</h1>
              <p className="text-xs text-gray-500">Encontre a menor fila</p>
            </div>
          </div>

          {/* Barra de Pesquisa - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar hospital ou especialidade..." 
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <MapPin className="w-4 h-4 mr-2" />
              Hospitais
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <Phone className="w-4 h-4 mr-2" />
              Emergência
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
            </Button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa Mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar hospital..." 
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
    </nav>
)}
