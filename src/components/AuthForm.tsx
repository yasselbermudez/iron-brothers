import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../AuthContext/auth-hooks';
import { useToast } from '../hooks/useToast';
import { Loader2 } from 'lucide-react';

interface UserData{
  email: string,
  password: string,
  name: string,
  role: string
}

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<UserData>({
    email: '',
    password: '',
    name: '',
    role: 'jugador'
  });
  const [loading, setLoading] = useState(false);
  //Toast
  const {addToast} = useToast()
  // Agregar navigate y location
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de origen o usar '/main' por defecto
  const from = location.state?.from?.pathname || '/main';
  
  // Usar el hook useAuth - esto funcionará porque AuthForms estará dentro de AuthProvider
  const { login, register } = useAuth();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(formData.email, formData.password);
        if (response.success) {
          navigate(from, { replace: true })
          addToast("Usuario Autenticado",)    
        }
        else addToast(response.message,"error")
      } else {
        const response = await register(formData.email, formData.password, formData.name, formData.role);
        if (response.success){
          navigate(from, { replace: true })
          addToast("Registro exitoso",)
        } 
        else addToast(response.message,"error")
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field:string, value:string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
  <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
    <div
      className="w-full max-w-md bg-cover bg-center bg-no-repeat rounded-xl"
      style={{ 
       backgroundImage: `linear-gradient(to bottom, rgba(1, 8, 45, 0.7), rgba(1, 8, 45,0.8)), url('./assets/brothers.jpg')`,
      }}
    >
      <Card 
        className={
          isLogin
          ?"w-full max-w-md relative z-10 border-slate-800"
          :"w-full max-w-md relative z-10 backdrop-blur-sm border-slate-800"
        }
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/icon.png" 
              alt="Iron Brothers Logo" 
              className="h-8 w-8 mr-2 object-contain"
            />
            <h1 className="text-4xl font-bold text-white">Iron Brothers</h1>
          </div>
          <CardTitle className="text-xl text-white">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Tipo de usuario
                </label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleChange('role', value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="jugador" className="focus:bg-slate-700 focus:text-white">Jugador</SelectItem>
                    <SelectItem value="espectador" className="focus:bg-slate-700 focus:text-white">Espectador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-950 hover:bg-slate-700 text-white font-medium rounded-xl"
              disabled={loading}
            >
              {loading 
                ? <><Loader2 className='animate-spin'/>Procesando</> 
                : isLogin 
                  ? 'Iniciar Sesión' 
                  : 'Crear Cuenta'
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              {isLogin 
                ? '¿No tienes cuenta? Crear una' 
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default AuthForms;