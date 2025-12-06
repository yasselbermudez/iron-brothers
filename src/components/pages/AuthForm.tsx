// AuthForms.jsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dumbbell, Sword } from 'lucide-react';
import { useAuth } from '../../AuthContext/auth-hooks';

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
        console.log("login")
        const success = await login(formData.email, formData.password);
        console.log("respuesta de el login",success)
        if (success) navigate(from, { replace: true });
        else alert('Error al iniciar sesión. Escribe bien tus credenciales mamaguebo.');
      } else {
        const success = await register(formData.email, formData.password, formData.name, formData.role);
        console.log("respuesta de el register",success)
        if (success) navigate(from, { replace: true });
        else alert('Error al registrarse. Tu email no es digno.');
      }
    } catch (error) {
      console.log("se capturo un error")
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
      
      {/* style={{ backgroundImage: `url('ruta/a/tu/imagen.png')` }}  mas control sobre la imagen de fondo*/}
      <div
        className="w-full max-w-md bg-cover bg-center bg-no-repeat rounded-xl"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.9)), url('./assets/ronnie_photo.jpg')`,
        }}
      >

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-10 w-10 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Look at the Aesthetics</h1>
            <Sword className="h-10 w-10 text-red-600 mr-2" />
          </div>
          <CardTitle className="text-xl">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de usuario
                </label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleChange('role', value)}
                >
                  <SelectTrigger >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="jugador">Jugador</SelectItem>
                    <SelectItem value="espectador">Espectador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? 'Procesando...' 
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
              className="text-red-600 hover:text-red-700 text-sm"
            >
              {isLogin 
                ? '¿No tienes cuenta? Acaso eres gay? create una nueva' 
                : '¿Ya tienes cuenta? Eres un tanque! inicia sesión'
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